import express from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validateCedula } from "../middlewares/validateCedula.js";
import { validatePhone } from "../middlewares/validatePhone.js"
import {
  getStudents,
  getStudentById,
  createStudent,
  updateData
} from "../Controllers/studentControllers.js";

const studentRouter = express.Router();

// Obtener todos los estudiantes
studentRouter.get("/get_students", getStudents);

// Obtener estudiante por cédula
studentRouter.get("/get_student/:id", getStudentById);

// Crear un nuevo estudiante
studentRouter.post(
  "/create_student",
  [
    check("cedula", "La cédula es obligatoria").notEmpty(),
    check("userId", "El userId es obligatorio").notEmpty(),
    check("nombre_completo", "El nombre completo es obligatorio").notEmpty(),
    check("telefono", "El teléfono es obligatorio").notEmpty().custom(validatePhone),
    check("correo", "Debe proporcionar un correo válido").isEmail(),
    check("carrera", "La carrera es obligatoria").notEmpty(),
    check("ingresosF", "Los ingresos familiares son obligatorios").notEmpty(),
    check("dependencia_economica", "La dependencia económica es obligatoria").notEmpty().notEmpty(),
    check("direccionId", "El ID de dirección es obligatorio").isInt(),
    check("promedio", "El promedio debe ser numérico").isNumeric().notEmpty(),
    check("residenciaId", "El ID de residencia es obligatorio").isInt().notEmpty()
  ],
  validateFields,
  validateCedula,
  createStudent
);

// Actualizar datos de estudiante
studentRouter.put(
  "/update_data",
  [
    check("cedula", "La cédula es obligatoria").notEmpty(),
    check("telefono", "El teléfono es obligatorio").notEmpty(),
    check("correo", "Debe proporcionar un correo válido").isEmail(),
    check("ingresosF", "Los ingresos familiares son obligatorios").notEmpty(),
    check("dependencia_economica", "La dependencia económica es obligatoria").notEmpty().isInt(),
    check("direccionId", "El ID de dirección es obligatorio").isInt().notEmpty(),
    check("promedioActual", "El promedio actual debe ser numérico").isNumeric().notEmpty(),
    check("residenciaId", "El ID de residencia es obligatorio").isInt().notEmpty()
  ],
  validateFields,
  updateData
);

export {studentRouter};