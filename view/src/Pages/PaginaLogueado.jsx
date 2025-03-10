import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const PaginaLogueado = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/"); // Si no hay usuario, redirigir al inicio
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    navigate("/"); // Redirigir al inicio después de cerrar sesión
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
