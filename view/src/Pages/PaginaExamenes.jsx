import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaExamenes.css";
import ContenedorExamen from "../Components/Contenedor/ContenedorExamen.jsx";

const PaginaExamenes = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [examenes, setExamenes] = useState([]);
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
        setUserId(data.id);
      } catch (error) {
        navigate("/");
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const getExams = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/examenes`, {
            method: "GET",
            credentials: "include",
          });

          const data = await response.json();
          setExamenes(data);
        } catch (error) {
          console.error("Error al obtener exámenes", error);
        }
      };

      getExams();
    }
  }, [userId]);

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

  const handleIntro = async () => {
    try {
      navigate("/inicio");
    } catch (error) {
      console.error("Error al ir a Inicio", error);
    }
  };

  const handleTasks = async () => {
    try {
      navigate("/tareas");
    } catch (error) {
      console.error("Error al ir a Tareas", error);
    }
  };

  const handleProjects = async () => {
    try {
      navigate("/proyectos");
    } catch (error) {
      console.error("Error al ir a Proyectos", error);
    }
  };

  const handleExams = async () => {
    try {
      navigate("/examenes");
    } catch (error) {
      console.error("Error al ir a Exámenes", error);
    }
  };

  const handleProfile = async () => {
    try {
      navigate("/perfil");
    } catch (error) {
      console.error("Error al ir a Perfil", error);
    }
  };

  const handleExamCreation = async () => {
    try {
      await fetch("http://localhost:5000/usuarios/${userId}/examenes", {
        method: "POST",
        credentials: "include",
      });
      navigate("/examenes");
    } catch (error) {
      console.error("Error al crear examen", error);
    }
  };

  return (
    <div className="PaginaExamenes">
      <header className="header">
        <div className="header-bottom">
          <nav>
            <button onClick={handleIntro} className="nav-b">Inicio</button>
            <button onClick={handleTasks} className="nav-b">Tareas</button>
            <button onClick={handleProjects} className="nav-b">Proyectos</button>
            <button onClick={handleExams} className="nav-b">Examenes</button>
            <button onClick={handleLogout} className="nav-b">Cerrar sesión</button>
            <button onClick={handleProfile} className="username">{username}</button>
          </nav>
        </div>
      </header>

      <div className="examenes">
        <h1>Lista de Exámenes</h1>
        <button onClick={handleExamCreation}>Crear Examen</button>
        {examenes.length > 0 ? (
          examenes.map((examen) => (
            <ContenedorExamen
              key={examen.id}
              fecha={examen.fecha}
              asignatura={examen.asignatura}
              nota={examen.nota}
            />
          ))
        ) : (
          <h2>No hay exámenes disponibles.</h2>
        )}
      </div>
    </div>
  );
};

export default PaginaExamenes;
