import express, { Request, Response } from "express";
import { registerHandlers, Handlers } from "./generated/handlers";

const app = express();

const handlers: Handlers = {
  getUsers: (req, res) => {
    req.query.aaslkdjfasdf;
    res.json({ users: [], total: 0, page: 1 });
  },
  createUser: (req, res) => {
    res.json({ id: "1", name: "John Doe", email: "john.doe@example.com", age: 25, createdAt: new Date() });
  },
  getUser: (req, res) => {
    res.json({ id: "1", name: "John Doe", email: "john.doe@example.com", age: 25 });
  },
  updateUser: (req, res) => {
    res.json({ id: "1", name: "John Doe", email: "john.doe@example.com", age: 25, updatedAt: new Date() });
  },
  deleteUser: (req, res) => {
    res.status(204).send();
  },
};

registerHandlers(app, handlers);

app.listen(3000);