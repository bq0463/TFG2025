import mysql from 'mysql2/promise';
import { config } from '../config/mysqlConnection.js';

const connection = await mysql.createConnection(config);

export class TareaModel {
  
  static async getById({ id }) {
    const [result] = await connection.execute('SELECT * FROM tarea WHERE id = ?', [id]);
    return result.length ? result[0] : null;
  }

  static async getAll({ id_usuario }) {
    const [result] = await connection.execute('SELECT * FROM tarea WHERE id_usuario = ?', [id_usuario]);
    return result;
  }

  static async delete({ id }) {
    const [result] = await connection.execute('DELETE FROM tarea WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async update({ id, input }) {
    const [result] = await connection.execute(
      'UPDATE tarea SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, valor = ? WHERE id = ?',
      [input.nombre, input.descripcion, input.fecha_inicio, input.fecha_fin, input.estado, input.valor, id]
    );
    return result.affectedRows > 0;
  }

  static async create({ input }) {
    const [result] = await connection.execute(
      'INSERT INTO tarea (nombre, descripcion, fecha_inicio, fecha_fin, estado, valor) VALUES (?,?,?,?,?,?)',
      [input.nombre, input.descripcion, input.fecha_inicio, input.fecha_fin, input.estado, input.valor]
    );
    return { id: result.insertId };
  }
}