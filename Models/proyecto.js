
import { TareaModel } from './tarea.js';
import { connection } from '../config/mysqlConnection.js';

export class ProyectoModel {

    static async getProyectoById({ id }) {
        const [rows] = await connection.execute(`
            SELECT 
                p.fecha_entrega,
                p.titulo,
                p.descripcion,
                GROUP_CONCAT(DISTINCT u.nombre_usuario SEPARATOR ', ') AS usuarios,
                GROUP_CONCAT(DISTINCT t.descripcion SEPARATOR ', ') AS tareas
            FROM 
                proyecto p
            LEFT JOIN 
                usuario_proyecto up ON p.id = up.id_proyecto
            LEFT JOIN 
                usuario u ON up.id_usuario = u.id
            LEFT JOIN 
                proyecto_tiene_tarea ptt ON ptt.id_proyecto = p.id
            LEFT JOIN 
                tarea t ON t.id = ptt.id_tarea
            WHERE 
                p.id = ?
            GROUP BY 
                p.id;
        `, [id]);
    
        return rows.map(row => ({
            ...row,
            fecha_entrega: row.fecha_entrega.toISOString().split('T')[0],
        }));
    }

    static async getAll({ id_usuario }) {
        const [rows] = await connection.execute(`
            SELECT 
                p.titulo,
                p.descripcion,
                p.fecha_entrega,GROUP_CONCAT(DISTINCT u.nombre_usuario SEPARATOR ', ') AS usuarios,
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
            fecha_entrega: row.fecha_entrega.toISOString().split('T')[0],
        }));
    }
    
    
    static async update({id, input}) {
        await connection.execute('UPDATE proyecto SET titulo = ?, descripcion = ?, fecha_entrega = ? WHERE id = ?', [input.titulo, input.descripcion, input.fecha_entrega, id]);
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
    

    static async createTarea({idProyecto, idTarea}) {
        const tarea = TareaModel.getTareaById({id: idTarea});
        if (!tarea) {
            throw new Error('Tarea no encontrada');}
        const tareaproyecto = await connection.execute('INSERT INTO proyecto_tarea (id_proyecto, id_tarea) VALUES (?,?)', [idProyecto, idTarea]);
        
        return tareaproyecto;
    }
}    