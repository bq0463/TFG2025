import { Router } from "express";
import { ProyectoController } from "../controllers/proyectoController.js";
export const proyectoRouter = Router();
import { validarCredencialesProyecto } from "../middlewares/validacionesCreaciones.js"; // Middleware de validación

proyectoRouter.post('/proyectos', validarCredencialesProyecto,ProyectoController.create);
proyectoRouter.get('/proyectos/:id', ProyectoController.getById);
proyectoRouter.get('/usuarios/:id/proyectos', ProyectoController.getAll);
proyectoRouter.patch('/proyectos/:id', ProyectoController.update);
