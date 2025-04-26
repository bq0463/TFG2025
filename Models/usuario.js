import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connection } from '../config/mysqlConnection.js';

export class UsuarioModel {
  static async getById({ id }) {
    return connection.execute('SELECT nombre_usuario,email,rol FROM usuario WHERE id = ?', [id]);
  }

  static async getByUsername({ nombre_usuario }) {
    const [rows] = await connection.execute(
        'SELECT * FROM usuario WHERE nombre_usuario = ?', 
        [nombre_usuario]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async getByEmail({ email }) {
    return connection.execute('SELECT * FROM usuario WHERE email = ?', [email]);
  }


  static async delete({ id }) {
    try {
      const [result] = await connection.execute('DELETE FROM usuario WHERE id = ?', [id]);
      return result;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  static async updateById({ id, input }) {
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE id = ?', [id]);

    if (rows.length === 0) {
        throw new Error('Recurso no encontrado');
    }

    const existingRow = rows[0];
    const datosAValidar = {};

    datosAValidar.email = input.email !== undefined ? input.email : existingRow.email;
    datosAValidar.nombre_usuario = input.nombre_usuario !== undefined ? input.nombre_usuario : existingRow.nombre_usuario;

    const updatedRow = {
        nombre_usuario: datosAValidar.nombre_usuario,
        email: datosAValidar.email,
    };

    // Actualizar en la base de datos
    const [result] = await connection.execute(
        `UPDATE usuario
         SET nombre_usuario = ?, email = ?
         WHERE id = ?`,
        [updatedRow.nombre_usuario, updatedRow.email, id]
    );

    // Devolver el resultado completo
    return { success: true, affectedRows: result.affectedRows, id, ...updatedRow };
}


static async updatePassword({ id, oldPassword, newPassword }) {
  try {
    const [rows] = await connection.execute(
      'SELECT contrasena FROM usuario WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const usuario = rows[0];

    // Verificar si la contraseña antigua coincide
    const passwordMatch = await bcrypt.compare(oldPassword, usuario.contrasena);

    if (!passwordMatch) {
      return { success: false, message: 'Contraseña antigua incorrecta' };
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await connection.execute(
      'UPDATE usuario SET contrasena = ? WHERE id = ?',
      [hashedNewPassword, id]
    );

    return { success: true, message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    throw error;
  }
}

  
static async login({ nombre_usuario, contrasena }) {
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM usuario WHERE nombre_usuario = ?',
      [nombre_usuario]
    );

    const [rows1] = await connection.execute(
      'SELECT * FROM usuario WHERE email = ?',
      [nombre_usuario]
    );

    if (rows.length === 0 && rows1.length === 0) {
      return null; // Usuario no encontrado
    }

    const usuario = rows[0] || rows1[0];
    const contrasenaMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaMatch) {
      return null; 
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } // Expira en el tiempo definido en .env
    );

    return { usuario, token };  // Devolvemos el usuario y el token
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

  

  static async register({ nombre_usuario, email, contrasena }) {
    try {

      const saltRounds = 10;
      const hashedcontrasena = await bcrypt.hash(contrasena, saltRounds);

      const [result] = await connection.execute(
        'INSERT INTO usuario (nombre_usuario, email, contrasena) VALUES (?, ?, ?)',
        [nombre_usuario, email, hashedcontrasena]
      );

      return result;

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }
}