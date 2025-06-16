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

    // Nuevos campos requeridos para actualizar datos del estudiante
    check("telefono", "El número de teléfono es obligatorio").notEmpty(),
    check("correo", "Debe proporcionar un correo válido").isEmail(),
    check("direccionId", "El ID de dirección es obligatorio y debe ser numérico").isInt(),
    check("residenciaId", "El ID de residencia es obligatorio y debe ser numérico").isInt(),
    check("dependencia_economica", "La dependencia económica es obligatoria").notEmpty(),
    check("ingresosF", "Los ingresos familiares son obligatorios").notEmpty(),
    check("promedio", "El promedio debe ser numérico").isNumeric(),

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