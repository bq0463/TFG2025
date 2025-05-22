
import { validarCredencialesProyecto, validarCredencialesTarea } from '../middlewares/validaciones.js';
import {ProyectoModel} from '../Models/proyecto.js';
import {UsuarioModel} from '../Models/usuario.js';

export class ProyectoController {
  
  static async getById(req, res) {
    try{
      const { id } = req.params;
      const proyecto = await ProyectoModel.getProyectoById({ id });

      if (proyecto) 
        return res.json(proyecto);
      
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }catch(error){
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async getAll(req, res) {
    try{
      const { id_usuario } = req.params;
      const proyectos = await ProyectoModel.getAll({ id_usuario });

      if (!proyectos)
        return res.status(404).json({ message: 'Proyectos no encontrados' });
      
      return res.json(proyectos);
    }catch(error){
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }


  static async updateById(req, res) {
    try {
      const { id } = req.params;
      
      const proyectoActualizado = await ProyectoModel.updateById({ 
        id, 
        input: req.body
      });

      return res.json({ message: 'Proyecto actualizado correctamente', proyecto: proyectoActualizado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }


  static async create(req, res) {
    try {
      const { titulo, descripcion, fecha_entrega } = req.body;
      const {id_usuario} =req.params;
      
      const proyecto = await ProyectoModel.create({  
        input: { titulo, descripcion, fecha_entrega,id_usuario } 
      });

      if (proyecto.affectedRows > 0) {
        return res.status(201).json({ message: 'Proyecto creado' });
      } 

      return res.status(500).json({ message: 'Error desconocido al crear el proyecto' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el proyecto' });
    }
  }

  static async createTarea(req, res) {
    try {
      const input = {
        id_proyecto: req.params.id_proyecto,
        id_usuario: req.params.id_usuario,
        ...req.body,
      };
  
      const result = await ProyectoModel.createTareaProyecto(input);
  
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
  
      return res.status(201).json({ message: result.message, id_tarea: result.id_tarea });
  
    } catch (error) {
      return res.status(500).json({ message: 'Error interno al crear la tarea', error: error.message });
    }
  }
  


  static async associateByUsername(req,res){
    try {
      const {  nombre_usuario } = req.body;
      const {id_proyecto} = req.params;

      const usuario = await UsuarioModel.getByUsername({ nombre_usuario
      });

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      } 
      
      const asociado = await ProyectoModel.associateByUsername(usuario.id,id_proyecto);

      if(!asociado){
        return res.status(500).json({message: 'Error al asociar al usuario'});
      }

      return res.status(201).json({ message: 'usuario asociado al proyecto' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al poner la tarea en proyecto' });
    }
  }

  static async disassociateProyecto(req, res) {
    try {
      const { id_proyecto, id_usuario } = req.params;
      const result = await ProyectoModel.dissassociateProyecto({ id_proyecto, id_usuario });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario o proyecto no encontrado' });
      }

      return res.status(201).json({ message: 'Usuario desasociado del proyecto' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al desasociar el proyecto' });
    }
  }
}
