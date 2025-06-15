import express from "express";
import { getAssistanship, getAssistantshipById } from "../Controllers/assistanshipControllers.js";

const assistantshipRouter = express.Router();

// Obtener todas las ayudantías
assistantshipRouter.get("/get_assistantships", getAssistanship);

// Obtener ayudantía por ID
assistantshipRouter.get("/get_assistantship/:id", getAssistantshipById);

export {assistantshipRouter};