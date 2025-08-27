import { openAPIParser, createParser, OpenAPIParser, ParseOptions } from '../src/parser';
import { OpenAPIV3 } from 'openapi-types';
import express from 'express';
import request from 'supertest';



// Mock OpenAPI spec for testing
const mockSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '1.0.0'
  },
  paths: {
    '/users/{userId}': {
      get: {
        operationId: 'getUser',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': { description: 'Success' }
        }
      },
      put: {
        operationId: 'updateUser',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  age: { type: 'integer', minimum: 0 }
                },
                required: ['name', 'email']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Success' }
        }
      }
    },
    '/users': {
      get: {
        operationId: 'getUsers',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          },
          {
            name: 'active',
            in: 'query',
            schema: { type: 'boolean' }
          },
          {
            name: 'tags',
            in: 'query',
            schema: { type: 'array', items: { type: 'string' } }
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['name', 'email', 'createdAt'] }
          }
        ],
        responses: {
          '200': { description: 'Success' }
        }
      }
    }
  }
};

describe('OpenAPIParser Class', () => {
  let parser: OpenAPIParser;

  beforeEach(() => {
    parser = new OpenAPIParser(mockSpec);
  });

  describe('parsePathParams', () => {
    it('should parse path parameters according to schema', () => {
      const path = '/users/{userId}';
      const params = { userId: '123e4567-e89b-12d3-a456-426614174000' };
      
      const result = parser.parsePathParams(path, params);
      
      expect(result.userId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return original params if path not found in spec', () => {
      const path = '/unknown/path';
      const params = { id: '123' };
      
      const result = parser.parsePathParams(path, params);
      
      expect(result).toEqual(params);
    });

    it('should handle path parameters not in schema', () => {
      const path = '/users/{userId}';
      const params = { userId: '123', extra: 'value' };
      
      const result = parser.parsePathParams(path, params);
      
      expect(result.userId).toBe('123');
      expect(result.extra).toBe('value');
    });
  });

  describe('parseQueryParams', () => {
    it('should parse integer query parameters', () => {
      const path = '/users';
      const method = 'GET';
      const query = { page: '2', limit: '25' };
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(25);
    });

    it('should parse boolean query parameters', () => {
      const path = '/users';
      const method = 'GET';
      const query = { active: 'true' };
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result.active).toBe(true);
    });

    it('should parse array query parameters', () => {
      const path = '/users';
      const method = 'GET';
      const query = { tags: 'javascript,typescript,node' };
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result.tags).toEqual(['javascript', 'typescript', 'node']);
    });

    it('should handle enum query parameters', () => {
      const path = '/users';
      const method = 'GET';
      const query = { sortBy: 'name' };
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result.sortBy).toBe('name');
    });

    it('should preserve non-schema query parameters', () => {
      const path = '/users';
      const method = 'GET';
      const query = { page: '1', custom: 'value' };
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result.page).toBe(1);
      expect(result.custom).toBe('value');
    });

    it('should handle empty query parameters', () => {
      const path = '/users';
      const method = 'GET';
      const query = {};
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result).toEqual({});
    });

    it('should return original query if operation not found', () => {
      const path = '/users';
      const method = 'POST';
      const query = { page: '1' };
      
      const result = parser.parseQueryParams(path, method, query);
      
      expect(result).toEqual(query);
    });
  });

  describe('parseValue', () => {
    it('should parse integer values', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'integer' };
      
      expect(parser['parseValue']('123', schema)).toBe(123);
      expect(parser['parseValue']('0', schema)).toBe(0);
      expect(parser['parseValue']('-456', schema)).toBe(-456);
    });

    it('should parse number values', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'number' };
      
      expect(parser['parseValue']('123.45', schema)).toBe(123.45);
      expect(parser['parseValue']('0.0', schema)).toBe(0);
      expect(parser['parseValue']('-456.789', schema)).toBe(-456.789);
    });

    it('should parse boolean values', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'boolean' };
      
      expect(parser['parseValue']('true', schema)).toBe(true);
      expect(parser['parseValue']('false', schema)).toBe(false);
      expect(parser['parseValue']('1', schema)).toBe(true);
      expect(parser['parseValue']('0', schema)).toBe(false);
      expect(parser['parseValue']('yes', schema)).toBe(true);
      expect(parser['parseValue']('no', schema)).toBe(false);
    });

    it('should parse string values', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'string' };
      
      expect(parser['parseValue']('hello', schema)).toBe('hello');
      expect(parser['parseValue']('123', schema)).toBe('123');
      expect(parser['parseValue']('', schema)).toBe('');
    });

    it('should parse date-time format strings', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'string', format: 'date-time' };
      const validDate = '2023-01-01T00:00:00Z';
      
      expect(parser['parseValue'](validDate, schema)).toBe(validDate);
    });

    it('should throw error for invalid date-time', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'string', format: 'date-time' };
      const invalidDate = 'invalid-date';
      
      expect(() => parser['parseValue'](invalidDate, schema)).toThrow('Invalid date-time');
    });

    it('should parse UUID format strings', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'string', format: 'uuid' };
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      
      expect(parser['parseValue'](validUuid, schema)).toBe(validUuid);
    });

    it('should throw error for invalid UUID', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'string', format: 'uuid' };
      const invalidUuid = 'invalid-uuid';
      
      expect(() => parser['parseValue'](invalidUuid, schema)).toThrow('Invalid UUID');
    });

    it('should parse array values', () => {
      const schema: OpenAPIV3.ArraySchemaObject = { type: 'array', items: { type: 'string' } };
      const arrayString = 'item1,item2,item3';
      
      const result = parser['parseValue'](arrayString, schema);
      
      expect(result).toEqual(['item1', 'item2', 'item3']);
    });

    it('should handle null and undefined values', () => {
      const schema: OpenAPIV3.NonArraySchemaObject = { type: 'integer' };
      
      expect(parser['parseValue'](null, schema)).toBeNull();
      expect(parser['parseValue'](undefined, schema)).toBeNull();
      expect(parser['parseValue']('', schema)).toBeNull();
    });
  });

  describe('parseInteger', () => {
    it('should parse valid integers', () => {
      expect(parser['parseInteger']('123')).toBe(123);
      expect(parser['parseInteger']('0')).toBe(0);
      expect(parser['parseInteger']('-456')).toBe(-456);
    });

    it('should return null for invalid integers', () => {
      expect(parser['parseInteger']('123.45')).toBeNull();
      expect(parser['parseInteger']('abc')).toBeNull();
      expect(parser['parseInteger']('')).toBeNull();
    });

    it('should handle strict number validation', () => {
      const strictParser = new OpenAPIParser(mockSpec, { strictNumbers: true });
      
      expect(() => strictParser['parseInteger']('123.45')).toThrow('Invalid integer');
    });
  });

  describe('parseNumber', () => {
    it('should parse valid numbers', () => {
      expect(parser['parseNumber']('123.45')).toBe(123.45);
      expect(parser['parseNumber']('0')).toBe(0);
      expect(parser['parseNumber']('-456.789')).toBe(-456.789);
    });

    it('should return null for invalid numbers', () => {
      expect(parser['parseNumber']('abc')).toBeNull();
      expect(parser['parseNumber']('')).toBeNull();
    });

    it('should handle strict number validation', () => {
      const strictParser = new OpenAPIParser(mockSpec, { strictNumbers: true });
      
      expect(() => strictParser['parseNumber']('abc')).toThrow('Invalid number');
    });
  });

  describe('parseBoolean', () => {
    it('should parse boolean strings', () => {
      expect(parser['parseBoolean']('true')).toBe(true);
      expect(parser['parseBoolean']('false')).toBe(false);
      expect(parser['parseBoolean']('1')).toBe(true);
      expect(parser['parseBoolean']('0')).toBe(false);
      expect(parser['parseBoolean']('yes')).toBe(true);
      expect(parser['parseBoolean']('no')).toBe(false);
    });

    it('should handle strict boolean validation', () => {
      const strictParser = new OpenAPIParser(mockSpec, { strictBooleans: true });
      
      expect(strictParser['parseBoolean']('true')).toBe(true);
      expect(strictParser['parseBoolean']('false')).toBe(false);
      expect(() => strictParser['parseBoolean']('1')).toThrow('Invalid boolean');
    });

    it('should handle various boolean representations', () => {
      expect(parser['parseBoolean'](true)).toBe(true);
      expect(parser['parseBoolean'](false)).toBe(false);
      expect(parser['parseBoolean'](1)).toBe(true);
      expect(parser['parseBoolean'](0)).toBe(false);
    });
  });
});

