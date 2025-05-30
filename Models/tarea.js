
import { connection } from '../config/mysqlConnection.js';
export class TareaModel {
  
  static async getById({ id }) {
    const [rows] = await connection.execute('SELECT id,descripcion, valor, fecha_inicio, fecha_fin, estado,tipo FROM tarea WHERE id = ?', [id]);

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
    const [rows] = await connection.execute('SELECT id,descripcion,valor,fecha_inicio,fecha_fin,estado FROM tarea WHERE id_usuario = ? AND tipo = ?', [id_usuario,'tarea']);

    return rows.map(row => {
        return {
            ...row,
        };
    });
  }

  static async getAllMetas({ id_usuario }) {
    const [rows] = await connection.execute('SELECT id,descripcion,valor,fecha_inicio,fecha_fin,estado FROM tarea WHERE id_usuario = ? AND tipo = ?', [id_usuario,'meta']);

    return rows.map(row => {
        return {
            ...row,
        };
    });
  }


  static async delete({ id }) {
    const [result] = await connection.execute('DELETE FROM tarea WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }


  static async updateById({ id, input }) {
    const [rows] = await connection.execute('SELECT * FROM tarea WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new Error('Recurso no encontrado');
    }

    const existingRow = rows[0];

    const updatedRow = {
        descripcion: input.descripcion || existingRow.descripcion,
        valor: input.valor !== undefined ? input.valor : existingRow.valor,
        fecha_inicio: input.fecha_inicio || existingRow.fecha_inicio,
        fecha_fin: input.fecha_fin || existingRow.fecha_fin,
        estado: input.estado || existingRow.estado,
        id_usuario: existingRow.id_usuario,
        tipo: input.tipo || existingRow.tipo,
    };

    await connection.execute(`
        UPDATE tarea
        SET descripcion = ?, valor = ?, fecha_inicio = ?, fecha_fin = ?, id_usuario = ?, estado = ?, tipo = ?
        WHERE id = ?`,
        [
            updatedRow.descripcion,
            updatedRow.valor,
            updatedRow.fecha_inicio,
            updatedRow.fecha_fin,
            updatedRow.id_usuario,
            updatedRow.estado,
            updatedRow.tipo,
            id,
        ]
    );

    return { success: true, id, ...updatedRow };
  }


  static async create({ input }) {
      try {
        const [result] = await connection.execute(
              'INSERT INTO tarea (id_usuario, descripcion, fecha_inicio, fecha_fin, estado, valor, tipo) VALUES (?,?,?,?,?,?,?)',
              [input.id_usuario, input.descripcion, input.fecha_inicio || null, input.fecha_fin, input.estado, input.valor,input.tipo || 'tarea']
        );
        
        return result;
      } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error;
      }
  }
}