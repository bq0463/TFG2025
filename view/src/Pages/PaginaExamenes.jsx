import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaExamenes.css";
import ContenedorExamen from "../Components/Contenedor/ContenedorExamen.jsx";
import AlertaPersonalizada from "../Components/AlertaPersonalizada/AlertaPersonalizada.jsx";

const PaginaExamenes = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [examenes, setExamenes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoExamen, setNuevoExamen] = useState({ asignatura: "", fecha: "", nota: 0.00 });
  const navigate = useNavigate();
  const [creationMessage, setCreationMessage] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [mostrarFormularioCategoria,setMostrarFormularioCategoria] = useState(false);
  const [categoriasDesplegadas, setCategoriasDesplegadas] = useState({});
  const [mostrarSinCategoria, setMostrarSinCategoria] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const response = await fetch("http://localhost:5000/me", {
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

  useEffect(() => {
    if (userId) {
      const datosGuardados = localStorage.getItem(`categorias_${userId}`);
      if (datosGuardados) {
        setCategorias(JSON.parse(datosGuardados));
      }
    }
  }, [userId]);
  
  const agregarCategoria = () => {
    if (nuevaCategoria.trim() !== "" && !categorias.includes(nuevaCategoria)) {
      const nuevasCategorias = [...categorias, nuevaCategoria];
      if (nuevasCategorias.length < 16) {
        setCategorias(nuevasCategorias);
        localStorage.setItem(`categorias_${userId}`, JSON.stringify(nuevasCategorias));
        setNuevaCategoria("");
      } else {
        alert("No puedes añadir más de 15 categorías.");
      }
    };
  }

  const eliminarCategoria = (cat) => {
    const nuevasCategorias = categorias.filter(c => c !== cat);
    setCategorias(nuevasCategorias);
    localStorage.setItem(`categorias_${userId}`, JSON.stringify(nuevasCategorias));
  };

  const examenesPorCategoria = categorias.reduce((acc, cat) => {
    acc[cat] = examenes.filter(ex => ex.asignatura.toLowerCase().includes(cat.toLowerCase()));
    return acc;
  }, {});

  const sinCategoria = examenes.filter(ex => 
    !categorias.some(cat => ex.asignatura.toLowerCase().includes(cat.toLowerCase()))
  );
  
  const toggleCategoria = (cat) => {
    setCategoriasDesplegadas((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };
  
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

  const toggleFormularioCategoria = () => {
    setMostrarFormularioCategoria(!mostrarFormularioCategoria);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoExamen({ ...nuevoExamen, [name]: value });
  };

  const handleGuardarExamen = async () => {
    // Validación previa
    if (!nuevoExamen.asignatura.trim() || !nuevoExamen.fecha) {
      setCreationMessage("Por favor completa todos los campos obligatorios (asignatura y fecha).");
      return;
    }

    try {
      const fechaFormateada = new Date(nuevoExamen.fecha).toISOString().split('T')[0]; 
      const notaNumerica = nuevoExamen.nota !== "" ? parseFloat(nuevoExamen.nota) : 0;
      
      const response = await fetch(`http://localhost:5000/examenes/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asignatura: nuevoExamen.asignatura,
          fecha: fechaFormateada,
          nota: notaNumerica,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Examen creado con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        setCreationMessage(data.message || "Hubo un error al crear el examen.");
      }
    } catch (error) {
      console.error("Error al crear examen", error);
      setCreationMessage("Error inesperado: " + error.message);
    }
};

  

  return (
    <div className="PaginaExamenes">
      <header className="header">
        <nav>
          <button onClick={() => navigate("/inicio")} className="nav-b">Inicio</button>
          <button onClick={() => navigate("/tareas")} className="nav-b">Tareas/Metas</button>
          <button onClick={() => navigate("/proyectos")} className="nav-b">Proyectos</button>
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
            {creationMessage && <span className="creation-message-E">{creationMessage}</span>}
            {showAlert && <AlertaPersonalizada message={message} />}
          </div>
        )}

        <button onClick={toggleFormularioCategoria} className="nav-b">{mostrarFormularioCategoria ? "Cerrar Formulario" : "Crear Categoría"}</button>
        
        {mostrarFormularioCategoria && (
          <div className="formulario-categoria">
            <input
              type="text"
              placeholder="Agregar categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button onClick={agregarCategoria} className="nav-b">Añadir Categoría</button>
            <span className="categoria-mensaje">Las categorias clasifican si el examen contiene la palabra clave que se pone en este formulario, solo 15 categorías</span>
          </div>
        )}

        {categorias.map((cat) => (
          <div key={cat} className="grupo-categoria">
            <button onClick={() => toggleCategoria(cat)} className="nav-b">
              {categoriasDesplegadas[cat] ? "▼" : "►"} {cat} ({examenesPorCategoria[cat].length})
            </button>
            <button onClick={() => eliminarCategoria(cat)} className="nav-b eliminar-categoria">Eliminar categoria</button>
            {categoriasDesplegadas[cat] && (
              <div className="contenedor-examenes">
                {examenesPorCategoria[cat].map((examen) => (
                  <ContenedorExamen
                    key={examen.id}
                    id={examen.id}
                    fecha={examen.fecha}
                    asignatura={examen.asignatura}
                    nota={examen.nota}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {sinCategoria.length > 0 && (
          <div className="grupo-categoria">
            <button onClick={() => setMostrarSinCategoria(!mostrarSinCategoria)} className="nav-b">
              {mostrarSinCategoria ? "▼" : "►"} Sin Categoría ({sinCategoria.length})
            </button>

            {mostrarSinCategoria && (
              <div className="contenedor-examenes">
                {sinCategoria.map((examen) => (
                  <ContenedorExamen
                    key={examen.id}
                    id={examen.id}
                    fecha={examen.fecha}
                    asignatura={examen.asignatura}
                    nota={examen.nota}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PaginaExamenes;
