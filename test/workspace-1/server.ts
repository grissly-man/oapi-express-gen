import express, { Request, Response } from "express";
import { registerHandlers, Handlers } from "./generated/handlers";
import { openAPIParser } from "oapi-express-gen/src/parser";

const app = express();

app.use(openAPIParser('./test/workspace-1/example-openapi.json'));

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
};

registerHandlers(app, handlers);

app.listen(3000);