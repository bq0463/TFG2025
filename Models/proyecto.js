
import { TareaModel } from './tarea.js';
import { connection } from '../config/mysqlConnection.js';

export class ProyectoModel {

    static async getProyectoById({id}) {
        const result = await connection.execute('SELECT * FROM proyecto WHERE id = ?', [id]);
        return result;
    }

    static async getAll({id_usuario}) {
        const result = await connection.execute('SELECT * FROM usuario_proyecto WHERE id_usuario = ?', [id_usuario]);
        return result;
    }
    
    static async update({id, input}) {
        await connection.execute('UPDATE proyecto SET titulo = ?, descripcion = ?, fecha_entrega = ? WHERE id = ?', [input.titulo, input.descripcion, input.fecha_entrega, id]);
    }

    static async create({id_usuario,input}) {
        await connection.execute('INSERT INTO proyecto (titulo, descripcion, fecha_entrega) VALUES (?,?,?)', [input.titulo, input.descripcion, input.fecha_entrega]);
        await connection.execute('INSERT INTO usuario_proyecto (id_usuario, id_proyecto) VALUES (?,?)', [ id_usuario, input.id_proyecto]);
    }

    static async createTarea({idProyecto, idTarea}) {
        const tarea = TareaModel.getTareaById({id: idTarea});
        if (!tarea) {
            throw new Error('Tarea no encontrada');}
        await connection.execute('INSERT INTO proyecto_tarea (id_proyecto, id_tarea) VALUES (?,?)', [idProyecto, idTarea]);
    }
}    