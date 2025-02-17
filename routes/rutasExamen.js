import { Router } from "express";
import { ExamenController } from "../controllers/examenController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
export const examenRouter = Router();
examenRouter.get('/examenes/:id',verifyToken , ExamenController.getById);
examenRouter.get('/usuarios/:id_usuario/examenes',verifyToken , ExamenController.getAll);
examenRouter.delete('/examenes/:id',verifyToken , ExamenController.delete);
examenRouter.patch('/examenes/:id',verifyToken , ExamenController.updateById);
examenRouter.post('/examenes/:id_usuario',verifyToken ,ExamenController.create);
