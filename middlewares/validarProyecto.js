import { validarCredencialesProyecto } from "./validacionesCreaciones.js";

export async function validarProyecto(req, res, next) {
  try {
    const validacion = await validarCredencialesProyecto(req);

    if (!validacion.success) {
      return res.status(validacion.status).json({ message: validacion.message });
    }
    next();
  } catch (error) {
    console.error("Error en middleware validarProyecto:", error);
    return res.status(500).json({ message: "Error interno al validar proyecto" });
  }
}