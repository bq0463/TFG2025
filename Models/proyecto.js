
import { TareaModel } from './tarea.js';
import { connection } from '../config/mysqlConnection.js';
import { validarCredencialesProyecto } from '../middlewares/validacionesCreaciones.js';

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
            fecha_entrega_entrega: row.fecha_entrega_entrega.toISOString().split('T')[0],
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

    static async createTareaProyecto(req, res) {
        //hacer aqui todo,llamar al createTP de la tarea y asociarla 
        /*
        try {
            const { id_usuario } = req.params;
            const {  descripcion, fecha_inicio, fecha_fin, estado, valor } = req.body;
    
            // Validar credenciales
            const validacion = await validarCredencialesTarea(req);
            console.log("Resultado de validacion:", validacion);
    
            if (!validacion.success) {
                return res.status(validacion.status).json({ message: validacion.message });
            }
    
            const tarea = await TareaModel.createTP({ input: { id_usuario, descripcion, fecha_inicio, fecha_fin, estado, valor } });
    
            if (tarea.affectedRows > 0) {
                return { 
                    id_tarea: tarea.id_tarea
                };
            }
    
            return res.status(500).json({ message: "Error desconocido al crear tarea" });
        } catch (error) {
            return res.status(500).json({ message: 'Datos incorrectos', error: error.message });
        }
            */
        const [associate_tarea_proyecto] = await connection.execute(
            'INSERT INTO proyecto_tiene_tarea (id_proyecto, id_tarea) VALUES (?,?)', 
            [idProyecto, id_tarea]
        );
        
        return associate_tarea_proyecto;
    }
    

    static async associateByUsername(id_usuario,id_proyecto){
        const proyectousuario = await connection.execute('INSERT INTO usuario_proyecto (id_proyecto, id_usuario) VALUES (?,?)', [id_proyecto, id_usuario]);
        
        return proyectousuario;
    }
}    