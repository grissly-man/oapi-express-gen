import express, { Request, Response } from "express";
import { registerHandlers, Handlers, createPetRequest, createPetResponseType, listPetsRequest, listPetsResponseType, showPetByIdRequest, showPetByIdResponseType } from "./generated/handlers";

const app = express();

const handlers: Handlers = {
  listPets: function (req, res) {
    const {limit} = req.query;
    return res.json({ pets: [], total: limit, });
  },
  createPet: function (req, res) {
    const {name, tag} = req.body;
    return res.json({ id: 1, name, tag });
  },
  showPetById: function (req, res) {
    const {petId} = req.params
    return res.json({ id: petId, name: "Fido", tag: "dog" });
  }
};

registerHandlers(app, handlers);

app.listen(3000);