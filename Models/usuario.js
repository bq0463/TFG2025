import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { config } from '../config/mysqlConnection.js';

const connection = await mysql.createConnection(config);

export class UsuarioModel {
  static async getById({ id }) {
    return connection.execute('SELECT * FROM usuario WHERE id = ?', [id]);
  }

  static async delete({ id }) {
    const [result] = await connection.execute('DELETE FROM usuario WHERE id = ?', [id]);
    return result;
  }

  static async update({ id, input }) {
    const [result] = await connection.execute(
      'UPDATE usuario SET nombre_usuario = ?, email = ? WHERE id = ?',
      [input.nombre_usuario, input.email, id]
    );

    return result;
  }

  static async updatePassword({ id, newPassword }) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      await connection.execute(
        'UPDATE usuario SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
  
      return true;
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  }
  
  static async login({ nombre_usuario, password }) {
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM usuario WHERE nombre_usuario = ?',
        [nombre_usuario]
      );

      if (rows.length === 0) {
        return null; // Usuario no encontrado
      }

      const usuario = rows[0];

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, usuario.password);

      if (!passwordMatch) {
        return null; // Contraseña incorrecta
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return { usuario, token };  // Devolvemos el usuario y el token
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }
  

  static async register({ nombre_usuario, email, password }) {
    try {
      // Generar un hash de la contraseña con un "salt" de 10 rondas
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await connection.execute(
        'INSERT INTO usuario (nombre_usuario, email, password) VALUES (?, ?, ?)',
        [nombre_usuario, email, hashedPassword]
      );

      return result;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }
}