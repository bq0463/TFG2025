import { Router } from "express";
import { ProyectoController } from "../controllers/proyectoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validarProyecto } from "../middlewares/validarProyecto.js";
import { validarTarea } from "../middlewares/validarTarea.js";
export const proyectoRouter = Router();

proyectoRouter.post('/proyectos/:id_usuario',verifyToken,validarProyecto ,ProyectoController.create);
proyectoRouter.get('/proyectos/:id',verifyToken , ProyectoController.getById);
proyectoRouter.get('/usuarios/:id_usuario/proyectos',verifyToken , ProyectoController.getAll);
proyectoRouter.patch('/proyectos/:id',verifyToken,validarProyecto , ProyectoController.updateById);
proyectoRouter.post('/proyectos/asociar/:id_proyecto',verifyToken ,ProyectoController.associateByUsername);
proyectoRouter.post('/proyectos/tarea/:id_proyecto/:id_usuario',verifyToken,validarTarea ,ProyectoController.createTarea);
proyectoRouter.delete('/proyectos/:id_proyecto/usuario/:id_usuario', verifyToken, ProyectoController.disassociateProyecto);
