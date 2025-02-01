import { connection } from '../config/mysqlConnection.js';

export class ExamenModel {

  static async getById({ id }) {
    const [result] = await connection.execute('SELECT * FROM examen WHERE id = ?', [id]);
    return result.length ? result[0] : null;
  }

  static async getAll({ id_usuario }) {
    const [result] = await connection.execute('SELECT * FROM examen WHERE id_usuario = ?', [id_usuario]);
    return result;
  }

  static async create({ input }) {
    try{
      const [result] = await connection.execute(
        'INSERT INTO examen (asignatura, fecha, nota) VALUES (?, ?, ?)',
        [input.asignatura, input.fecha, input.nota]
      );
      return result;
    } catch (error) {
      console.error('Error al crear examen:', error);
      throw error;
    }
  }

  static async update({ id, input }) {
    const [result] = await connection.execute(
      'UPDATE examen SET asignatura = ?, fecha = ?, nota = ? WHERE id = ?',
      [input.asignatura, input.fecha, input.nota, id]
    );
    return result.affectedRows > 0;
  }

  static async delete({ id }) {
    const [result] = await connection.execute('DELETE FROM examen WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
