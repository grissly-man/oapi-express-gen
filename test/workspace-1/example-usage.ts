import express from 'express';
import { Handlers, registerHandlers } from './src/generated/handlers';

// Create Express app
const app = express();
app.use(express.json());

// Implement your handlers
const handlers: Handlers = {
  getUsers: (req, res) => {
    // req.query.page and req.query.limit are fully typed
    const { page, limit } = req.query;
    
    // Mock response data
    const users = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    res.json({
      users,
      total: users.length,
      page: page || 1
    });
  },
  
  createUser: (req, res) => {
    // req.body is fully typed with name, email, and age
    const { name, email, age } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Mock created user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      age: age || 0,
      createdAt: new Date()
    };
    
    res.status(201).json(newUser);
  },
  
  getUser: (req, res) => {
    // req.params.userId is fully typed
    const { userId } = req.params;
    
    // Mock user data
    const user = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    };
    
    res.json(user);
  },
  
  updateUser: (req, res) => {
    // req.params.userId and req.body are fully typed
    const { userId } = req.params;
    const { name, email, age } = req.body;
    
    // Mock updated user
    const updatedUser = {
      id: userId,
      name: name || 'John Doe',
      email: email || 'john@example.com',
      age: age || 30,
      updatedAt: new Date()
    };
    
    res.json(updatedUser);
  },
  
  deleteUser: (req, res) => {
    // req.params.userId is fully typed
    const { userId } = req.params;
    
    // Mock deletion
    console.log(`Deleting user ${userId}`);
    
    res.status(204).send();
  }
};

// Register all handlers with Express
registerHandlers(app, handlers);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /users - Get all users');
  console.log('  POST /users - Create a new user');
  console.log('  GET  /users/:userId - Get a specific user');
  console.log('  PUT  /users/:userId - Update a user');
  console.log('  DELETE /users/:userId - Delete a user');
}); 