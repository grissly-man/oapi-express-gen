import { OpenAPIV3 } from 'openapi-types';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Extend Express Request interface
declare module 'express' {
  interface Request {
    parsedParams?: Record<string, any>;
    parsedQuery?: Record<string, any>;
  }
}

export interface ParseOptions {
  coerceTypes?: boolean;
  strictNumbers?: boolean;
  strictBooleans?: boolean;
}

export class OpenAPIParser {
  private spec: OpenAPIV3.Document;
  private options: ParseOptions;

  constructor(spec: OpenAPIV3.Document, options: ParseOptions = {}) {
    this.spec = spec;
    this.options = {
      coerceTypes: true,
      strictNumbers: false,
      strictBooleans: false,
      ...options
    };
  }

  /**
   * Parse path parameters according to OpenAPI schema
   */
  parsePathParams(path: string, params: Record<string, string>): Record<string, any> {
    const pathItem = this.findPathItem(path);
    if (!pathItem) return params;

    const parsed: Record<string, any> = {};
    
    for (const [name, value] of Object.entries(params)) {
      const param = this.findPathParameter(pathItem, name);
      if (param && this.isParameterObject(param) && param.schema) {
        parsed[name] = this.parseValue(value, param.schema);
      } else {
        parsed[name] = value;
      }
    }

    return parsed;
  }

  /**
   * Parse query parameters according to OpenAPI schema
   */
  parseQueryParams(path: string, method: string, query: Record<string, any>): Record<string, any> {
    const pathItem = this.findPathItem(path);
    if (!pathItem) return query;

    const operation = pathItem[method.toLowerCase() as keyof OpenAPIV3.PathItemObject];
    if (!operation || !this.isOperationObject(operation)) return query;

    const parsed: Record<string, any> = {};
    
    if (operation.parameters) {
      for (const param of operation.parameters) {
        if (this.isParameterObject(param) && param.in === 'query' && param.schema) {
          const value = query[param.name];
          if (value !== undefined) {
            parsed[param.name] = this.parseValue(value, param.schema);
          }
        }
      }
    }

    // Add any remaining query params that weren't in the schema
    for (const [name, value] of Object.entries(query)) {
      if (!(name in parsed)) {
        parsed[name] = value;
      }
    }

    return parsed;
  }

  /**
   * Parse a single value according to OpenAPI schema
   */
  private parseValue(value: any, schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): any {
    if (!this.isSchemaObject(schema)) return value;
    
    // Handle arrays
    if (schema.type === 'array' && Array.isArray(value)) {
      if (schema.items && this.isSchemaObject(schema.items)) {
        return value.map(item => this.parseValue(item, schema.items!));
      }
      return value;
    }

    // Handle single values
    if (schema.type === 'array' && typeof value === 'string') {
      // Handle comma-separated arrays (OpenAPI 3.0 style)
      const items = value.split(',');
      if (schema.items && this.isSchemaObject(schema.items)) {
        return items.map(item => this.parseValue(item.trim(), schema.items!));
      }
      return items;
    }

    // Handle primitive types
    switch (schema.type) {
      case 'integer':
        return this.parseInteger(value);
      case 'number':
        return this.parseNumber(value);
      case 'boolean':
        return this.parseBoolean(value);
      case 'string':
        return this.parseString(value, schema);
      default:
        return value;
    }
  }

  private parseInteger(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    
    const num = Number(value);
    if (this.options.strictNumbers && !Number.isInteger(num)) {
      throw new Error(`Invalid integer: ${value}`);
    }
    
    return Number.isInteger(num) ? num : null;
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    
    const num = Number(value);
    if (this.options.strictNumbers && !Number.isFinite(num)) {
      throw new Error(`Invalid number: ${value}`);
    }
    
    return Number.isFinite(num) ? num : null;
  }

  private parseBoolean(value: any): boolean | null {
    if (value === null || value === undefined || value === '') return null;
    
    if (this.options.strictBooleans) {
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new Error(`Invalid boolean: ${value}`);
    }
    
    // More permissive boolean parsing
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1' || lower === 'yes') return true;
      if (lower === 'false' || lower === '0' || lower === 'no') return false;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    
    return Boolean(value);
  }

