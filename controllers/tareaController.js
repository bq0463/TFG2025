import { validarCredencialesTarea } from "../middlewares/validacionesCreaciones.js";
import { TareaModel } from "../Models/tarea.js";
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
      if(!tareas)
        return res.status(404).json({message: 'No hay tareas'});
      return res.json(tareas);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
  
  static async create(req, res) {
    try {
        const { id_usuario } = req.params;
        const {  descripcion, fecha_inicio, fecha_fin, estado, valor } = req.body;

        // Validar credenciales
        const validacion = await validarCredencialesTarea(req);

        if (!validacion.success) {
            return res.status(validacion.status).json({ message: validacion.message });
        }

        const tarea = await TareaModel.create({ input: { id_usuario, descripcion, fecha_inicio, fecha_fin, estado, valor } });

        if (tarea.affectedRows > 0) {
          return res.status(201).json({ message: "Tarea creada correctamente",});
        }

        return res.status(500).json({ message: "Error desconocido al crear tarea" });
    } catch (error) {
        return res.status(500).json({ message: 'Datos incorrectos', error: error.message });
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

  static async updateById(req, res) {
    try {
      const { id } = req.params;
      const tareaActualizada = await TareaModel.updateById({ id, input: req.body });
      if (!tareaActualizada) return res.status(404).json({ message: 'Tarea no encontrada' });
      return res.json({ message: 'Tarea actualizada' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
}
