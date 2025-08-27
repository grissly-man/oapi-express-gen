import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { OpenAPIV3 } from 'openapi-types';

// Export the parser
export { createOpenAPIParser, OpenAPIParser, ParseOptions } from './parser';

interface PathParam {
  name: string;
  properties: Record<string, PropertyInfo>;
  required: string[];
  additionalProperties?: boolean;
}

interface QueryParam {
  name: string;
  properties: Record<string, PropertyInfo>;
  required: string[];
  additionalProperties?: boolean;
}

interface BodySchema {
  name: string;
  properties: Record<string, PropertyInfo>;
  required: string[];
  additionalProperties?: boolean;
}

interface ResponseSchema {
  name: string;
  properties: Record<string, PropertyInfo>;
  required: string[];
  additionalProperties?: boolean;
}

interface ArrayItemSchema {
  name: string;
  properties: Record<string, PropertyInfo>;
  required: string[];
  additionalProperties?: boolean;
}

interface PropertyInfo {
  type: string;
  required: boolean;
  description?: string;
}

interface Operation {
  operationId: string;
  httpMethod: string;
  path: string;
  pathParams?: string;
  queryParams?: string;
  bodySchema?: string;
  responseSchema?: string;
}

interface TemplateData {
  specTitle: string;
  specVersion: string;
  operations: Operation[];
  pathParams: PathParam[];
  queryParams: QueryParam[];
  bodySchemas: BodySchema[];
  responseSchemas: ResponseSchema[];
  arrayItemSchemas: ArrayItemSchema[];
  hasPathParams: boolean;
  hasQueryParams: boolean;
  hasBodySchemas: boolean;
  hasResponseSchemas: boolean;
  hasArrayItemSchemas: boolean;
}

export class OpenAPIGenerator {
  private spec: OpenAPIV3.Document;
  private templateData: TemplateData;
  private customTemplatePath?: string;

  constructor(specPath: string, customTemplatePath?: string) {
    const specContent = fs.readFileSync(specPath, 'utf-8');
    this.spec = JSON.parse(specContent);
    this.customTemplatePath = customTemplatePath;
    this.templateData = this.buildTemplateData();
  }

  private isParameterObject(param: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): param is OpenAPIV3.ParameterObject {
    return 'in' in param;
  }

  private isSchemaObject(schema: any): schema is OpenAPIV3.SchemaObject {
    return schema && typeof schema === 'object' && 'type' in schema;
  }

  private isRequestBodyObject(requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject): requestBody is OpenAPIV3.RequestBodyObject {
    return 'content' in requestBody;
  }

  private isResponseObject(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject): response is OpenAPIV3.ResponseObject {
    return 'content' in response;
  }

  private mapOpenAPITypeToTS(schema: OpenAPIV3.SchemaObject, operationId?: string, propertyName?: string): string {
    if (!schema || typeof schema !== 'object') return 'any';
    
    if (schema.type === 'string') {
      if (schema.enum) return `'${schema.enum.join("' | '")}'`;
      if (schema.format === 'date-time') return 'Date';
      if (schema.format === 'date') return 'Date';
      if (schema.format === 'uuid') return 'string';
      return 'string';
    }
    
    if (schema.type === 'number' || schema.type === 'integer') {
      if (schema.format === 'int64') return 'number';
      return 'number';
    }
    
    if (schema.type === 'boolean') return 'boolean';
    
    if (schema.type === 'array') {
      if (schema.items && this.isSchemaObject(schema.items)) {
        // If we have an operationId and propertyName and this is an array of objects, use the generated interface
        if (operationId && propertyName && schema.items.properties) {
          const arrayItemInterfaceName = `${operationId}${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}Item`;
          return `${arrayItemInterfaceName}[]`;
        }
        return `${this.mapOpenAPITypeToTS(schema.items)}[]`;
      }
      return 'any[]';
    }
    
    if (schema.type === 'object') {
      if (schema.properties) {
        // For objects with properties, we'll generate a proper interface
        // This will be handled by the template generation
        return 'any';
      }
      return 'Record<string, any>';
    }
    
    // Check for $ref in the schema object
    if ('$ref' in schema && schema.$ref) {
      // Handle references - for now return any, could be enhanced to resolve refs
      return 'any';
    }
    
    return 'any';
  }

