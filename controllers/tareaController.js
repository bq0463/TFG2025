export class TareaController {
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const tarea = await TareaModel.getById({ id });
      if (tarea) return res.json(tarea);
      return res.status(404).json({ message: 'Tarea no encontrada' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { id_usuario } = req.params;
      const tareas = await TareaModel.getAll({ id_usuario });
      return res.json(tareas);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
  
  static async create(req, res) {
    try {
      const { nombre, descripcion, fecha_inicio, fecha_fin, estado, valor } = req.body;
      const tarea = await TareaModel.create({ input: { nombre, descripcion, fecha_inicio, fecha_fin, estado, valor } });
      return res.status(201).json({ message: 'Tarea creada', id: tarea.id });
    } catch (error) {
      return res.status(400).json({ message: 'Datos incorrectos', error: error.message });
    }
  }  

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TareaModel.delete({ id });
      if (!deleted) return res.status(404).json({ message: 'Tarea no encontrada' });
      return res.json({ message: 'Tarea eliminada' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const tareaActualizada = await TareaModel.update({ id, input: req.body });
      if (!tareaActualizada) return res.status(404).json({ message: 'Tarea no encontrada' });
      return res.json({ message: 'Tarea actualizada' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
}
