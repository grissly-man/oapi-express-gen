// Demo: Using the OpenAPI Request Parser
// This example shows how to use the generated handlers with the request parser middleware

import express from 'express';
import { openAPIParser } from '../src/parser';

// Import your generated handlers
import { Handlers, registerHandlers } from '../test/workspace-1/generated/handlers';

// Example handler implementations
const handlers: Handlers = {
  getUsers: (req, res) => {
    // Query parameters are automatically parsed and validated
    const page = req.parsedQuery?.page || 1;
    const limit = req.parsedQuery?.limit || 10;
    
    console.log(`Getting users - Page: ${page}, Limit: ${limit}`);
    console.log('Query params:', req.parsedQuery);
    
    res.json({
      users: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ],
      total: 2,
      page,
      limit
    });
  },

  createUser: (req, res) => {
    // Request body is automatically validated against OpenAPI schema
    const { name, email, age } = req.body;
    
    console.log('Creating user:', { name, email, age });
    
    res.status(201).json({
      id: '3',
      name,
      email,
      age,
      createdAt: new Date()
    });
  },

  getUser: (req, res) => {
    // Path parameters are automatically parsed and validated
    const userId = req.parsedParams?.userId;
    
    console.log(`Getting user with ID: ${userId}`);
    console.log('Path params:', req.parsedParams);
    
    res.json({
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
  },

  updateUser: (req, res) => {
    const userId = req.parsedParams?.userId;
    const { name, email, age } = req.body;
    
    console.log(`Updating user ${userId}:`, { name, email, age });
    
    res.json({
      id: userId,
      name,
      email,
      age,
      updatedAt: new Date()
    });
  },

  deleteUser: (req, res) => {
    const userId = req.parsedParams?.userId;
    
    console.log(`Deleting user with ID: ${userId}`);
    
    res.status(204).send();
  }
};

// Set up Express app
const app = express();
app.use(express.json());

// Apply the OpenAPI parser middleware to all routes
// This will automatically parse and validate all requests according to your spec
app.use(openAPIParser('./test/workspace-1/example-openapi.json'));

// Register handlers - the parser middleware will handle all the parsing
registerHandlers(app, handlers);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('\n📖 Available endpoints:');
  console.log('  GET  /users           - Get all users');
  console.log('  POST /users           - Create a user');
  console.log('  GET  /users/:userId   - Get a specific user');
  console.log('  PUT  /users/:userId   - Update a user');
  console.log('  DELETE /users/:userId - Delete a user');
  console.log('\n✨ Request parsing is automatically enabled!');
  console.log('   - Path parameters are parsed and validated');
  console.log('   - Query parameters are converted to proper types');
  console.log('   - All parsing follows your OpenAPI specification');
});

export { app, handlers }; 