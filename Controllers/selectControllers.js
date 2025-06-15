import { request, response } from "express";
import { client } from "../DB/db.js";

export const getRequestStates = async (req = request, res = response) => {
  try {
    const sql = `SELECT * FROM request_states`;

    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const getDirecciones = async (req = request, res = response) => {
  try {
    const sql = `SELECT * FROM direccion`;

    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const getResidencias = async (req = request, res = response) => {
  try {
    const sql = `SELECT * FROM residencia`;

    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};
