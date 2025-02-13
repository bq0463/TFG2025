import { Router } from "express";
import { ProyectoController } from "../controllers/proyectoController.js";
export const proyectoRouter = Router();

proyectoRouter.post('/proyectos/:id_usuario',ProyectoController.create);
proyectoRouter.get('/proyectos/:id', ProyectoController.getById);
proyectoRouter.get('/usuarios/:id_usuario/proyectos', ProyectoController.getAll);
proyectoRouter.patch('/proyectos/:id', ProyectoController.updateById);
proyectoRouter.post('/proyectos/asociar/:id_proyecto',ProyectoController.associateByUsername);
proyectoRouter.post('/proyectos/tarea/:id_proyecto/:id_usuario',ProyectoController.createTarea);