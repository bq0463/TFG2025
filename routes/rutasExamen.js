import { Router } from "express";
import { ExamenController } from "../controllers/examenController.js";
export const examenRouter = Router();
examenRouter.get('/examenes/:id', ExamenController.getById);
examenRouter.get('/usuarios/:id_usuario/examenes', ExamenController.getAll);
examenRouter.delete('/examenes/:id', ExamenController.delete);
examenRouter.patch('/examenes/:id', ExamenController.updateById);
examenRouter.post('/examenes',ExamenController.create);
