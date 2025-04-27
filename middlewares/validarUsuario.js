import { validarCredencialesUsuario,validarUpdateById,validarUpdatePassword } from "./validaciones.js";

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

export async function validarUsuarioUpdateById(req, res, next) {
  try{
    const validacion = await validarUpdateById(req);
    if (!validacion.success) {
      return res.status(validacion.status).json({ message: validacion.message });
    } 
    next();
  }
  catch (error) {
    console.error("Error en middleware validarUsuarioId:", error);
    return res.status(500).json({ message: "Error interno al validar usuario" });
  }
}

export async function validarUsuarioPassword(req, res, next) {
  try{
    const validacion = await validarUpdatePassword(req);
    if (!validacion.success) {
      return res.status(validacion.status).json({ message: validacion.message });
    } 
    next();
  }
  catch (error) {
    console.error("Error en middleware validarUsuarioPassword:", error);
    return res.status(500).json({ message: "Error interno al validar usuario" });
  }
}