  private parseString(value: any, schema: OpenAPIV3.NonArraySchemaObject): string | null {
    if (value === null || value === undefined) return null;
    
    const str = String(value);
    
    // Handle format-specific parsing
    if (schema.format === 'date-time') {
      const date = new Date(str);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date-time: ${value}`);
      }
    } else if (schema.format === 'date') {
      const date = new Date(str);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`);
      }
    } else if (schema.format === 'uuid') {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(str)) {
        throw new Error(`Invalid UUID: ${value}`);
      }
    }
    
    return str;
  }

  private findPathItem(path: string): OpenAPIV3.PathItemObject | undefined {
    // Convert Express route path to OpenAPI path format
    const openAPIPath = this.convertExpressPathToOpenAPI(path);
    
    // Try exact match first
    if (this.spec.paths[openAPIPath]) {
      return this.spec.paths[openAPIPath];
    }
    
    // Try to find a matching path by comparing patterns
    for (const specPath of Object.keys(this.spec.paths)) {
      if (this.pathsMatch(openAPIPath, specPath)) {
        return this.spec.paths[specPath];
      }
    }
    
    return undefined;
  }

  private convertExpressPathToOpenAPI(expressPath: string): string {
    // Convert /users/:userId to /users/{userId}
    return expressPath.replace(/\/:([^\/]+)/g, '/{$1}');
  }

  private pathsMatch(expressPath: string, openAPIPath: string): boolean {
    // Convert Express path to OpenAPI format for comparison
    const convertedExpressPath = this.convertExpressPathToOpenAPI(expressPath);
    return convertedExpressPath === openAPIPath;
  }

  public extractPathParams(routePattern: string, urlPath: string): Record<string, string> {
    const params: Record<string, string> = {};
    
    // Convert route pattern like '/users/:userId' to regex
    const regexPattern = routePattern.replace(/\/:([^\/]+)/g, '/([^/]+)');
    const regex = new RegExp(`^${regexPattern}$`);
    
    const match = urlPath.match(regex);
    if (match) {
      // Extract parameter names from route pattern
      const paramNames = (routePattern.match(/\/:([^\/]+)/g) || []).map(name => name.substring(2));
      
      // Extract values from URL match
      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = match[i + 1];
      }
    }
    
    return params;
  }

  private findPathParameter(pathItem: OpenAPIV3.PathItemObject, name: string): OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject | undefined {
    if (!pathItem.parameters) return undefined;
    
    return pathItem.parameters.find(param => {
      if (this.isParameterObject(param)) {
        return param.in === 'path' && param.name === name;
      }
      return false;
    });
  }

  private isParameterObject(param: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): param is OpenAPIV3.ParameterObject {
    return 'in' in param;
  }

  private isSchemaObject(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): schema is OpenAPIV3.SchemaObject {
    return schema && typeof schema === 'object' && 'type' in schema;
  }

  private isOperationObject(operation: any): operation is OpenAPIV3.OperationObject {
    return operation && typeof operation === 'object' && 'operationId' in operation;
  }
}

/**
 * Create a parser instance from an OpenAPI spec file
 * Usage: const parser = createParser('./spec.yaml')
 */
export function createParser(specPath: string, options?: ParseOptions): OpenAPIParser {
  let spec: OpenAPIV3.Document;
  
  try {
    const specContent = fs.readFileSync(specPath, 'utf-8');
    
    // Check if it's YAML or JSON based on file extension
    if (specPath.endsWith('.yaml') || specPath.endsWith('.yml')) {
      spec = yaml.load(specContent) as OpenAPIV3.Document;
    } else {
      spec = JSON.parse(specContent);
    }
  } catch (error) {
    throw new Error(`Failed to load OpenAPI spec from ${specPath}: ${error}`);
  }
  
  return new OpenAPIParser(spec, options);
}

/**
 * Express middleware for parsing path and query parameters
 * Usage: app.use(openAPIParser('./spec.yaml'))
 * Note: This middleware only works for routes defined after it
 */
export function openAPIParser(specPath: string, options?: ParseOptions) {
  const parser = createParser(specPath, options);
  
  return function middleware(req: any, res: any, next: any) {
    try {
      const routePath = req.route?.path || req.path;
      
      // Parse and override path parameters directly
      if (req.params && Object.keys(req.params).length > 0) {
        req.params = parser.parsePathParams(routePath, req.params);
      }
      
      // Parse and override query parameters directly
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = parser.parseQueryParams(routePath, req.method, req.query);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Legacy function for backward compatibility
export function createOpenAPIParser(spec: OpenAPIV3.Document, options?: ParseOptions) {
  const parser = new OpenAPIParser(spec, options);
  
  return function middleware(req: any, res: any, next: any) {
    try {
      // Parse path parameters
      if (req.params && Object.keys(req.params).length > 0) {
        req.parsedParams = parser.parsePathParams(req.route?.path || req.path, req.params);
      }
      
      // Parse query parameters
      if (req.query && Object.keys(req.query).length > 0) {
        req.parsedQuery = parser.parseQueryParams(req.route?.path || req.path, req.method, req.query);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
} 