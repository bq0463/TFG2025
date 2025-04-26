import { validarCredencialesUsuario } from "./validacionesCreaciones.js";

export async function validarUsuario(req, res, next) {
  try {
    const validacion = await validarCredencialesUsuario(req);

    if (!validacion.success) {
      return res.status(validacion.status).json({ message: validacion.message });
    }
    next();
  } catch (error) {
    console.error("Error en middleware validarUsuario:", error);
    return res.status(500).json({ message: "Error interno al validar usuario" });
  }
}

