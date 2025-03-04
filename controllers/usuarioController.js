import { UsuarioModel } from '../Models/usuario.js';
import { validarCredencialesUsuario } from '../middlewares/validacionesCreaciones.js';
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

  static async updateById(req, res) {
    try {
      const { id} = req.params;

      const result = await UsuarioModel.updateById({ id, input: req.body });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  }

  static async updatePassword(req, res) {
    try {
      const { id } = req.params; 
      const { oldPassword, newPassword } = req.body; 
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Se requieren la antigua y nueva contraseña' });
      }
  
      const result = await UsuarioModel.updatePassword({ id, oldPassword, newPassword });
  
      if (result.success) {
        return res.json({ message: 'Contraseña actualizada correctamente' });
      }
  
      res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error) {
      if (error.message === 'La contraseña antigua no es correcta') {
        return res.status(400).json({ message: 'La contraseña antigua no es correcta' });
      }
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(500).json({ message: 'Error al actualizar contraseña', error: error.message });
    }
  }
  

  static async loginUser(req, res) {
    try {
        const { nombre_usuario, contrasena } = req.body;
        const result = await UsuarioModel.login({ nombre_usuario, contrasena });
        if (!result) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        res.status(201).json({ 
          id: result.usuario.id, 
          token: result.token,
          nombre_usuario: result.usuario.nombre_usuario,
          email: result.usuario.email,
          message: 'Login exitoso' 
      });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
  };


  static async register(req, res) {
    try {
      const { nombre_usuario, email, contrasena } = req.body;
  
      // Validar credenciales
      const validacion = await validarCredencialesUsuario(req);
  
      // Si la validación falla, envía el error al cliente
      if (!validacion.success) {
        return res.status(validacion.status).json({ message: validacion.message });
      }
  
      const result = await UsuarioModel.register({ nombre_usuario, email, contrasena });
  
      if (result.affectedRows > 0) {
        return res.status(201).json({ message: "Usuario creado correctamente" });
      }
  
      return res.status(500).json({ message: "Error desconocido al registrar el usuario" });
    } catch (error) {
      console.error("Error en el controlador de registro:", error);
      res.status(500).json({ message: "Error al registrar usuario", error });
    }
  }
  
}