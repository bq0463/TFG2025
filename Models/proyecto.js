
import { TareaModel } from './tarea.js';
import { connection } from '../config/mysqlConnection.js';
export class ProyectoModel {

    static async getAll({ id_usuario }) {
      const [rows] = await connection.execute(`
        SELECT 
        p.id,
        p.titulo,
        p.descripcion,
        p.fecha_entrega,
        GROUP_CONCAT(DISTINCT u2.nombre_usuario SEPARATOR ', ') AS usuarios,
        GROUP_CONCAT(DISTINCT CONCAT(t.descripcion, ':', t.id, ':', t.id_usuario) SEPARATOR '|') AS tareas
        FROM 
        usuario_proyecto up
        INNER JOIN 
        proyecto p ON p.id = up.id_proyecto
        LEFT JOIN 
        proyecto_tiene_tarea ptt ON ptt.id_proyecto = p.id
        LEFT JOIN 
        tarea t ON t.id = ptt.id_tarea
        LEFT JOIN 
        usuario_proyecto up2 ON up2.id_proyecto = p.id
        LEFT JOIN 
        usuario u2 ON up2.id_usuario = u2.id
        WHERE 
        up.id_usuario = ?
        GROUP BY 
        p.id;
      `, [id_usuario]);
  
      return rows.map(row => {
        const tareas = row.tareas
          ? row.tareas.split('|').map(t => {
              const [descripcion, id, id_usuario] = t.split(':');
              return {
                descripcion,
                id,
                id_usuario: id_usuario || null,
              };
            })
          : [];
        return {
          ...row,
          usuarios: row.usuarios ? row.usuarios.split(', ') : [],
          tareas,
        };
      });    
    }
    
    static async updateById({ id, input }) {
      const [rows] = await connection.execute('SELECT * FROM proyecto WHERE id = ?', [id]);
    
      if (rows.length === 0) {
          throw new Error('Recurso no encontrado');
      }
  
      const existingRow = rows[0];
  
      const updatedRow = {
          descripcion: input.descripcion ?? existingRow.descripcion,
          fecha_entrega: input.fecha_entrega ?? existingRow.fecha_entrega,
          titulo: input.titulo ?? existingRow.titulo,
      };
  
      await connection.execute(`
          UPDATE proyecto
          SET descripcion = ?, fecha_entrega = ?, titulo = ?
          WHERE id = ?`,
          [
              updatedRow.descripcion,
              updatedRow.fecha_entrega,
              updatedRow.titulo,
              id,
          ]
      );
  
      return { success: true, id, ...updatedRow };
    }

    static async create({input}) {
        try{
            const [result1] = await connection.execute('INSERT INTO proyecto (titulo, descripcion, fecha_entrega) VALUES (?,?,?)', [input.titulo, input.descripcion, input.fecha_entrega]);

            const id_proyecto = result1.insertId;

            const [result2] = await connection.execute('INSERT INTO usuario_proyecto (id_usuario, id_proyecto) VALUES (?,?)', [ input.id_usuario,id_proyecto ]);
            
            return result2;
        }catch(error) {
            console.error('Error al crear proyecto:', error);
            throw error;
        }
    }

    static async createTarea({input}) {    
        /*    
        const tarea = await TareaModel.create({input});
        
        if (!tarea || !tarea.insertId) {
                return {success: false,message: 'La tarea no se ha podido crear'}
        }
        
        const id_tarea = tarea.insertId;

        const associate_tarea_proyecto = await connection.execute(
            'INSERT INTO proyecto_tiene_tarea (id_proyecto, id_tarea) VALUES (?,?)', 
            [input.id_proyecto, id_tarea]
        );
        
        if (associate_tarea_proyecto.affectedRows === 0) {
            return {success: false,message: 'La tarea no se ha podido relacionar con el proyecto'}
        }
        
        return {success: true,message: 'Se ha creado la tarea en el proyecto'}; */
        return await TareaModel.create({input});
    }

    static async associateTareaProyecto({ id_proyecto, id_tarea }) {

      const [result] = await connection.execute(
        'INSERT INTO proyecto_tiene_tarea (id_proyecto, id_tarea) VALUES (?, ?)', 
        [id_proyecto, id_tarea]
      );

      return result;
    }

    static async createTareaProyecto(input) {
      const tarea = await this.createTarea({ input });
      
      if (!tarea || !tarea.insertId) {
        return { success: false, message: 'La tarea no se ha podido crear' };
      }
      
      const id_tarea = tarea.insertId;
      
      const associateResult = await this.associateTareaProyecto({ id_proyecto: input.id_proyecto, id_tarea });

      if (associateResult.affectedRows === 0) {
        return { success: false, message: 'La tarea no se ha podido relacionar con el proyecto' };
      }

      return { success: true, message: 'Se ha creado la tarea en el proyecto', id_tarea };
    }

    

    static async associateByUsername(id_usuario,id_proyecto){
        const proyectousuario = await connection.execute('INSERT INTO usuario_proyecto (id_proyecto, id_usuario) VALUES (?,?)', [id_proyecto, id_usuario]);
        
        return proyectousuario;
    }

    static async dissassociateProyecto({ id_proyecto, id_usuario }) {
        const [result] = await connection.execute('DELETE FROM usuario_proyecto WHERE id_proyecto = ? AND id_usuario = ?', [id_proyecto, id_usuario]);

        return { success: true, message: 'Usuario desasociado del proyecto' };
    }

}    