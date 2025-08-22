# OpenAPI Express Generator

A code generator that creates fully-typed Express.js handlers from OpenAPI specifications.

## Features

- **Fully Typed**: Generates TypeScript interfaces for request bodies, query parameters, path parameters, and responses
- **Express Integration**: Creates handlers that integrate seamlessly with Express.js
- **OpenAPI 3.0 Support**: Parses OpenAPI 3.0.x specifications
- **Automatic Route Registration**: Includes helper functions to register all generated handlers
- **Test Workspaces**: Multiple test workspaces with snapshot testing

## Installation

```bash
npm install
```

## Usage

### 1. Generate Handlers

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

The project uses npm workspaces for testing with multiple test scenarios:

### Test Structure

```
test/
├── workspace-1/           # User Management API tests
│   ├── example-openapi.json
│   ├── example-usage.ts
│   ├── generated/         # Generated handlers (gitignored)
│   └── snapshots/         # Snapshot files for testing
├── workspace-2/           # PetStore API tests
│   ├── petstore-openapi.json
│   ├── generated/         # Generated handlers (gitignored)
│   └── snapshots/         # Snapshot files for testing
```

### Running Tests

```bash
# Run all tests across all workspaces
npm test

# Run only snapshot tests
npm run test:snapshot

# Run tests for a specific workspace
npm test --workspace=test/workspace-1
```

### Snapshot Testing

The project uses basic snapshot testing to ensure generated code remains consistent:

1. **Initial Snapshot**: Generated code is saved as a snapshot
2. **Test Generation**: Code is regenerated during tests
3. **Comparison**: Generated code is compared against snapshots
4. **Validation**: Tests pass if generated code matches snapshots

This approach ensures that:
- Generated code remains stable across changes
- Regressions are caught automatically
- Multiple OpenAPI specs are tested consistently

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

## License

ISC 