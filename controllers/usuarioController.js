import { UsuarioModel } from '../Models/usuario.js';

export class UsuarioController {
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const [usuario] = await UsuarioModel.getById({ id });
      if (usuario.length > 0) return res.json(usuario[0]);
      res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await UsuarioModel.delete({ id });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre_usuario, email, password } = req.body;
      const result = await UsuarioModel.update({ id, input: { nombre_usuario, email} });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  }

  static async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      const result = await UsuarioModel.updatePassword({ id, newPassword });
      if (result) return res.json({ message: 'Contraseña actualizada' });
      res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar contraseña', error });
    }
  }

  static async login(req, res) {
    const { nombre_usuario, password } = req.body;
    const result = await UsuarioModel.login({ nombre_usuario, password });

    if (!result) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    return res.json({
      message: 'Inicio de sesión exitoso',
      token: result.token,
      usuario: {
        id: result.usuario.id,
        nombre_usuario: result.usuario.nombre_usuario,
        email: result.usuario.email
      }
    });
  }

  static async register(req, res) {
    try {
      const { nombre_usuario, email, contrasena } = req.body;
      const result = await UsuarioModel.register({ nombre_usuario, email, contrasena });
      if (result.affectedRows > 0) {
        return res.status(201).json({ message: 'Usuario creado correctamente' });
      }
      res.status(400).json({ message: 'Error al crear usuario' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error });
    }
  }
}