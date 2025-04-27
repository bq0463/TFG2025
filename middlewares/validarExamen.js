
import { validarCredencialesExamen } from "./validaciones.js";

export async function validarExamen(req, res, next) {
  try {
    const validacion = await validarCredencialesExamen(req);

    if (!validacion.success) {
      return res.status(validacion.status).json({ message: validacion.message });
    }

    next();
  } catch (error) {
    console.error("Error en middleware validarExamen:", error);
    return res.status(500).json({ message: "Error interno al validar examen" });
  }
}
