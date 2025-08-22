// AUTO-GENERATED - DO NOT EDIT
// Generated from OpenAPI spec: User Management API v1.0.0

import { Request, Response } from "express";

// Array item types
export interface getUsersUsersItem {
  id: string;
  name: string;
  email: string;
}

// Path parameter types
export interface getUserPathParams {
  userId: string;
  [key: string]: any;
}
export interface updateUserPathParams {
  userId: string;
  [key: string]: any;
}
export interface deleteUserPathParams {
  userId: string;
  [key: string]: any;
}

// Query parameter types
export interface getUsersQueryParams {
  page: number;
  limit: number;
  [key: string]: any;
}

// Request body types
export interface createUserBody {
  name: string;
  email: string;
  age: number;
}
export interface updateUserBody {
  name: string;
  email: string;
  age: number;
}

// Response types
export interface getUsersResponse {
  users: getUsersUsersItem[];
  total: number;
  page: number;
}
export interface createUserResponse {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}
export interface getUserResponse {
  id: string;
  name: string;
  email: string;
  age: number;
}
export interface updateUserResponse {
  id: string;
  name: string;
  email: string;
  age: number;
  updatedAt: Date;
}

// Request types for each operation
export interface getUsersRequest extends Request {
  query: getUsersQueryParams;
}
export interface createUserRequest extends Request {
  body: createUserBody;
}
export interface getUserRequest extends Request {
  params: getUserPathParams;
}
export interface updateUserRequest extends Request {
  params: updateUserPathParams;
  body: updateUserBody;
}
export interface deleteUserRequest extends Request {
  params: deleteUserPathParams;
}

// Response types for each operation
export interface getUsersResponse extends Response {
  json: (body: getUsersResponse) => this;
}
export interface createUserResponse extends Response {
  json: (body: createUserResponse) => this;
}
export interface getUserResponse extends Response {
  json: (body: getUserResponse) => this;
}
export interface updateUserResponse extends Response {
  json: (body: updateUserResponse) => this;
}
export interface deleteUserResponse extends Response {
}

// Handler function types
export type Handlers = {
  getUsers: (req: getUsersRequest, res: getUsersResponse) => void | Promise<void>;
  createUser: (req: createUserRequest, res: createUserResponse) => void | Promise<void>;
  getUser: (req: getUserRequest, res: getUserResponse) => void | Promise<void>;
  updateUser: (req: updateUserRequest, res: updateUserResponse) => void | Promise<void>;
  deleteUser: (req: deleteUserRequest, res: deleteUserResponse) => void | Promise<void>;
};

// Route registration helper
export const registerHandlers = (app: any, handlers: Handlers) => {
  app.GET('/users', handlers.getUsers);
  app.POST('/users', handlers.createUser);
  app.GET('/users/:userId', handlers.getUser);
  app.PUT('/users/:userId', handlers.updateUser);
  app.DELETE('/users/:userId', handlers.deleteUser);
};