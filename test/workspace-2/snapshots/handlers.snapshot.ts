// AUTO-GENERATED - DO NOT EDIT
// Generated from OpenAPI spec: PetStore API v1.0.0

import { Request, Response, Express } from "express";

// Array item types
export interface listPetsPetsItem {
  id: number;
  name: string;
  tag: string;
}

// Path parameter types
export interface showPetByIdPathParams {
  petId: number;
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
export type listPetsRequest = Request<
  {},
  listPetsResponse,
  {},
  listPetsQueryParams
>;
export type createPetRequest = Request<
  {},
  createPetResponse,
  createPetBody,
  {}
>;
export type showPetByIdRequest = Request<
  showPetByIdPathParams,
  showPetByIdResponse,
  {},
  {}
>;

// Response types for each operation
export type listPetsResponseType = Response<listPetsResponse>
export type createPetResponseType = Response<createPetResponse>
export type showPetByIdResponseType = Response<showPetByIdResponse>

// Handler function types
export type Handlers = {
  listPets: (req: listPetsRequest, res: listPetsResponseType) => void | Promise<void> | listPetsResponseType;
  createPet: (req: createPetRequest, res: createPetResponseType) => void | Promise<void> | createPetResponseType;
  showPetById: (req: showPetByIdRequest, res: showPetByIdResponseType) => void | Promise<void> | showPetByIdResponseType;
};

// Route registration helper
export const registerHandlers = (app: Express, handlers: Handlers) => {
  app.get('/pets', handlers.listPets);
  app.post('/pets', handlers.createPet);
  app.get('/pets/:petId', handlers.showPetById);
};