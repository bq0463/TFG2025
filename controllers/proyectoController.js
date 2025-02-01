import { ProyectoModel } from '../models/proyectoModel.js';
import { validarCredencialesProyecto } from '../middlewares/validacionesCreaciones.js';
export class ProyectoController {
  
  static async getById(req, res) {
    const { id } = req.params;
    const proyecto = await ProyectoModel.getProyectoById({ id });
    if (proyecto) return res.json(proyecto);
    return res.status(404).json({ message: 'Proyecto no encontrado' });
  }

  static async getAll(req, res) {
    const { id } = req.params;
    const proyectos = await ProyectoModel.getAll({ id_usuario: id });
    if (proyectos.length > 0) return res.json(proyectos);
    return res.status(404).json({ message: 'Proyectos no encontrados' });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { titulo, descripcion, fecha_entrega } = req.body;

    const proyectoActualizado = await ProyectoModel.update({ 
      id, 
      input: { titulo, descripcion, fecha_entrega } 
    });

    if (!proyectoActualizado) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    return res.json({ message: 'Proyecto actualizado' });
  }

  static async create(req, res) {
    try {
      const { titulo, descripcion, fecha_entrega, id_usuario } = req.body;
      const validacion = await validarCredencialesProyecto(req);

      if (!validacion.success) {
        return res.status(validacion.status).json({ message: validacion.message });
      }

      const proyecto = await ProyectoModel.create({ 
        id_usuario, 
        input: { titulo, descripcion, fecha_entrega } 
      });

      if (proyecto.affectedRows > 0) {
        return res.status(201).json({ message: 'Proyecto creado' });
      } 

      return res.status(500).json({ message: 'Error desconocido al crear el proyecto' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el proyecto' });
    }
  }

  
}
