import { connection } from '../config/mysqlConnection.js';


export async function validarCredencialesUsuario(req) {
  const { nombre_usuario, contrasena, email } = req.body;

  // Verificar que todos los campos estén presentes
  if (!nombre_usuario || !contrasena || !email) {
    return { success: false, status: 400, message: "Faltan credenciales" };
  }

  // Validar longitud de los campos y formato del email
  if (nombre_usuario.length < 5 || contrasena.length < 5 || !email.includes("@")) {
    return { 
      success: false, 
      status: 411, 
      message: "Credenciales inválidas: caracteres menores a 5 o email incorrecto sin @" 
    };
  }

  if (nombre_usuario.length > 20 || contrasena.length > 15 || email.length > 50) {
    return { 
      success: false, 
      status: 411, 
      message: "Credenciales inválidas: demasiados caracteres, MAX: 20 en usuario, 15 en contraseña y 50 en email" 
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



export async function validarCredencialesTarea(req) {
  console.log("Validando credenciales de tarea...");
  const { descripcion, fecha_fin } = req.body;

  // Verificar que todos los campos estén presentes
  if (!descripcion || !fecha_fin) {
    return { success: false, status: 400, message: "Faltan credenciales" };
  }

  // Validar longitud de la descripcion
  if (descripcion.length < 5) {
    return { success: false, status: 411, message: "Credenciales inválidas: descripcion demasiado corta (mínimo 5 caracteres)" };
  }

  if (descripcion.length > 255) {
    return { success: false, status: 411, message: "Credenciales inválidas: demasiados caracteres, MAX: 255 caracteres en descripcion" };
  }

  // Validar la fecha de fin
  if (!fecha_fin || isNaN(new Date(fecha_fin))) {
    return { success: false, status: 411, message: "Credenciales inválidas: fecha de fin incorrecta o vacía" };
  }

  // Si todo está correcto
  return { success: true , message: "Tarea creada correctamente" };
}


  export async function validarCredencialesProyecto(req) {
    const { titulo, descripcion, fecha_entrega } = req.body;
  
    // Verificar que todos los campos estén presentes
    if (!titulo || !descripcion || !fecha_entrega) {
      return { success: false, status: 400, message: "Faltan credenciales" };
    }
  
    // Validar longitud de los campos y formato del email
    if (titulo.length < 5 ) {
      return { success: false, status: 411, message: "Credenciales inválidas: titulo demasiado corto (5 caracteres minimo)" };
    }

    if (titulo.length > 100 || descripcion.length > 255 ) {
      return { success: false, status: 411, message: "Credenciales inválidas: titulo demasiado largo (100 caracteres) o descripcion demasiado larga (255 caracteres)" };
    }

    if ( isNaN(new Date(fecha_entrega))) {
      return { success: false, status: 411, message: "Credenciales inválidas: fecha de entrega incorrecta o vacía" };
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

    return { success: true , message: "Examen creado correctamente" };
  }
  