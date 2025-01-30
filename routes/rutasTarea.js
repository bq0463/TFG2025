import { Router } from "express";
import { TareaController } from "../controllers/tareaController.js";
export const tareaRouter = Router();

tareaRouter.get('/tareas/:id', TareaController.getById);
tareaRouter.get('/usuarios/:id/tareas', TareaController.getAll);
tareaRouter.delete('/examenes/:id', TareaController.delete);
tareaRouter.patch('/examenes/:id', TareaController.update);
tareaRouter.post('/examenes',TareaController.create);