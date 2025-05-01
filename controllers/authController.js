import { UsuarioService } from '../Models/usuarioService.js';

export class AuthController {
  static async login(req, res) {
      try {
          const { nombre_usuario, contrasena } = req.body;
          const result = await UsuarioService.login({ nombre_usuario, contrasena });
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

  static async logout(req, res) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
    res.json({ message: 'Sesión cerrada correctamente' });
  }

  static async me(req, res) {
    res.json({ id: req.user.id, nombre_usuario: req.user.nombre_usuario });
  }

}
