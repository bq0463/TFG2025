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
    const { titulo, descripcion, fecha_entrega, id_usuario } = req.body;
    try {
      const idProyecto = await ProyectoModel.create({ 
        id_usuario, 
        input: { titulo, descripcion, fecha_entrega } 
      });
      return res.status(201).json({ message: 'Proyecto creado', idProyecto });
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear el proyecto' });
    }
  }

  static async createTarea(req, res) {
    const { idProyecto, idTarea } = req.body;
    try {
      await ProyectoModel.createTarea({ idProyecto, idTarea });
      return res.json({ message: 'Tarea añadida al proyecto' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
