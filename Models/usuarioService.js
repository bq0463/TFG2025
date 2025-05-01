import { connection } from '../config/mysqlConnection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UsuarioService{
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
}