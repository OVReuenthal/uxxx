import { request, response } from "express";
import { client} from '../DB/db.js';


export const validateCedula = (cedula) => {
    return new Promise(async (resolve, reject) => {
        const sqlCedula = `SELECT cedula
        FROM public.student 
        WHERE student.cedula = $1;`
        const results = await client.query(sqlCedula, [cedula]);
        if (results.rows.length > 0) {
            reject('La cédula proporcionada ya existe');
        } else {
            resolve(true);
        }
    });
};