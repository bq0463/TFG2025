
//----------------Como leer JSON con node.js en ES modules----------------
// Primera forma
//import movies from "./movies.json" with { type: "json" }; esto es para importar el archivo json ES Modules,si no petaria ,pero es experimental

// Segunda forma
/* import fs from "node:fs";
const movies=JSON.parse(fs.readFileSync("./movies.json",{encoding:"utf-8"})); */

// Tercera forma ,recomendada,import {readJSON} from utils.js
//const movies = readJSON("./movies.json");

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE => PREFLIGHT
// OPTIONS => PREFLIGHT
// CORS => Cross Origin Resource Sharing

//se coge del controller funciones de modelo y maneja errores CRUD para no saber su implementación
import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController.js";
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validarUsuario, validarUsuarioPassword, validarUsuarioUpdateById } from "../middlewares/validarUsuario.js";
export const usuarioRouter = Router();

// Métodos relacionados con la entidad usuario

// Registro de usuarios con validación previa
usuarioRouter.post('/register', validarUsuario,UsuarioController.register);

// Obtener un usuario por ID
usuarioRouter.get('/usuarios/:id',verifyToken ,UsuarioController.getById);

// Actualizar un usuario (parcialmente)
usuarioRouter.patch('/usuarios/:id',verifyToken,validarUsuarioUpdateById ,UsuarioController.updateById);

// Actualizar contraseña de un usuario
usuarioRouter.patch('/usuarios/:id/password', verifyToken ,validarUsuarioPassword,UsuarioController.updatePassword);

// Eliminar un usuario
usuarioRouter.delete('/usuarios/:id',verifyToken , UsuarioController.delete);

usuarioRouter.delete('/adminDeleteMember',verifyToken , UsuarioController.adminDeleteUserByUsername);

usuarioRouter.patch('/adminUpdateMember',verifyToken , UsuarioController.promoteMemberToAdmin);
