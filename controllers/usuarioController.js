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

        // Guardar el token en una cookie segura
        res.cookie('token', result.token, {
            httpOnly: true,  // Evita que JavaScript del cliente acceda a la cookie
            secure: process.env.NODE_ENV === 'production',  // true Solo si en HTTPS en producción, no en localhost, como en Vercel
            sameSite: 'Strict',  // Protege contra ataques CSRF
            maxAge: 24 * 60 * 60 * 1000 // Expira en 1 día
        });

        res.status(201).json({ 
          id: result.usuario.id, 
          nombre_usuario: result.usuario.nombre_usuario,
          email: result.usuario.email,
          message: 'Login exitoso' 
      });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
  }

  
  static async register(req, res) {
    try {
      const { nombre_usuario, email, contrasena } = req.body;

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

  static async logout(req,res) {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Strict" });
    res.json({ message: "Sesión cerrada correctamente" });
  }

  static async me(req, res) {
    res.json({ id: req.user.id, nombre_usuario: req.user.nombre_usuario });
  }
}