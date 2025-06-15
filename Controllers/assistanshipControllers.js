import { request, response } from "express";
import { client } from "../DB/db.js";

export const getAssistanship = async (req = request, res = response) => {
  try {
    const sql = `
                SELECT 
                  a."assistantshipId", 
                  a.assistantship_name, 
                  d.department_name AS departamento,
                  a.cupo
                FROM 
                  public.assistantship a
                JOIN 
                  public.department d ON a."departmentId" = d."departmentId";
                `;


    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const getAssistantshipById = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        a."assistantshipId",
        a.assistantship_name,
        a.cupo,
        d.department_name,
        COALESCE(
          ARRAY_AGG(r.requirement_name ORDER BY r.requirement_name),
          '{}'
        ) AS requerimientos
      FROM 
        assistantship a
      JOIN 
        department d ON a."departmentId" = d."departmentId"
      LEFT JOIN 
        "assistantshipRequirements" ar ON a."assistantshipId" = ar."assistantshipId"
      LEFT JOIN 
        requirements r ON ar."requirementId" = r."requirementId"
      WHERE 
        a."assistantshipId" = $1
      GROUP BY 
        a."assistantshipId", a.assistantship_name, a.cupo, d.department_name;
    `;

    const result = await client.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Not Found",
        message: "No se encontró la ayudantía solicitada.",
      });
    }

    res.status(200).json({
      status: "Ok",
      data: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};