  private convertPathToExpress(path: string): string {
    // Convert OpenAPI path parameters {paramName} to Express format :paramName
    return path.replace(/\{([^}]+)\}/g, ':$1');
  }

  private buildTemplateData(): TemplateData {
    const operations: Operation[] = [];
    const pathParams = new Map<string, PathParam>();
    const queryParams = new Map<string, QueryParam>();
    const bodySchemas = new Map<string, BodySchema>();
    const responseSchemas = new Map<string, ResponseSchema>();
    const arrayItemSchemas = new Map<string, ArrayItemSchema>();

    // Process each path and method
    Object.entries(this.spec.paths).forEach(([path, pathItem]) => {
      if (!pathItem) return;

      const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;
      
      methods.forEach(method => {
        const operation = pathItem[method];
        if (!operation || !operation.operationId) return;

        const operationData: Operation = {
          operationId: operation.operationId,
          httpMethod: method,
          path: this.convertPathToExpress(path)
        };

        // Process path parameters
        if (operation.parameters) {
          const pathParamsList = operation.parameters.filter(p => this.isParameterObject(p) && p.in === 'path');
          if (pathParamsList.length > 0) {
            const pathParamName = `${operation.operationId}PathParams`;
            operationData.pathParams = pathParamName;
            
            const properties: Record<string, PropertyInfo> = {};
            const required: string[] = [];
            pathParamsList.forEach(param => {
              if (this.isParameterObject(param) && param.schema && this.isSchemaObject(param.schema)) {
                properties[param.name] = {
                  type: this.mapOpenAPITypeToTS(param.schema, operation.operationId, param.name),
                  required: param.required !== false, // Path params are required by default
                  description: param.description
                };
                if (param.required !== false) {
                  required.push(param.name);
                }
              }
            });
            
            pathParams.set(pathParamName, { 
              name: pathParamName, 
              properties, 
              required,
              additionalProperties: false
            });
          }
        }

        // Process query parameters
        if (operation.parameters) {
          const queryParamsList = operation.parameters.filter(p => this.isParameterObject(p) && p.in === 'query');
          if (queryParamsList.length > 0) {
            const queryParamName = `${operation.operationId}QueryParams`;
            operationData.queryParams = queryParamName;
            
            const properties: Record<string, PropertyInfo> = {};
            const required: string[] = [];
            queryParamsList.forEach(param => {
              if (this.isParameterObject(param) && param.schema && this.isSchemaObject(param.schema)) {
                properties[param.name] = {
                  type: this.mapOpenAPITypeToTS(param.schema, operation.operationId, param.name),
                  required: param.required === true,
                  description: param.description
                };
                if (param.required === true) {
                  required.push(param.name);
                }
              }
            });
            
            queryParams.set(queryParamName, { 
              name: queryParamName, 
              properties, 
              required,
              additionalProperties: false
            });
          }
        }

        // Process request body
        if (operation.requestBody && this.isRequestBodyObject(operation.requestBody)) {
          const bodySchemaName = `${operation.operationId}Body`;
          operationData.bodySchema = bodySchemaName;
          
          if (operation.requestBody.content && operation.requestBody.content['application/json']) {
            const schema = operation.requestBody.content['application/json'].schema;
            if (schema && this.isSchemaObject(schema) && schema.properties) {
              const properties: Record<string, PropertyInfo> = {};
              const required: string[] = schema.required || [];
              
              Object.entries(schema.properties).forEach(([propName, propSchema]) => {
                if (this.isSchemaObject(propSchema)) {
                  properties[propName] = {
                    type: this.mapOpenAPITypeToTS(propSchema, operation.operationId, propName),
                    required: required.includes(propName),
                    description: propSchema.description
                  };
                }
              });
              
              bodySchemas.set(bodySchemaName, { 
                name: bodySchemaName, 
                properties, 
                required,
                additionalProperties: schema.additionalProperties !== false
              });
            }
          }
        }

        // Process responses
        if (operation.responses) {
          const successResponse = operation.responses['200'] || operation.responses['201'];
          if (successResponse && this.isResponseObject(successResponse) && successResponse.content && successResponse.content['application/json']) {
            const schema = successResponse.content['application/json'].schema;
            if (schema && this.isSchemaObject(schema) && schema.properties) {
              const responseSchemaName = `${operation.operationId}Response`;
              operationData.responseSchema = responseSchemaName;
              
              const properties: Record<string, PropertyInfo> = {};
              const required: string[] = schema.required || [];
              
              Object.entries(schema.properties).forEach(([propName, propSchema]) => {
                if (this.isSchemaObject(propSchema)) {
                  properties[propName] = {
                    type: this.mapOpenAPITypeToTS(propSchema, operation.operationId, propName),
                    required: required.includes(propName),
                    description: propSchema.description
                  };
                }
              });
              
              responseSchemas.set(responseSchemaName, { 
                name: responseSchemaName, 
                properties, 
                required,
                additionalProperties: schema.additionalProperties !== false
              });
            }
          }
        }

        // Process array items in request body
        if (operation.requestBody && this.isRequestBodyObject(operation.requestBody)) {
          const requestBodyContent = operation.requestBody.content;
          if (requestBodyContent && requestBodyContent['application/json'] && requestBodyContent['application/json'].schema) {
            const schema = requestBodyContent['application/json'].schema;
            if (schema && this.isSchemaObject(schema) && schema.type === 'array' && schema.items) {
              const arrayItemSchemaName = `${operation.operationId}ArrayItem`;
              const properties: Record<string, PropertyInfo> = {};
              const required: string[] = [];
              
              if (this.isSchemaObject(schema.items) && schema.items.properties) {
                const itemRequired = schema.items.required || [];
                Object.entries(schema.items.properties).forEach(([propName, propSchema]) => {
                  if (this.isSchemaObject(propSchema)) {
                    properties[propName] = {
                      type: this.mapOpenAPITypeToTS(propSchema, operation.operationId),
                      required: itemRequired.includes(propName),
                      description: propSchema.description
                    };
                  }
                });
              }
              
              arrayItemSchemas.set(arrayItemSchemaName, { 
                name: arrayItemSchemaName, 
                properties, 
                required,
                additionalProperties: false
              });
            }
          }
        }

        // Process array items in responses
        if (operation.responses) {
          const successResponse = operation.responses['200'] || operation.responses['201'];
          if (successResponse && this.isResponseObject(successResponse) && successResponse.content && successResponse.content['application/json']) {
            const schema = successResponse.content['application/json'].schema;
            if (schema && this.isSchemaObject(schema) && schema.properties) {
              // Check for array properties in the response schema
              Object.entries(schema.properties).forEach(([propName, propSchema]) => {
                if (this.isSchemaObject(propSchema) && propSchema.type === 'array' && propSchema.items) {
                  const arrayItemSchemaName = `${operation.operationId}${propName.charAt(0).toUpperCase() + propName.slice(1)}Item`;
                  const properties: Record<string, PropertyInfo> = {};
                  const required: string[] = [];
                  
                  if (this.isSchemaObject(propSchema.items) && propSchema.items.properties) {
                    const itemRequired = propSchema.items.required || [];
                    Object.entries(propSchema.items.properties).forEach(([itemPropName, itemPropSchema]) => {
                      if (this.isSchemaObject(itemPropSchema)) {
                        properties[itemPropName] = {
                          type: this.mapOpenAPITypeToTS(itemPropSchema, operation.operationId),
                          required: itemRequired.includes(itemPropName),
                          description: itemPropSchema.description
                        };
                      }
                    });
                  }
                  
                  arrayItemSchemas.set(arrayItemSchemaName, { 
                    name: arrayItemSchemaName, 
                    properties, 
                    required,
                    additionalProperties: false
                  });
                }
              });
            }
          }
        }

        operations.push(operationData);
      });
    });

    return {
      specTitle: this.spec.info?.title || 'Unknown API',
      specVersion: this.spec.info?.version || '1.0.0',

      operations,
      pathParams: Array.from(pathParams.values()),
      queryParams: Array.from(queryParams.values()),
      bodySchemas: Array.from(bodySchemas.values()),
      responseSchemas: Array.from(responseSchemas.values()),
      arrayItemSchemas: Array.from(arrayItemSchemas.values()),
      hasPathParams: pathParams.size > 0,
      hasQueryParams: queryParams.size > 0,
      hasBodySchemas: bodySchemas.size > 0,
      hasResponseSchemas: responseSchemas.size > 0,
      hasArrayItemSchemas: arrayItemSchemas.size > 0
    };
  }

  public generate(outputPath: string): void {
    // Read the template
    const templatePath = this.customTemplatePath || path.join(__dirname, '../templates/handlers.ts.hbs');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile the template
    const template = Handlebars.compile(templateContent);
    
    // Generate the code
    const generatedCode = template(this.templateData);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the generated code
    fs.writeFileSync(outputPath, generatedCode);
    
    console.log(`Generated handlers at: ${outputPath}`);
    console.log(`Generated ${this.templateData.operations.length} operations`);
  }

  // CLI helper methods
  public getSpecInfo(): string {
    return `${this.spec.info?.title || 'Unknown API'} v${this.spec.info?.version || '1.0.0'}`;
  }

  public getOperationCount(): number {
    return this.templateData.operations.length;
  }
}

// Legacy CLI usage for backward compatibility
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npm run generate <openapi-spec.json> <output-path>');
    console.log('Example: npm run generate ./openapi.json ./src/generated/handlers.ts');
    console.log('\nFor the new CLI interface, use: oapi-express-gen <source> [options]');
    process.exit(1);
  }
  
  const [specPath, outputPath] = args;
  
  try {
    const generator = new OpenAPIGenerator(specPath);
    generator.generate(outputPath);
  } catch (error) {
    console.error('Error generating handlers:', error);
    process.exit(1);
  }
} 