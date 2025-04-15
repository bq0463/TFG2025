
import { TareaModel } from './tarea.js';
import { connection } from '../config/mysqlConnection.js';
import { validarCredencialesProyecto,validarCredencialesTarea } from '../middlewares/validacionesCreaciones.js';

export class ProyectoModel {

    static async getAll({ id_usuario }) {
        const [rows] = await connection.execute(`
            SELECT 
                p.id,
                p.titulo,
                p.descripcion,
                p.fecha_entrega,
                GROUP_CONCAT(DISTINCT u.nombre_usuario SEPARATOR ', ') AS usuarios,
                GROUP_CONCAT(DISTINCT t.descripcion SEPARATOR ', ') AS tareas
            FROM 
                usuario_proyecto up
            INNER JOIN 
                proyecto p ON p.id = up.id_proyecto
            LEFT JOIN 
                proyecto_tiene_tarea ptt ON ptt.id_proyecto = p.id
            LEFT JOIN 
                tarea t ON t.id = ptt.id_tarea
            LEFT JOIN 
                usuario u ON up.id_usuario = u.id
            WHERE 
                up.id_usuario = ?
            GROUP BY 
                p.id;
        `, [id_usuario]);
    
        return rows.map(row => ({
            ...row,
            usuarios: row.usuarios ? row.usuarios.split(', ') : [],
            fecha_entrega: row.fecha_entrega.toISOString().split('T')[0],
        }));
    }
    

    static async getAll({ id_usuario }) {
        const [rows] = await connection.execute(`
            SELECT 
                p.id,
                p.titulo,
                p.descripcion,
                p.fecha_entrega,
                GROUP_CONCAT(DISTINCT u.nombre_usuario SEPARATOR ', ') AS usuarios,
                GROUP_CONCAT(DISTINCT t.descripcion SEPARATOR ', ') AS tareas
            FROM 
                proyecto p
            INNER JOIN 
                usuario_proyecto up_filter ON p.id = up_filter.id_proyecto
            LEFT JOIN 
                usuario_proyecto up ON up.id_proyecto = p.id
            LEFT JOIN 
                usuario u ON u.id = up.id_usuario
            LEFT JOIN 
                proyecto_tiene_tarea ptt ON ptt.id_proyecto = p.id
            LEFT JOIN 
                tarea t ON t.id = ptt.id_tarea
            WHERE 
                up_filter.id_usuario = ?
            GROUP BY 
                p.id;
        `, [id_usuario]);
        
        return rows.map(row => ({
            ...row,
            fecha_entrega: row.fecha_entrega.toISOString().split('T')[0],
        }));
    }
    
    
    static async updateById({ id, input }) {
        const [rows] = await connection.execute('SELECT * FROM proyecto WHERE id = ?', [id]);
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

        if (input.fecha_entrega !== undefined) 
            datosAValidar.fecha_entrega = input.fecha_entrega;
        else{
          datosAValidar.fecha_entrega = existingRow.fecha_entrega;
        }

        if (input.titulo !== undefined) 
            datosAValidar.titulo = input.titulo;
        else{
          datosAValidar.titulo = existingRow.titulo;
        }

        // Llama al middleware para validar los datos
        const validacion = await validarCredencialesProyecto({ body: datosAValidar });

        if (!validacion.success) {
            return { success: false, status: validacion.status, message: validacion.message };
        }
    
        const updatedRow = {
            descripcion: datosAValidar.descripcion,
            fecha_entrega: datosAValidar.fecha_entrega,
            titulo: datosAValidar.titulo,
        };
    
        const result = await connection.execute(`
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

    static async createTareaProyecto(input) {    
            
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

        return {success: true,message: 'Se ha creado la tarea en el proyecto'};
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