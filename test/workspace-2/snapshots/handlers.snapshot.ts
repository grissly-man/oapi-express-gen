// AUTO-GENERATED - DO NOT EDIT
// Generated from OpenAPI spec: PetStore API v1.0.0

import { Request, Response } from "express";

// Array item types
export interface listPetsPetsItem {
  id: number;
  name: string;
  tag: string;
}

// Path parameter types
export interface showPetByIdPathParams {
  petId: number;
  [key: string]: any;
}

// Query parameter types
export interface listPetsQueryParams {
  limit: number;
  [key: string]: any;
}

// Request body types
export interface createPetBody {
  name: string;
  tag: string;
}

// Response types
export interface listPetsResponse {
  pets: listPetsPetsItem[];
}
export interface createPetResponse {
  id: number;
  name: string;
  tag: string;
}
export interface showPetByIdResponse {
  id: number;
  name: string;
  tag: string;
}

// Request types for each operation
export interface listPetsRequest extends Request {
  query: listPetsQueryParams;
}
export interface createPetRequest extends Request {
  body: createPetBody;
}
export interface showPetByIdRequest extends Request {
  params: showPetByIdPathParams;
}

// Response types for each operation
export interface listPetsResponse extends Response {
  json: (body: listPetsResponse) => this;
}
export interface createPetResponse extends Response {
  json: (body: createPetResponse) => this;
}
export interface showPetByIdResponse extends Response {
  json: (body: showPetByIdResponse) => this;
}

// Handler function types
export type Handlers = {
  listPets: (req: listPetsRequest, res: listPetsResponse) => void | Promise<void>;
  createPet: (req: createPetRequest, res: createPetResponse) => void | Promise<void>;
  showPetById: (req: showPetByIdRequest, res: showPetByIdResponse) => void | Promise<void>;
};

// Route registration helper
export const registerHandlers = (app: any, handlers: Handlers) => {
  app.GET('/pets', handlers.listPets);
  app.POST('/pets', handlers.createPet);
  app.GET('/pets/:petId', handlers.showPetById);
};