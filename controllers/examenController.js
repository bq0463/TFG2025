import { ExamenModel } from '../Models/examen.js';
import { validarCredencialesExamen } from '../middlewares/validacionesCreaciones.js';
export class ExamenController {

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const examen = await ExamenModel.getById({ id });
      if (examen) {
        return res.json(examen);
      }
      return res.status(404).json({ message: 'Examen no encontrado' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { id_usuario } = req.params;
      const examenes = await ExamenModel.getAll({ id_usuario });
      return res.json(examenes);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { asignatura, fecha, nota } = req.body;
      const {id_usuario} = req.params;
      const validacion = await validarCredencialesExamen(req);
      if (!validacion.success) {
        return res.status(validacion.status).json({ message: validacion.message });
      }
      const examen = await ExamenModel.create({ input: { asignatura, fecha, nota,id_usuario } });
      if (examen.affectedRows > 0) {
        return res.status(201).json({ message: "Examen creado correctamente" });
      }
      return res.status(500).json({ message: "Error desconocido al crear el examen" });
    } catch (error) {
      return res.status(400).json({ message: 'Datos incorrectos', error: error.message });
    }
  }

  static async updateById(req, res) {
    try {
      const { id } = req.params;
      const examenActualizado = await ExamenModel.updateById({ id, input: req.body });

      if (!examenActualizado) {
        return res.status(404).json({ message: 'Examen no encontrado' });
      }

      return res.status(200).json({ message: 'Examen actualizado' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ExamenModel.delete({ id });

      if (!deleted) {
        return res.status(404).json({ message: 'Examen no encontrado' });
      }

      return res.json({ message: 'Examen eliminado' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
}
