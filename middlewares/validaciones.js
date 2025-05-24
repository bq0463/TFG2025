import { connection } from '../config/mysqlConnection.js';


export async function validarCredencialesUsuario(req) {
  const { nombre_usuario, contrasena, email } = req.body;

  // Verificar que todos los campos estén presentes
  if (!nombre_usuario || !contrasena || !email) {
    return { success: false, status: 400, message: "Faltan credenciales" };
  }

  // Validar longitud de los campos y formato del email
  if (nombre_usuario.length < 5 || contrasena.length < 5 || !email.includes("@") || email.length < 15) {
    return { 
      success: false, 
      status: 400, 
      message: "Credenciales inválidas: caracteres de usuario y contraseña menores a 5 o email incorrecto sin @ o email < 15 caracteres" 
    };
  }

  if (nombre_usuario.length > 50 || contrasena.length > 30 || email.length > 100) {
    return { 
      success: false, 
      status: 400, 
      message: "Credenciales inválidas: demasiados caracteres, MAX: 50 en usuario, 30 en contraseña y 100 en email" 
    };
  }

  try {
    // Consultas asíncronas a la base de datos para verificar nombre de usuario y email
    const [rowsUsuario] = await connection.execute(
      "SELECT * FROM usuario WHERE nombre_usuario = ?",
      [nombre_usuario]
    );

    const [rowsEmail] = await connection.execute(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );

    // Verificar si ya existe el nombre de usuario
    if (rowsUsuario.length > 0) {
      return { success: false, status: 409, message: "El nombre de usuario ya está en uso, elige otro." };
    }

    // Verificar si ya existe el email
    if (rowsEmail.length > 0) {
      return { success: false, status: 409, message: "El correo electrónico ya está registrado, usa otro." };
    }

    // Si pasa todas las validaciones
    return { success: true };
  } catch (error) {
    console.error("Error al validar credenciales:", error);
    return { success: false, status: 500, message: "Error interno del servidor" };
  }
}

export async function validarUpdateById(req, res, next) {
  const { nombre_usuario, email } = req.body;

  if (nombre_usuario && nombre_usuario.length < 5) {
    return res.status(400).json({ message: "El nombre de usuario debe tener al menos 5 caracteres." });
  }

  if (nombre_usuario && nombre_usuario.length > 50) {
    return res.status(400).json({ message: "El nombre de usuario no puede tener más de 50 caracteres." });
  }

  if (email && !email.includes("@")) {
    return res.status(400).json({ message: "El correo electrónico debe ser válido (contener @)." });
  }

  if (email && email.length > 50) {
    return res.status(400).json({ message: "El correo electrónico no puede tener más de 50 caracteres." });
  }

  if (email) {
    const [rowsEmail] = await connection.execute("SELECT * FROM usuario WHERE email = ?", [email]);

    if (rowsEmail.length > 0) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado, usa otro." });
    }
  }

  return { success: true, message: "Usuario actualizado correctamente" };
}

export async function validarUpdatePassword(req, res, next) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Se requieren la antigua y nueva contraseña' });
  }

  if (newPassword.length < 5) {
    return res.status(400).json({ message: "La nueva contraseña debe tener al menos 5 caracteres." });
  }

  if (newPassword.length > 30) {
    return res.status(400).json({ message: "La nueva contraseña no puede tener más de 30 caracteres." });
  }

  return { success: true, message: "Contraseña actualizada correctamente" };
}

export async function validarCredencialesTarea(req) {
  const { descripcion, fecha_fin } = req.body;

  // Verificar que todos los campos estén presentes
  if (!descripcion || !fecha_fin) {
    return { success: false, status: 400, message: "Faltan credenciales" };
  }

  // Validar longitud de la descripcion
  if (descripcion.length < 5) {
    return { success: false, status: 400, message: "Credenciales inválidas: descripcion demasiado corta (mínimo 5 caracteres)" };
  }

  if (descripcion.length > 255) {
    return { success: false, status: 400, message: "Credenciales inválidas: demasiados caracteres, MAX: 255 caracteres en descripcion" };
  }

  // Validar la fecha de fin
  if (!fecha_fin || isNaN(new Date(fecha_fin))) {
    return { success: false, status: 400, message: "Credenciales inválidas: fecha de fin incorrecta o vacía" };
  }

  // Si todo está correcto
  return { success: true , message: "Tarea creada correctamente" };
}


  export async function validarCredencialesProyecto(req) {
    const { titulo, descripcion, fecha_entrega } = req.body;
  
    if (!titulo  || !fecha_entrega) {
      return { success: false, status: 400, message: "Faltan credenciales" };
    }

    if (titulo.length > 100 || descripcion.length > 255 ) {
      return { success: false, status: 400, message: "Credenciales inválidas: titulo demasiado largo (100 caracteres máx) o descripcion demasiado larga (255 caracteres máx)" };
    }

    if ( isNaN(new Date(fecha_entrega))) {
      return { success: false, status: 400, message: "Credenciales inválidas: fecha de entrega incorrecta o vacía" };
    }

    return { success: true , message: "Proyecto creado correctamente" };
  }

  export async function validarCredencialesExamen(req) {
    const { nota,fecha,asignatura } = req.body;
  
    // Verificar que todos los campos estén presentes
    if (!fecha) {
      return { success: false, status: 400, message: "Falta fecha" };
    }
    
    if (!asignatura) {
      return { success: false, status: 400, message: "Falta asignatura" };
    }

    if(typeof nota !== 'number'){
      return { success: false, status: 400, message: "La nota debe ser un número" };
    }

    if(asignatura.length > 100){
      return { success: false, status: 400, message: "La asignatura debe tener 100 caracteres máx" };
    }

    return { success: true , message: "Examen creado correctamente" };
  }
  