import express = require("express");
import { 
  registerHandlers, 
  Handlers, 
  createPetRequest, 
  createPetResponseType, 
  listPetsRequest, 
  listPetsResponseType, 
  showPetByIdRequest, 
  showPetByIdResponseType,
  createPetBody,
  createPetResponse,
  showPetByIdPathParams,
  listPetsQueryParams
} from "./generated/handlers";

const app = express();

// These handlers should ALL fail TypeScript compilation due to type violations

const handlers: Handlers = {
  // 1. Type mismatch: using string instead of number for petId
  showPetById: function (req, res) {
    const petId: string = req.params.petId; // ❌ Should fail: petId is number, not string
    return res.json({ id: petId, name: "Fido", tag: "dog" });
  },

  // 2. Missing required property: name is required but not provided
  createPet: function (req, res) {
    const { tag } = req.body; // ❌ Should fail: name is required but not destructured
    return res.json({ id: 1, name: "Fido", tag });
  },

  // 3. Wrong property type: limit should be number but using string
  listPets: function (req, res) {
    const limit: string = req.query.limit; // ❌ Should fail: limit is number, not string
    return res.json({ pets: [], total: limit });
  }
};

// 4. Additional property violation: trying to add properties when additionalProperties: false
const invalidPet: createPetBody = {
  name: "Fido",
  tag: "dog",
  extraProperty: "this should not be allowed" // ❌ Should fail: additionalProperties is false
};

// 5. Missing required property in object literal
const invalidPet2: createPetBody = {
  tag: "dog"
  // ❌ Should fail: name is required but missing
};

// 6. Wrong type assignment
const invalidPet3: createPetBody = {
  name: 123, // ❌ Should fail: name should be string, not number
  tag: "dog"
};

// 7. Using non-existent property
const invalidPet4: createPetBody = {
  name: "Fido",
  tag: "dog",
  nonExistentProperty: "this property doesn't exist" // ❌ Should fail: property not in schema
};

// 8. Wrong return type: should return void | Promise<void> | createPetResponseType
const invalidHandler = function (req: createPetRequest, res: createPetResponseType) {
  return "wrong return type"; // ❌ Should fail: wrong return type
};

// 9. Wrong request type usage
const wrongRequestType = function (req: express.Request, res: express.Response) {
  const petId = req.params.petId; // ❌ Should fail: params is not typed
  const limit = req.query.limit; // ❌ Should fail: query is not typed
  const name = req.body.name; // ❌ Should fail: body is not typed
};

// 10. Path parameter type violation
const invalidPathParam: showPetByIdPathParams = {
  petId: "not a number" // ❌ Should fail: petId should be number
};

// 11. Query parameter type violation  
const invalidQueryParam: listPetsQueryParams = {
  limit: "not a number" // ❌ Should fail: limit should be number
};

// 12. Response type violation
const invalidResponse: createPetResponse = {
  id: "not a number", // ❌ Should fail: id should be number
  name: "Fido",
  tag: "dog"
};

registerHandlers(app, handlers);

app.listen(3000); 