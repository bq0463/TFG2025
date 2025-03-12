
//----------------Como leer JSON con node.js en ES modules----------------
// Primera forma
//import movies from "./movies.json" with { type: "json" }; esto es para importar el archivo json ES Modules,si no petaria ,pero es experimental

// Segunda forma
/* import fs from "node:fs";
const movies=JSON.parse(fs.readFileSync("./movies.json",{encoding:"utf-8"})); */

// Tercera forma ,recomendada , con createRequire en utils.js , se usa en movies_routes.js
//const movies = readJSON("./movies.json");

// /movies corresponde al router,por eso es diferente la ruta


// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE => PREFLIGHT
// OPTIONS => PREFLIGHT
// CORS => Cross Origin Resource Sharing

//se coge del controller funciones de modelo y maneja errores CRUD para no saber su implementación
import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController.js";
import { verifyToken } from '../middlewares/authMiddleware.js';
export const usuarioRouter = Router();

// Métodos relacionados con la entidad usuario

// Registro de usuarios con validación previa
usuarioRouter.post('/register', UsuarioController.register);

// Inicio de sesión con jwt
usuarioRouter.post('/login', UsuarioController.loginUser);

// quitar informacion de cookie
usuarioRouter.post("/logout", UsuarioController.logout);

// información de usuario
usuarioRouter.get("/usuarios/me", verifyToken, UsuarioController.me);

// Obtener un usuario por ID
usuarioRouter.get('/usuarios/:id',verifyToken ,UsuarioController.getById);

// Actualizar un usuario (parcialmente)
usuarioRouter.patch('/usuarios/:id',verifyToken ,UsuarioController.updateById);

// Actualizar contraseña de un usuario
usuarioRouter.patch('/usuarios/:id/password', verifyToken ,UsuarioController.updatePassword);

// Eliminar un usuario
usuarioRouter.delete('/usuarios/:id',verifyToken , UsuarioController.delete);

