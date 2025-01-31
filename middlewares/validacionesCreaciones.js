import { connection } from "../config/mysqlConnection";


export async function validarCredencialesUsuario(req, res) {
    const { nombre_usuario, password, email } = req.body;
  
    // Verificar que todos los campos estén presentes
    if (!nombre_usuario || !password || !email) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }
  
    // Validar longitud de los campos y formato del email
    if (nombre_usuario.length < 5 || password.length < 5 || !email.includes("@")) {
      return res.status(400).json({ message: "Credenciales inválidas: caracteres menores a 5 o email incorrecto" });
    }
  
    try {
      // Consulta asíncrona a la base de datos
      const [rows] = await connection.execute(
        'SELECT * FROM usuario WHERE nombre_usuario = ? OR email = ?',
        [nombre_usuario, email]
      );
  
      // Comprobar si ya existe el usuario
      if (rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
  
    } catch (error) {
      console.error("Error al validar credenciales:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  export async function validarCredencialesTarea(req, res) {
    const { descripcion, fecha_fin } = req.body;
  
    // Verificar que todos los campos estén presentes
    if (!descripcion || !fecha_fin) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }
  
    // Validar longitud de los campos y formato del email
    if ( descripcion.length < 5 || !fecha_fin) {
      return res.status(400).json({ message: "Credenciales inválidas: caracteres menores a 5 o no hay fecha fin" });
    }

  }

  export async function validarCredencialesProyecto(req, res) {
    const { titulo, descripcion, fecha_entrega } = req.body;
  
    // Verificar que todos los campos estén presentes
    if (!titulo || !descripcion || !fecha_entrega) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }
  
    // Validar longitud de los campos y formato del email
    if (titulo.length < 5 || descripcion.length < 5 || !fecha_entrega) {
      return res.status(400).json({ message: "Credenciales inválidas: caracteres menores a 5 o no hay fecha de entrega" }); 
    }

  }

  export async function validarCredencialesExamen(req, res) {
    const { nota,fecha } = req.body;
  
    // Verificar que todos los campos estén presentes
    if (!fecha) {
      return res.status(400).json({ message: "Falta fecha" });
    }
    
    if(typeof nota !== 'number'){
      return res.status(400).json({ message: "La nota debe ser un número" });
    }
    
  }
  