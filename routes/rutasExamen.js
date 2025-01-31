import { Router } from "express";
import { ExamenController } from "../controllers/examenController.js";
export const examenRouter = Router();
import { validarCredencialesExamen } from "../middlewares/validacionesCreaciones.js"; // Middleware de validación
examenRouter.get('/examenes/:id', ExamenController.getById);
examenRouter.get('/usuarios/:id/examenes', ExamenController.getAll);
examenRouter.delete('/examenes/:id', ExamenController.delete);
examenRouter.patch('/examenes/:id', ExamenController.update);
examenRouter.post('/examenes',validarCredencialesExamen,ExamenController.create);
