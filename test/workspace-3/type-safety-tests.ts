import express from "express";
import { 
  registerHandlers, 
  Handlers,
  createUserBody,
  createUserResponse,
  getUserPathParams,
  getUsersQueryParams
} from "./generated/handlers";

const app = express();

// These handlers should ALL fail TypeScript compilation due to type violations

const handlers: Handlers = {
  // 1. Missing required properties: name and email are required
  createUser: function (req, res) {
    const { age } = req.body; // ❌ Should fail: name and email are required but not destructured
    return res.json({ id: "1", name: "John Doe", email: "john@example.com", age, createdAt: new Date() });
  },

  // 2. Wrong property type: userId should be string but using number
  getUser: function (req, res) {
    const userId: number = req.params.userId; // ❌ Should fail: userId is string, not number
    return res.json({ id: userId, name: "John Doe", email: "john@example.com", age: 25 });
  },

  // 3. Wrong query parameter type: page and limit should be numbers
  getUsers: function (req, res) {
    const { page, limit } = req.query;
    const pageNum: string = page; // ❌ Should fail: page is number, not string
    const limitNum: string = limit; // ❌ Should fail: limit is number, not string
    return res.json({ users: [], total: 0, page: pageNum, limit: limitNum });
  },

  // 4. Wrong body property type: age should be number but using string
  updateUser: function (req, res) {
    const { name, email, age } = req.body;
    const ageNum: string = age; // ❌ Should fail: age is number, not string
    return res.json({ id: "1", name, email, age: ageNum, updatedAt: new Date() });
  },

  // 5. Wrong return type: should return void | Promise<void> | updateUserResponseType
  deleteUser: function (req, res) {
    return "deleted"; // ❌ Should fail: wrong return type
  }
};

// 6. Additional property violation: trying to add properties when additionalProperties: false
const invalidUser: createUserBody = {
  name: "John Doe",
  email: "john@example.com",
  age: 25,
  extraProperty: "this should not be allowed" // ❌ Should fail: additionalProperties is false
};

// 7. Missing required properties in object literal
const invalidUser2: createUserBody = {
  age: 25
  // ❌ Should fail: name and email are required but missing
};

// 8. Wrong type assignments
const invalidUser3: createUserBody = {
  name: 123, // ❌ Should fail: name should be string, not number
  email: 456, // ❌ Should fail: email should be string, not number
  age: "not a number" // ❌ Should fail: age should be number, not string
};

// 9. Using non-existent properties
const invalidUser4: createUserBody = {
  name: "John Doe",
  email: "john@example.com",
  age: 25,
  nonExistentProperty: "this property doesn't exist" // ❌ Should fail: property not in schema
};

// 10. Path parameter type violations
const invalidPathParam: getUserPathParams = {
  userId: 123 // ❌ Should fail: userId should be string
};

// 11. Query parameter type violations
const invalidQueryParam: getUsersQueryParams = {
  page: "not a number", // ❌ Should fail: page should be number
  limit: "not a number" // ❌ Should fail: limit should be number
};

// 12. Response type violations
const invalidResponse: createUserResponse = {
  id: 123, // ❌ Should fail: id should be string
  name: 456, // ❌ Should fail: name should be string
  email: 789, // ❌ Should fail: email should be string
  age: "not a number", // ❌ Should fail: age should be number
  createdAt: "not a date" // ❌ Should fail: createdAt should be Date
};

// 13. Wrong request type usage
const wrongRequestType = function (req: express.Request, res: express.Response) {
  const userId = req.params.userId; // ❌ Should fail: params is not typed
  const page = req.query.page; // ❌ Should fail: query is not typed
  const name = req.body.name; // ❌ Should fail: body is not typed
};

// 14. Array item type violations
const invalidArrayItem = {
  id: 123, // ❌ Should fail: id should be string
  name: 456, // ❌ Should fail: name should be string
  email: 789 // ❌ Should fail: email should be string
};

// 15. Wrong handler signature
const invalidHandler = function (req: express.Request, res: express.Response) {
  // ❌ Should fail: wrong parameter types
  return res.json({ users: [], total: 0, page: 1 });
};

registerHandlers(app, handlers);

app.listen(3000); 