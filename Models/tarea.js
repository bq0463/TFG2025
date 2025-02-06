
import { connection } from '../config/mysqlConnection.js';

export class TareaModel {
  
  static async getById({ id }) {
    const [rows] = await connection.execute('SELECT descripcion, valor, fecha_inicio, fecha_fin, estado FROM tarea WHERE id = ?', [id]);

    if (rows.length > 0) {
        const row = rows[0]; 
        const fecha_inicio = new Date(row.fecha_inicio);
        const fecha_fin = new Date(row.fecha_fin);

        return {
            ...row,
            fecha_inicio: fecha_inicio.toISOString().split('T')[0],
            fecha_fin: fecha_fin.toISOString().split('T')[0],
        };
    } else {
        return null; 
    }
}

  static async getAll({ id_usuario }) {
    const [rows] = await connection.execute('SELECT descripcion,valor,fecha_inicio,fecha_fin,estado FROM tarea WHERE id_usuario = ?', [id_usuario]);

    if (rows.length > 0) {
      return rows.map(row => {
          const fecha_inicio = new Date(row.fecha_inicio);
          const fecha_fin = new Date(row.fecha_fin);

          return {
              ...row,
              fecha_inicio: fecha_inicio.toISOString().split('T')[0], // Formatea la fecha de inicio
              fecha_fin: fecha_fin.toISOString().split('T')[0], // Formatea la fecha de fin
          };
      });
    } else {
      return null; 
    }
    
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
    try{
      const [result] = await connection.execute(
      'INSERT INTO tarea (id_usuario,descripcion, fecha_inicio, fecha_fin, estado, valor) VALUES (?,?,?,?,?,?)',
      [input.id_usuario, input.descripcion, input.fecha_inicio, input.fecha_fin, input.estado, input.valor]
      );
      return result;
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw error;
    }
  }
}