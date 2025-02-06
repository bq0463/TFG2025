import { connection } from '../config/mysqlConnection.js';

export class ExamenModel {

  static async getById({ id }) {
    const [rows] = await connection.execute('SELECT asignatura,nota,fecha FROM examen WHERE id = ?', [id]);
    return rows.map(row => ({
      ...row,
      fecha: row.fecha.toISOString().split('T')[0],
  }));
  }

  static async getAll({ id_usuario }) {
    const [rows] = await connection.execute('SELECT asignatura,nota,fecha FROM examen WHERE id_usuario = ?', [id_usuario]);
    return rows.map(row => ({
      ...row,
      fecha: row.fecha.toISOString().split('T')[0],
  }));
  }

  static async create({ input }) {
    try{
      const [result] = await connection.execute(
        'INSERT INTO examen (asignatura, fecha, nota,id_usuario) VALUES (?, ?, ?, ?)',
        [input.asignatura, input.fecha, input.nota,input.id_usuario]
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