describe('openAPIParser Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should parse path parameters and override req.params', async () => {
    // Apply middleware before defining routes
    app.use(openAPIParser('./test/workspace-1/example-openapi.json'));
    
    app.get('/users/:userId', (req, res) => {
      res.json({
        params: req.params,
        originalParams: req.params
      });
    });

    const response = await request(app)
      .get('/users/123')
      .expect(200);

    expect(response.body.params).toBeDefined();
    expect(response.body.params.userId).toBe('123');
  });

  it('should parse query parameters and override req.query', async () => {
    // Apply middleware before defining routes
    app.use(openAPIParser('./test/workspace-1/example-openapi.json'));
    
    app.get('/users', (req, res) => {
      res.json({
        query: req.query,
        originalQuery: req.query
      });
    });

    const response = await request(app)
      .get('/users?page=2&limit=25')
      .expect(200);

    expect(response.body.query).toBeDefined();
    expect(response.body.query.page).toBe(2);
    expect(response.body.query.limit).toBe(25);
  });

  it('should handle requests without parameters gracefully', async () => {
    // Apply middleware before defining routes
    app.use(openAPIParser('./test/workspace-1/example-openapi.json'));
    
    app.get('/simple', (req, res) => {
      res.json({
        hasParams: req.params && Object.keys(req.params).length > 0,
        hasQuery: req.query && Object.keys(req.query).length > 0
      });
    });

    const response = await request(app)
      .get('/simple')
      .expect(200);

    expect(response.body.hasParams).toBe(false);
    expect(response.body.hasQuery).toBe(false);
  });

  it('should handle malformed OpenAPI spec gracefully', () => {
    expect(() => {
      openAPIParser('./non-existent-file.json');
    }).toThrow('Failed to load OpenAPI spec');
  });

  it('should work with custom parsing options', () => {
    const options: ParseOptions = {
      coerceTypes: false,
      strictNumbers: true,
      strictBooleans: true
    };

    expect(() => {
      openAPIParser('./test/workspace-1/example-openapi.json', options);
    }).not.toThrow();
  });
});

describe('createOpenAPIParser (Legacy)', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should work with direct spec object', async () => {
    const parser = new OpenAPIParser(mockSpec);
    
    app.get('/users/:userId', (req, res) => {
      const parsedParams = parser.parsePathParams('/users/:userId', req.params);
      res.json({
        parsedParams,
        originalParams: req.params
      });
    });

    const response = await request(app)
      .get('/users/123')
      .expect(200);

    expect(response.body.parsedParams).toBeDefined();
    expect(response.body.parsedParams.userId).toBe('123');
  });
}); 