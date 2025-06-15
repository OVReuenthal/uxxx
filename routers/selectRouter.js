import express from "express";
import {getDirecciones, getRequestStates, getResidencias} from '../Controllers/selectControllers.js'

const selectRouter = express.Router();


// Get all products

selectRouter.get('/direcciones', getDirecciones);
selectRouter.get('/request-states', getRequestStates);
selectRouter.get('/residencias', getResidencias);



export { selectRouter };