import { request, response } from "express";
import { client } from "../DB/db.js";
import { calcularBaremo } from "../helpers/calculateBaremo.js";


export const getRequests = async (req = request, res = response) => {
  try {
    const sql = `
                SELECT 
                    r."requestId",
                    st."nombre_completo",
                    st."cedula",
                    s."service_name",
                    st."promedio",
                    st."baremo",
                    r."requestDate",
                    r."requestSemester",
                    rs."state_name"

                FROM 
                    request r
                INNER JOIN 
                    services s ON r."serviceId" = s."serviceId"
                INNER JOIN 
                    request_states rs ON r."stateId" = rs."stateId"
                INNER JOIN 
                    student st ON r."cedula" = st."cedula"
                ORDER BY 
                    rs.state_name;
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


export const getRequestById = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        r."requestId",
        st."nombre_completo",
        st."cedula",
        s."service_name",
        st."promedio",
        st."baremo",
        r."requestDate",
        r."requestSemester",
        rs."state_name",
        a.assistantship_name
      FROM 
        request r
      INNER JOIN 
        services s ON r."serviceId" = s."serviceId"
      INNER JOIN 
        request_states rs ON r."stateId" = rs."stateId"
      INNER JOIN 
        student st ON r."cedula" = st."cedula"
      LEFT JOIN 
        assistantship a ON r."assistantshipId" = a."assistantshipId"
      WHERE 
        r."requestId" = $1;
    `;

    const querySQL = await client.query(sql, [id]);

    if (querySQL.rows.length === 0) {
      return res.status(404).json({
        status: "Not Found",
        message: "No se encontró ninguna solicitud con ese ID",
      });
    }

    res.status(200).json({ status: "Ok", data: querySQL.rows[0] });

  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};




export const updateRequest = async (req = request, res = response) => {
  try {
    const { requestId, stateId } = req.body;
    const sql = `
                UPDATE public.request
                SET "stateId"=$1
                WHERE requestId = $2;
                `;


    const querySQL = await client.query(sql, [stateId, requestId]);

    res.status(200).json({ status: "Ok", data: "updated" });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const createRequest = async (req = request, res = response) => {
  try {
    const { 
      serviceId,
      cedula,
      requestDate,
      requestSemester,
      assistantshipId,
      telefono,
      correo,
      direccionId,
      residenciaId,
      dependencia_economica,
      ingresosF,
      promedio} = req.body

    const stateId = 1

    // Validate direccionId
    const checkDireccionSql = `SELECT "direccionId" FROM direccion WHERE "direccionId" = $1`;
    const direccionResult = await client.query(checkDireccionSql, [direccionId]);
    if (direccionResult.rows.length === 0) {
        return res.status(400).json({ status: "Failed", error: "direccionId proporcionado no existe" });
    }

    const baremo = calcularBaremo({ direccionId, dependencia_economica, residenciaId });
        console.log(`Baremo asignado: ${baremo}`);
    
        // Consulta SQL clara y bien formateada
        const baremoSql = 
        `
          UPDATE public.student
          SET
            telefono = $1,
            correo = $2,
            "ingresosF" = $3,
            baremo = $4,
            "dependenciaEconomica" = $5,
            "direccionId" = $6,
            "promedio" = $7,
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
          promedio,
          residenciaId,
          cedula
        ];
    
        await client.query(baremoSql, values);



    const sql = `SELECT * FROM student WHERE cedula = $1`;
    const studentData = await client.query(sql, [cedula]);
    if (studentData.rows.length === 0) {
    return res.status(404).json({ status: "Failed", error: "Estudiante no encontrado" });
}

    const semester = studentData.rows[0].semester;

    if(serviceId != 3){
      if(serviceId == 2){
        if(semester == 1){
          return res.status(400).json({ status: "Failed", error: "debe estar en segundo semestre o superior para optar por el beneficio"});
        }
        if(promedio <18){
          return res.status(400).json({ status: "Failed", error: "promedio insuficiente para este beneficio"});
        }
        
      }
      const sql = `
        INSERT INTO public.request (
          "serviceId",
          cedula,
          "requestDate",
          "requestSemester",
          "stateId"
        )
        VALUES ($1, $2, $3, $4, $5);
      `;
      const values = [serviceId, cedula, requestDate, requestSemester, stateId];
      await client.query(sql, values);
    }else{
      
      if(semester < 7){
        return res.status(400).json({ status: "Failed", error: "debe estar minimo en el septimo semestre para optar por este beneficio"});
      }
      if(promedio < 14){
        return res.status(400).json({ status: "Failed", error: "promedio insuficiente para optar por este beneficio"})
      }

      const sql = `
        INSERT INTO public.request (
          "serviceId",
          cedula,
          "requestDate",
          "requestSemester",
          "stateId",
          "assistantshipId"
        )
        VALUES ($1, $2, $3, $4, $5, $6);
      `;

      const values = [serviceId, cedula, requestDate, requestSemester, stateId, assistantshipId];
      await client.query(sql, values);

    }

    res.status(201).json({ status: "Created" });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

