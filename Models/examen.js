import { connection } from '../config/mysqlConnection.js';
import { validarCredencialesExamen } from '../middlewares/validacionesCreaciones.js';

export class ExamenModel {

  static async getById({ id }) {
    const [rows] = await connection.execute('SELECT id,asignatura,nota,fecha FROM examen WHERE id = ?', [id]);
    return rows.map(row => ({
      ...row,
    }));
  }

  static async getAll({ id_usuario }) {
    const [rows] = await connection.execute('SELECT id,asignatura,nota,fecha FROM examen WHERE id_usuario = ?', [id_usuario]);
    return rows.map(row => ({
      ...row,
      })
    );
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

  static async updateById({ id, input }) {
    const [rows] = await connection.execute('SELECT * FROM examen WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new Error('Recurso no encontrado');
    }

    const existingRow = rows[0]; 
    const datosAValidar = {};

    if (input.asignatura !== undefined) datosAValidar.asignatura = input.asignatura;
    else{
      datosAValidar.asignatura = existingRow.asignatura;
    }
    if (input.nota !== undefined) datosAValidar.nota = input.nota;
    else{
      datosAValidar.nota = existingRow.nota;
    }
    if (input.fecha !== undefined) datosAValidar.fecha = input.fecha;
    else{
      datosAValidar.fecha = existingRow.fecha;
    }
    // Llama al middleware para validar los datos
    const validacion = await validarCredencialesExamen({ body: datosAValidar });
    if (!validacion.success) {
        return { success: false, status: validacion.status, message: validacion.message };
    }

    const updatedRow = {
        asignatura: input.asignatura || existingRow.asignatura,
        nota: input.nota !== undefined ? input.nota : existingRow.nota,
        fecha: input.fecha || existingRow.fecha,
        id_usuario: existingRow.id_usuario,
    };

    const result = await connection.execute(`
        UPDATE examen
        SET asignatura = ?, nota = ?, fecha = ?, id_usuario = ?
        WHERE id = ?`,
        [
            updatedRow.asignatura,
            updatedRow.nota,
            updatedRow.fecha,
            updatedRow.id_usuario,
            id,
        ]
    );

    return { success: true, id, ...updatedRow }; 
}


  static async delete({ id }) {
    const [result] = await connection.execute('DELETE FROM examen WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
