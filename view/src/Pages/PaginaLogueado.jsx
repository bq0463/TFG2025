import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaginaLogueado = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const response = await fetch("http://localhost:5000/usuarios/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("No autenticado");
        }

        const data = await response.json();
        setUsername(data.nombre_usuario);
      } catch (error) {
        navigate("/");
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="PaginaLogueado">
      <header className="header">
        <div className="header-top">Bienvenido, {username || "Usuario"}</div>
      </header>
      <div className="content">
        <p>Has iniciado sesión correctamente.</p>
      </div>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <footer>
        <div className="footer">TFG 2025</div>
      </footer>
    </div>
  );
};

export default PaginaLogueado;
