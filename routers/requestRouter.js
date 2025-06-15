import express from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";

import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest
} from "../Controllers/requestControllers.js";

const requestRouter = express.Router();

// Obtener todas las solicitudes
requestRouter.get("/get_requests", getRequests);

// Obtener solicitud por ID
requestRouter.get("/get_request/:id", getRequestById);

// Crear nueva solicitud
requestRouter.post(
  "/create_request",
  [
    check("serviceId", "El ID del servicio es obligatorio y debe ser numérico").isInt(),
    check("cedula", "La cédula es obligatoria").notEmpty(),
    check("requestDate", "La fecha de solicitud es obligatoria y debe tener formato YYYY-MM-DD").isISO8601(),
    check("requestSemester", "El semestre de solicitud es obligatorio y debe ser numérico").isInt(),
    // Validación condicional de assistantshipId solo si aplica
    check("assistantshipId")
      .if((value, { req }) => parseInt(req.body.serviceId) === 3)
      .notEmpty().withMessage("El ID de la ayudantía es obligatorio para este servicio")
      .isInt().withMessage("El ID de la ayudantía debe ser un número entero")
  ],
  validateFields,
  createRequest
);

// Actualizar estado de una solicitud
requestRouter.put(
  "/update_request",
  [
    check("requestId", "El ID de la solicitud es obligatorio y debe ser numérico").isInt().notEmpty(),
    check("stateId", "El nuevo ID de estado es obligatorio").isInt().notEmpty()
  ],
  validateFields,
  updateRequest
);

export  {requestRouter};