import express, { Request, Response } from "express";
import { registerHandlers, Handlers, createPetRequest, createPetResponseType, listPetsRequest, listPetsResponseType, showPetByIdRequest, showPetByIdResponseType } from "./generated/handlers";

const app = express();

const handlers: Handlers = {
  listPets: function (req, res) {
    return res.json({ pets: [] });
  },
  createPet: function (req, res) {
    return res.json({ id: 1, name: "Fido", tag: "dog" });
  },
  showPetById: function (req, res) {
    return res.json({ id: 1, name: "Fido", tag: "dog" });
  }
};

registerHandlers(app, handlers);

app.listen(3000);