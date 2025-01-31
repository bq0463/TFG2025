import { Router } from "express";
import { TareaController } from "../controllers/tareaController.js";
import { validarCredencialesTarea } from "../middlewares/validacionesCreaciones.js";
export const tareaRouter = Router();

tareaRouter.get('/tareas/:id', TareaController.getById);
tareaRouter.get('/usuarios/:id/tareas', TareaController.getAll);
tareaRouter.delete('/tareas/:id', TareaController.delete);
tareaRouter.patch('/tareas/:id', TareaController.update);
tareaRouter.post('/tareas',validarCredencialesTarea,TareaController.create);