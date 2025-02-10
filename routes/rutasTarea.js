import { Router } from "express";
import { TareaController } from "../controllers/tareaController.js";
export const tareaRouter = Router();

tareaRouter.get('/tareas/:id', TareaController.getById);
tareaRouter.get('/usuarios/:id_usuario/tareas', TareaController.getAll);
tareaRouter.delete('/tareas/:id', TareaController.delete);
tareaRouter.patch('/tareas/:id', TareaController.updateById);
tareaRouter.post('/tareas',TareaController.create);