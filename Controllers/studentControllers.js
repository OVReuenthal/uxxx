import { request, response } from "express";
import { client } from "../DB/db.js";
import { calcularBaremo } from "../helpers/calculateBaremo.js";

export const getStudents = async (req = request, res = response) => {
  try {
    const sql = `SELECT * FROM student ORDER BY baremo ASC`;


    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const getStudentById = async (req = request, res = response) => {
  try {
    const studentId = req.params.id;
    const sql = `SELECT 
                    s.*, 
                    d."direccionName",
                    r."residencianame"
                FROM 
                    student s
                INNER JOIN 
                    direccion d ON s."direccionId" = d."direccionId"
                INNER JOIN
                    residencia r ON s."residenciaId" = r."residenciaId"
                WHERE 
                    s.cedula = $1;`;

    const querySQL = await client.query(sql, [studentId]);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const updateData = async (req = request, res = response) => {
  try {
    const {
      cedula,
      telefono,
      correo,
      direccionId,
      residenciaId,
      dependencia_economica,
      ingresosF,
      promedioActual
    } = req.body;

    // Recalcular baremo con ayuda externa
    const baremo = calcularBaremo({ direccionId, dependencia_economica, residenciaId });
    console.log(`Baremo asignado: ${baremo}`);

    // Consulta SQL clara y bien formateada
    const sql = `
      UPDATE public.student
      SET
        telefono = $1,
        correo = $2,
        "ingresosF" = $3,
        baremo = $4,
        "dependenciaEconomica" = $5,
        "direccionId" = $6,
        "promedioActual" = $7,
        "residenciaId" = $8
      WHERE cedula = $9;
    `;

    const values = [
      telefono,
      correo,
      ingresosF,
      baremo,
      dependencia_economica,
      direccionId,
      promedioActual,
      residenciaId,
      cedula
    ];

    await client.query(sql, values);

    res.status(200).json({ status: "Ok", data: "updated" });

  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const createStudent = async (req = request, res = response) => {
  try {
    const { cedula, userId, nombre_completo, telefono, correo, carrera, ingresosF, dependencia_economica, direccionId, promedio, residenciaId } = req.body;

    const baremo = calcularBaremo({ direccionId, dependencia_economica, residenciaId });


    // Consulta SQL segura con parámetros
    const sql = `INSERT INTO public.student(
	cedula, "userId", nombre_completo, telefono, correo, carrera, "ingresosF", baremo, "dependenciaEconomica", "direccionId", promedio, "residenciaId")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

    const results = await client.query(sql, [cedula, userId, nombre_completo, telefono, correo, carrera, ingresosF, baremo, dependencia_economica, direccionId, promedio, residenciaId]);

    res.status(201).json({
      status: "Created",
    });

  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      error: err.message,
    });
  }
};

