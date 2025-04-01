import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaExamenes.css";
import ContenedorExamen from "../Components/Contenedor/ContenedorExamen.jsx";

const PaginaExamenes = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [examenes, setExamenes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoExamen, setNuevoExamen] = useState({ asignatura: "", fecha: "", nota: 0.00 });
  const navigate = useNavigate();
  const [creationMessage, setCreationMessage] = useState("");
  
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

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoExamen({ ...nuevoExamen, [name]: name === "nota" ? (value === "" ? 0.00 : parseFloat(value)) : value});
  };

  const handleGuardarExamen = async () => {
    try {
      const fechaFormateada = new Date(nuevoExamen.fecha).toISOString().split('T')[0]; 
      
      const response = await fetch(`http://localhost:5000/examenes/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asignatura: nuevoExamen.asignatura,
          fecha: fechaFormateada,
          nota: nuevoExamen.nota,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        window.location.reload();
      } else {
        setCreationMessage(data.message);
      }
    } catch (error) {
      console.error("Error al crear examen", error);
    }
  };
  

  return (
    <div className="PaginaExamenes">
      <header className="header">
        <nav>
          <button onClick={() => navigate("/inicio")} className="nav-b">Inicio</button>
          <button onClick={() => navigate("/tareas")} className="nav-b">Tareas</button>
          <button onClick={() => navigate("/proyectos")} className="nav-b">Proyectos</button>
          <button onClick={() => navigate("/examenes")} className="nav-b">Exámenes</button>
          <button onClick={handleLogout} className="nav-b">Cerrar sesión</button>
          <button onClick={() => navigate("/perfil")} className="username">{username}</button>
        </nav>
      </header>

      <div className="examenes">
        <h1>Tus Exámenes</h1>
        <button onClick={toggleFormulario} className="nav-b">{mostrarFormulario ? "Cerrar Formulario" : "Crear Examen"}</button>
        
        {mostrarFormulario && (
          <div className="formulario-examen">
            <input type="text" name="asignatura" placeholder="Asignatura/fecha requerida" value={nuevoExamen.asignatura} onChange={handleInputChange} required/>
            <input type="date" name="fecha" value={nuevoExamen.fecha} onChange={handleInputChange} required />
            <input type="number" name="nota" placeholder="Max 2 dec" value={nuevoExamen.nota} onChange={handleInputChange} step="0.1"/>
            <button onClick={handleGuardarExamen} className="nav-b">Guardar Examen</button>
            {creationMessage && <p>{creationMessage}</p>}
          </div>
        )}

        {examenes.length > 0 ? (
          <div className="contenedor-examenes">
            {examenes.map((examen) => (
              <ContenedorExamen
                key={examen.id}
                id={examen.id}
                fecha={examen.fecha}
                asignatura={examen.asignatura}
                nota={examen.nota}
              />
            ))}
          </div>
        ) : (
          <h2>No hay exámenes disponibles.</h2>
        )}
      </div>
    </div>
  );
};

export default PaginaExamenes;
