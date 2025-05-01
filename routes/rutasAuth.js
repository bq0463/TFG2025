
import { Router } from "express";
import { verifyToken } from '../middlewares/authMiddleware.js';
import { AuthController } from "../controllers/authController.js";

export const usuarioAuthRouter = Router();
// Inicio de sesión con jwt
usuarioAuthRouter.post('/login', AuthController.login);

// quitar informacion de cookie
usuarioAuthRouter.post("/logout", AuthController.logout);

// información de usuario
usuarioAuthRouter.get("/me", verifyToken, AuthController.me);


