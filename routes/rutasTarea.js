import { Router } from "express";
import { TareaController } from "../controllers/tareaController.js";
const tareaRouter = Router();

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
tareaRouter.get('/tareas/:id', TareaController.getById);
tareaRouter.get('/usuarios/:id/tareas', TareaController.getAll);
tareaRouter.delete('/examenes/:id', TareaController.delete);
tareaRouter.patch('/examenes/:id', TareaController.update);
tareaRouter.post('/examenes',TareaController.create);

export default tareaRouter;