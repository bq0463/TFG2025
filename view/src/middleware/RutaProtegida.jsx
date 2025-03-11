import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const RutaProtegida = () => {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const response = await fetch("http://localhost:5000/usuarios/me", {
          method: "GET",
          credentials: "include", // Para enviar la cookie
        });

        setAutenticado(response.ok); // Si la respuesta es OK, el usuario está autenticado
      } catch (error) {
        setAutenticado(false);
      }
    };

    verificarSesion();
  }, []);

  if (autenticado === null) {
    return <div>Cargando...</div>; // Mientras verifica la autenticación
  }

  return autenticado ? <Outlet /> : <Navigate to="/" />;
};

export default RutaProtegida;
