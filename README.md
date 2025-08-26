# OpenAPI Express Generator

A code generator that creates fully-typed Express.js handlers from OpenAPI specifications.

## Features

- **Fully Typed**: Generates TypeScript interfaces for request bodies, query parameters, path parameters, and responses
- **Express Integration**: Creates handlers that integrate seamlessly with Express.js
- **OpenAPI 3.0 Support**: Parses OpenAPI 3.0.x specifications
- **Automatic Route Registration**: Includes helper functions to register all generated handlers
- **Test Workspaces**: Multiple test workspaces with snapshot testing
- **Command Line Interface**: Easy-to-use CLI with Commander.js

## Installation

```bash
npm install
```

## Usage

### CLI Interface (Recommended)

The generator now provides a modern CLI interface:

```bash
# Basic usage
oapi-express-gen <source-file>

# With custom output path
oapi-express-gen ./openapi.json -o ./src/handlers.ts

# With verbose logging
oapi-express-gen ./openapi.json -o ./src/handlers.ts -v

# Validate OpenAPI spec without generating code
oapi-express-gen validate ./openapi.json

# Use custom template
oapi-express-gen ./openapi.json -t ./custom-template.hbs
```

#### CLI Options

- `-o, --output <path>`: Output path for generated handlers (default: `./generated/handlers.ts`)
- `-t, --template <path>`: Custom Handlebars template path
- `-v, --verbose`: Enable verbose logging
- `-h, --help`: Show help information

#### CLI Commands

- `generate <source>`: Generate handlers from OpenAPI spec (default command)
- `validate <source>`: Validate OpenAPI specification without generating code

### Legacy Usage

For backward compatibility, you can still use the old method:

```bash
npm run generate <openapi-spec.json> <output-path>
```

Example:
```bash
npm run generate ./openapi.json ./src/generated/handlers.ts
```

### 2. Use Generated Handlers

The generator creates a `Handlers` type that maps operation IDs to fully-typed handler functions:

```typescript
import { Handlers } from './generated/handlers';

// Implement your handlers
const handlers: Handlers = {
  getUser: (req, res) => {
    // req.params.userId is fully typed
    // req.query.page is fully typed (if defined)
    // req.body is fully typed (if defined)
    
    const userId = req.params.userId; // string
    const page = req.query.page; // number | undefined
    
    res.json({ userId, page });
  },
  
  createUser: (req, res) => {
    // req.body is fully typed with user properties
    const { name, email } = req.body;
    
    res.json({ id: '123', name, email });
  }
};

// Register handlers with Express
import { registerHandlers } from './generated/handlers';
import express from 'express';

const app = express();
app.use(express.json());

registerHandlers(app, handlers);
```

## Testing

The project includes comprehensive testing to ensure generated code quality and consistency.

### Snapshot Testing

```bash
# Test all workspaces
npm run test:workspaces

# Test specific workspace
cd test/workspace-1
npm run test:snapshot
```

### Type Safety Testing

The generator produces robust TypeScript types that catch common programming errors at compile time. We test this by intentionally introducing type violations and ensuring they fail compilation consistently.

```bash
# Test type safety across all workspaces
npm run test:typesafety

# Test specific workspace type safety
cd test/workspace-1
npm run test:typesafety
npm run test:typesafety-snapshot
```

#### Type Safety Test Coverage

- **Type Mismatches**: String vs number, wrong property types
- **Required Properties**: Missing required fields
- **Additional Properties**: Extra properties when `additionalProperties: false`
- **Path Parameters**: Type safety for URL parameters
- **Query Parameters**: Type safety for query strings
- **Request Bodies**: Type safety for POST/PUT data
- **Response Types**: Type safety for API responses
- **Express Integration**: Proper Request/Response generic typing

#### Snapshot Files

Type safety errors are captured as snapshots to ensure consistency:
- `test/workspace-1/snapshots/typesafety-errors.snapshot.txt`
- `test/workspace-2/snapshots/typesafety-errors.snapshot.txt`

### Demo Script

Run the interactive demo to see type safety testing in action:

```bash
./test/type-safety-demo.sh
```

### All Tests

```bash
# Run all tests (generation + type safety)
npm run test:all
```

## Generated Types

The generator creates several TypeScript interfaces:

### Request Types
- `{operationId}Request` - Extends Express Request with typed params, query, and body
- `{operationId}PathParams` - Path parameter types
- `{operationId}QueryParams` - Query parameter types  
- `{operationId}Body` - Request body types

### Response Types
- `{operationId}Response` - Extends Express Response with typed json method
- `{operationId}Response` - Response body types

### Handler Type
- `Handlers` - Dictionary mapping operation IDs to typed handler functions

## Example OpenAPI Specs

### User Management API (Workspace 1)

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
paths:
  /users/{userId}:
    get:
      operationId: getUser
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  userId:
                    type: string
```

### PetStore API (Workspace 2)

```yaml
openapi: 3.0.0
info:
  title: PetStore API
  version: 1.0.0
paths:
  /pets:
    get:
      operationId: listPets
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  pets:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                        name:
                          type: string
```

## Development

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Generate Test Code
```bash
# Generate for workspace 1
npm run test:generate --workspace=test/workspace-1

# Generate for workspace 2
npm run test:generate --workspace=test/workspace-2
```

### CLI Development
```bash
# Build the CLI
npm run build

# Test the CLI
node dist/cli.js --help
node dist/cli.js validate ./test/workspace-1/example-openapi.json
```

## License

ISC 