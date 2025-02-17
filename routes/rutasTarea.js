import { Router } from "express";
import { TareaController } from "../controllers/tareaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
export const tareaRouter = Router();

tareaRouter.get('/tareas/:id',verifyToken , TareaController.getById);
tareaRouter.get('/usuarios/:id_usuario/tareas',verifyToken , TareaController.getAll);
tareaRouter.delete('/tareas/:id',verifyToken , TareaController.delete);
tareaRouter.patch('/tareas/:id',verifyToken , TareaController.updateById);
tareaRouter.post('/tareas/:id_usuario',verifyToken,TareaController.create);