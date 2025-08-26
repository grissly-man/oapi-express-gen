// AUTO-GENERATED - DO NOT EDIT
// Generated from OpenAPI spec: User Management API v1.0.0

import { Request, Response, Express } from "express";

// Path parameter types
export interface getUserPathParams {
  userId: string;
  
}
export interface updateUserPathParams {
  userId: string;
  
}
export interface deleteUserPathParams {
  userId: string;
  
}

// Query parameter types
export interface getUsersQueryParams {
  page?: number;
  limit?: number;
  
}

// Request body types
export interface createUserBody {
  name: string;
  email: string;
  age?: number;
  [key: string]: any;
}
export interface updateUserBody {
  name?: string;
  email?: string;
  age?: number;
  [key: string]: any;
}

// Response types
export interface getUsersResponse {
  users?: getUsersUsersItem[];
  total?: number;
  page?: number;
  [key: string]: any;
}
export interface createUserResponse {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  createdAt?: Date;
  [key: string]: any;
}
export interface getUserResponse {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  [key: string]: any;
}
export interface updateUserResponse {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  updatedAt?: Date;
  [key: string]: any;
}

// Array item types
export interface getUsersUsersItem {
  id?: string;
  name?: string;
  email?: string;
  
}

// Request types for each operation
export type getUsersRequest = Request<
  {},
  getUsersResponse,
  {},
  getUsersQueryParams
>;
export type createUserRequest = Request<
  {},
  createUserResponse,
  createUserBody,
  {}
>;
export type getUserRequest = Request<
  getUserPathParams,
  getUserResponse,
  {},
  {}
>;
export type updateUserRequest = Request<
  updateUserPathParams,
  updateUserResponse,
  updateUserBody,
  {}
>;
export type deleteUserRequest = Request<
  deleteUserPathParams,
  {},
  {},
  {}
>;

// Response types for each operation
export type getUsersResponseType = Response<getUsersResponse>
export type createUserResponseType = Response<createUserResponse>
export type getUserResponseType = Response<getUserResponse>
export type updateUserResponseType = Response<updateUserResponse>
export type deleteUserResponseType = Response

// Handler function types
export type Handlers = {
  getUsers: (req: getUsersRequest, res: getUsersResponseType) => void | Promise<void> | getUsersResponseType;
  createUser: (req: createUserRequest, res: createUserResponseType) => void | Promise<void> | createUserResponseType;
  getUser: (req: getUserRequest, res: getUserResponseType) => void | Promise<void> | getUserResponseType;
  updateUser: (req: updateUserRequest, res: updateUserResponseType) => void | Promise<void> | updateUserResponseType;
  deleteUser: (req: deleteUserRequest, res: deleteUserResponseType) => void | Promise<void> | deleteUserResponseType;
};

// Route registration helper
export const registerHandlers = (app: Express, handlers: Handlers) => {
  app.get('/users', handlers.getUsers);
  app.post('/users', handlers.createUser);
  app.get('/users/:userId', handlers.getUser);
  app.put('/users/:userId', handlers.updateUser);
  app.delete('/users/:userId', handlers.deleteUser);
};