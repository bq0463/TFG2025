import { Router } from "express";
import { ExamenController } from "../controllers/examenController.js";
 const examenRouter = Router();

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
tareaRouter.get('/examenes/:id', ExamenController.getById);
tareaRouter.get('/usuarios/:id/examenes', ExamenController.getAll);
tareaRouter.delete('/examenes/:id', ExamenController.delete);
tareaRouter.patch('/examenes/:id', ExamenController.update);
tareaRouter.post('/examenes',ExamenController.create);

export default examenRouter;