import { TareaModel } from "../Models/tarea.js";
export class TareaController {
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const tarea = await TareaModel.getById({ id });
      if (tarea) return res.json(tarea);
      return res.status(404).json({ message: 'Tarea/meta no encontrada' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { id_usuario } = req.params;
      const tareas = await TareaModel.getAll({ id_usuario });
      if(!tareas)
        return res.status(404).json({message: 'No hay tareas'});
      return res.json(tareas);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async getAllMetas(req, res) {
    try {
      const { id_usuario } = req.params;
      const metas = await TareaModel.getAllMetas({ id_usuario });
      if(!metas)
        return res.status(404).json({message: 'No hay metas'});
      return res.json(metas);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  
  static async create(req, res) {
    try {
        const { id_usuario } = req.params;
        const {  descripcion, fecha_inicio, fecha_fin, estado, valor,tipo } = req.body;
        const tarea = await TareaModel.create({ input: { id_usuario, descripcion, fecha_inicio, fecha_fin, estado, valor,tipo } });

        if (tarea.affectedRows > 0) {
          return res.status(201).json({ message: "Tarea/Meta creada correctamente",});
        }

        return res.status(500).json({ message: "Error desconocido al crear la tarea/meta" });
    } catch (error) {
        return res.status(500).json({ message: 'Datos incorrectos', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TareaModel.delete({ id });

      if (!deleted) return res.status(404).json({ message: 'Tarea no encontrada' });

      return res.json({ message: 'Tarea/Meta eliminada' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async updateById(req, res) {
    try {
      const { id } = req.params;
      const tareaActualizada = await TareaModel.updateById({ id, input: req.body });
      
      return res.json({ message: 'Tarea/Meta actualizada correctamente', tarea: tareaActualizada });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
}
