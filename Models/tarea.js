
import { connection } from '../config/mysqlConnection.js';
import { validarCredencialesTarea } from '../middlewares/validacionesCreaciones.js';

export class TareaModel {
  
  static async getById({ id }) {
    const [rows] = await connection.execute('SELECT descripcion, valor, fecha_inicio_inicio, fecha_inicio_fin, estado FROM tarea WHERE id = ?', [id]);

    if (rows.length > 0) {
        const row = rows[0]; 
        const fecha_inicio_inicio = new Date(row.fecha_inicio_inicio);
        const fecha_inicio_fin = new Date(row.fecha_inicio_fin);

        return {
            ...row,
            fecha_inicio_inicio: fecha_inicio_inicio.toISOString().split('T')[0],
            fecha_inicio_fin: fecha_inicio_fin.toISOString().split('T')[0],
        };
    } else {
        return null; 
    }
  }

  static async getAll({ id_usuario }) {
    const [rows] = await connection.execute('SELECT descripcion,valor,fecha_inicio_inicio,fecha_inicio_fin,estado FROM tarea WHERE id_usuario = ?', [id_usuario]);

    if (rows.length > 0) {
      return rows.map(row => {
          const fecha_inicio_inicio = new Date(row.fecha_inicio_inicio);
          const fecha_inicio_fin = new Date(row.fecha_inicio_fin);

          return {
              ...row,
              fecha_inicio_inicio: fecha_inicio_inicio.toISOString().split('T')[0], // Formatea la fecha_inicio de inicio
              fecha_inicio_fin: fecha_inicio_fin.toISOString().split('T')[0], // Formatea la fecha_inicio de fin
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

  static async updateById({ id, input }) {
        const [rows] = await connection.execute('SELECT * FROM tarea WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Recurso no encontrado');
        }
    
        const existingRow = rows[0]; 
        const datosAValidar = {};
    
        if (input.descripcion !== undefined) 
          datosAValidar.descripcion = input.descripcion;
        else{
          datosAValidar.descripcion = existingRow.descripcion;
        }
        if (input.valor !== undefined) 
          datosAValidar.valor = input.valor;
        else{
          datosAValidar.valor = existingRow.valor;
        }
        if (input.fecha_inicio !== undefined) 
          datosAValidar.fecha_inicio = input.fecha_inicio;
        else{
          datosAValidar.fecha_inicio = existingRow.fecha_inicio;
        }

        if (input.fecha_fin !== undefined) 
          datosAValidar.fecha_fin = input.fecha_fin;
        else{
          datosAValidar.fecha_fin = existingRow.fecha_fin;
        }

        if (input.estado !== undefined) 
          datosAValidar.estado = input.estado;
        else{
          datosAValidar.estado = existingRow.estado;
        }

        // Llama al middleware para validar los datos
        const validacion = await validarCredencialesTarea({ body: datosAValidar });

        if (!validacion.success) {
            return { success: false, status: validacion.status, message: validacion.message };
        }
    
        const updatedRow = {
            descripcion: input.descripcion || existingRow.descripcion,
            valor: input.valor !== undefined ? input.valor : existingRow.valor,
            fecha_inicio: input.fecha_inicio || existingRow.fecha_inicio,
            fecha_fin: input.fecha_fin || existingRow.fecha_fin,
            estado: input.estado || existingRow.estado,
            id_usuario: existingRow.id_usuario,
        };
    
        const result = await connection.execute(`
            UPDATE tarea
            SET descripcion = ?, valor = ?, fecha_inicio = ?, fecha_fin = ? , id_usuario = ?, estado = ?
            WHERE id = ?`,
            [
                updatedRow.descripcion,
                updatedRow.valor,
                updatedRow.fecha_inicio,
                updatedRow.fecha_fin,
                updatedRow.id_usuario,
                updatedRow.estado,
                id,
            ]
        );
    
        return { success: true, id, ...updatedRow }; 
    }
    
  

    static async create({ input }) {
      try {
          const [result] = await connection.execute(
              'INSERT INTO tarea (id_usuario, descripcion, fecha_inicio, fecha_fin, estado, valor) VALUES (?,?,?,?,?,?)',
              [input.id_usuario, input.descripcion, input.fecha_inicio, input.fecha_fin, input.estado, input.valor]
          );
          return { id_tarea: result.insertId, affectedRows: result.affectedRows };
      } catch (error) {
          console.error('Error al crear tarea:', error);
          throw error;
      }
  }

  static async create({ input }) {
      try {
        console.log("input en tarea:", input);
        const [result] = await connection.execute(
              'INSERT INTO tarea (id_usuario, descripcion, fecha_inicio, fecha_fin, estado, valor) VALUES (?,?,?,?,?,?)',
              [input.id_usuario, input.descripcion, input.fecha_inicio, input.fecha_fin, input.estado, input.valor]
        );
        console.log("Resultado de la inserción en tarea:", result);
        return { id_tarea: result.insertId, affectedRows: result.affectedRows };
      } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error;
      }
  }
}