// AUTO-GENERATED - DO NOT EDIT
// Generated from OpenAPI spec: User Management API v1.0.0

import { Request, Response, Express } from "express";

// Generated from OpenAPI spec: User Management API v1.0.0

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
export interface getUserPostsPathParams {
  userId: string;
  
}

// Query parameter types
export interface getUsersQueryParams {
  page?: number;
  limit?: number;
  
}
export interface getUserPostsQueryParams {
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  
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
  [key: string]: any;
}
export interface getUserPostsResponse {
  posts?: getUserPostsPostsItem[];
  total?: number;
  [key: string]: any;
}
export interface getHealthResponse {
  status?: 'healthy' | 'degraded';
  timestamp?: Date;
  version?: string;
  [key: string]: any;
}

// Array item types
export interface getUsersUsersItem {
  id?: string;
  name?: string;
  email?: string;
  
}
export interface getUserPostsPostsItem {
  id?: string;
  title?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  createdAt?: Date;
  
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
export type getUserPostsRequest = Request<
  getUserPostsPathParams,
  getUserPostsResponse,
  {},
  getUserPostsQueryParams
>;
export type getHealthRequest = Request<
  {},
  getHealthResponse,
  {},
  {}
>;

// Response types for each operation
export type getUsersResponseType = Response<getUsersResponse>
export type createUserResponseType = Response<createUserResponse>
export type getUserResponseType = Response<getUserResponse>
export type updateUserResponseType = Response<updateUserResponse>
export type deleteUserResponseType = Response
export type getUserPostsResponseType = Response<getUserPostsResponse>
export type getHealthResponseType = Response<getHealthResponse>

// Handler function types
export type Handlers = {
  getUsers: (req: getUsersRequest, res: getUsersResponseType) => void | Promise<void> | getUsersResponseType;
  createUser: (req: createUserRequest, res: createUserResponseType) => void | Promise<void> | createUserResponseType;
  getUser: (req: getUserRequest, res: getUserResponseType) => void | Promise<void> | getUserResponseType;
  updateUser: (req: updateUserRequest, res: updateUserResponseType) => void | Promise<void> | updateUserResponseType;
  deleteUser: (req: deleteUserRequest, res: deleteUserResponseType) => void | Promise<void> | deleteUserResponseType;
  getUserPosts: (req: getUserPostsRequest, res: getUserPostsResponseType) => void | Promise<void> | getUserPostsResponseType;
  getHealth: (req: getHealthRequest, res: getHealthResponseType) => void | Promise<void> | getHealthResponseType;
};

// Route registration helper
export const registerHandlers = (app: Express, handlers: Handlers) => {
  app.get('/users', handlers.getUsers);
  app.post('/users', handlers.createUser);
  app.get('/users/:userId', handlers.getUser);
  app.put('/users/:userId', handlers.updateUser);
  app.delete('/users/:userId', handlers.deleteUser);
  app.get('/users/:userId/posts', handlers.getUserPosts);
  app.get('/health', handlers.getHealth);
};

