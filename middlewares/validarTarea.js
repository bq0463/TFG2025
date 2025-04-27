
import { validarCredencialesTarea } from "./validaciones.js";

export async function validarTarea(req, res, next) {
  try {
    const validacion = await validarCredencialesTarea(req);

    if (!validacion.success) {
      return res.status(validacion.status).json({ message: validacion.message });
    }
    next();
  } catch (error) {
    console.error("Error en middleware validarTarea:", error);
    return res.status(500).json({ message: "Error interno al validar tarea" });
  }
}
