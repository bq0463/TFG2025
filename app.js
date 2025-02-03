//cambiado a tipo module en package.json para poder usar import/export con extension .mjs de ES Modules (recomendado) ctrl + . para tranformar
import express, { json } from "express";
// importar rutas
import { usuarioRouter } from "./routes/rutasUsuario.js";
// comprobar tipos de datos
import { corsMiddleware } from "./middlewares/cors.js";
import dotenv from 'dotenv';
import { tareaRouter } from "./routes/rutasTarea.js";
import { examenRouter } from "./routes/rutasExamen.js";
import {proyectoRouter} from "./routes/rutasProyecto.js";
dotenv.config();

const app = express();
app.disable("x-powered-by");
app.use(json());
// esto es para definir los orígenes permitidos de puertos o paginas web en vez de usar * que es para todos
app.use(corsMiddleware());

// cargar rutas con router
app.use("/", usuarioRouter);
app.use("/",tareaRouter);
app.use("/",examenRouter);
app.use("/",proyectoRouter);

const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
