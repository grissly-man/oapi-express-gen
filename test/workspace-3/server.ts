import express, { Request, Response } from "express";
import { registerHandlers, Handlers } from "./generated/handlers";
import { openAPIParser } from "oapi-express-gen/src/parser";

const app = express();

app.use(openAPIParser('./example-openapi.yaml'));

const handlers: Handlers = {
  getUsers: (req, res) => {
    const {limit, page} = req.query;
    res.json({ users: [], total: limit, page });
  },
  createUser: (req, res) => {
    res.json({ id: "1", name: "John Doe", email: "john.doe@example.com", age: 25, createdAt: new Date() });
  },
  getUser: (req, res) => {
    const {userId} = req.params;
    res.json({ id: userId, name: "John Doe", email: "john.doe@example.com", age: 25 });
  },
  updateUser: (req, res) => {
    const {userId} = req.params;
    res.json({ id: userId, name: "John Doe", email: "john.doe@example.com", age: 25, updatedAt: new Date() });
  },
  deleteUser: (req, res) => {
    const {userId} = req.params;
    console.error(`Deleted user ${userId}`);
    res.status(204).send();
  },
  getUserPosts: (req, res) => {
    const {userId} = req.params;
    const {status, tags} = req.query;
    res.json({ 
      posts: [], 
      total: 0 
    });
  },
  getHealth: (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date(), 
      version: '1.0.0' 
    });
  },
};

registerHandlers(app, handlers);

app.listen(3000);