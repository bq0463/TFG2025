import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaProyectos.css";
import ContenedorProyecto from "../Components/Contenedor/ContenedorProyecto.jsx";
import AlertaPersonalizada from "../Components/AlertaPersonalizada/AlertaPersonalizada.jsx";

const PaginaProyectos = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState({ titulo: "", descripcion: "", fecha_entrega: ""});
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] = useState(false);
  const [categoriasDesplegadas, setCategoriasDesplegadas] = useState({});
  const [mostrarSinCategoria, setMostrarSinCategoria] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("No autenticado");

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
      const getProyectos = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/proyectos`, {
            method: "GET",
            credentials: "include",
          });

          const data = await response.json();
          console.log(data);
          setProyectos(data);
        } catch (error) {
          console.error("Error al obtener proyectos", error);
        }
      };
      
      getProyectos();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const datosGuardados = localStorage.getItem(`categorias_proyecto_${userId}`);
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
        localStorage.setItem(`categorias_proyecto_${userId}`, JSON.stringify(nuevasCategorias));
        setNuevaCategoria("");
      } else {
        alert("No puedes añadir más de 15 categorías.");
      }
    }
  };

  const eliminarCategoria = (cat) => {
    const categoriasActualizadas = categorias.filter(c => c !== cat);
    setCategorias(categoriasActualizadas);
    localStorage.setItem(`categorias_proyecto_${userId}`, JSON.stringify(categoriasActualizadas));
  };

  const proyectosPorCategoria = categorias.reduce((acc, cat) => {
    acc[cat] = proyectos.filter(p => p.titulo.toLowerCase().includes(cat.toLowerCase()));
    return acc;
  }, {});

  const sinCategoria = proyectos.filter(p =>
    !categorias.some(cat => p.titulo.toLowerCase().includes(cat.toLowerCase()))
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

  const toggleFormularioCategoria = () => {
    setMostrarFormularioCategoria(!mostrarFormularioCategoria);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProyecto({ ...nuevoProyecto, [name]: value });
  };

  const handleGuardarProyecto = async () => {
    
    if (!nuevoProyecto.titulo.trim() || !nuevoProyecto.fecha_entrega) {
      setCreationMessage("Por favor, complete todos los campos obligatorios (titulo, fecha_entrega).");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/proyectos/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: nuevoProyecto.titulo,
          fecha_entrega: nuevoProyecto.fecha_entrega,
          descripcion: nuevoProyecto.descripcion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Proyecto creado con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        setCreationMessage(data.message || "Hubo un error al crear el proyecto.");
      }
    } catch (error) {
      console.error("Error al crear proyecto", error);
      setCreationMessage("Error inesperado: " + error.message);
    }
};
  return (
    <div className="PaginaProyectos">
      <header className="header">
        <nav>
          <button onClick={() => navigate("/inicio")} className="nav-b">Inicio</button>
          <button onClick={() => navigate("/tareas")} className="nav-b">Tareas/Metas</button>
          <button onClick={() => navigate("/examenes")} className="nav-b">Examenes</button>
          <button onClick={handleLogout} className="nav-b">Cerrar sesión</button>
          <button onClick={() => navigate("/perfil")} className="username">{username}</button>
        </nav>
      </header>

      <div className="proyectos">
        <h1>Tus Proyectos</h1>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="nav-b">
          {mostrarFormulario ? "Cerrar Formulario" : "Crear Proyecto"}
        </button>
        {mostrarFormulario && (
          <div className="formulario-proyecto">
            <input
              type="text"
              name="titulo"
              placeholder="Título del proyecto"
              value={nuevoProyecto.titulo}
              onChange={handleInputChange}
              required
            />
            <textarea
              rows="4"
              cols="50"
              maxLength="200"
              type="text"
              name="descripcion"
              placeholder="Descripción del proyecto"
              value={nuevoProyecto.descripcion}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="fecha_entrega"
              value={nuevoProyecto.fecha_entrega}
              onChange={handleInputChange}
              required
            />

            <button onClick={handleGuardarProyecto} className="nav-b">Guardar Proyecto</button>
            {message && showAlert && <AlertaPersonalizada message={message} type="success" />}
            {creationMessage && <span className="creation-message-P">{creationMessage}</span>}
          </div>
        )}

        <button onClick={toggleFormularioCategoria} className="nav-b">
          {mostrarFormularioCategoria ? "Cerrar Formulario" : "Crear Categoría"}
        </button>

        {mostrarFormularioCategoria && (
          <div className="formulario-categoria">
            <input
              type="text"
              placeholder="Agregar categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button onClick={agregarCategoria} className="nav-b">Añadir Categoría</button>
            <span className="categoria-mensaje">
              Las categorías clasifican si el título del proyecto contiene la palabra clave, solo 15 categorías.
            </span>
          </div>
        )}

        {categorias.map((cat) => (
          <div key={cat} className="grupo-categoria">
            <button onClick={() => toggleCategoria(cat)} className="nav-b">
              {categoriasDesplegadas[cat] ? "▼" : "►"} {cat} ({proyectosPorCategoria[cat].length})
            </button>
            <button onClick={() => eliminarCategoria(cat)} className="nav-b">
              Eliminar Categoría
            </button>
            {categoriasDesplegadas[cat] && (
              <div className="contenedor-proyectos">
                {proyectosPorCategoria[cat].map((proyecto) => (
                  <ContenedorProyecto
                    key={proyecto.id}
                    id={proyecto.id}
                    titulo={proyecto.titulo}
                    fecha_entrega={proyecto.fecha_entrega}
                    descripcion={proyecto.descripcion}
                    usuarios={proyecto.usuarios || []}
                    tareas={proyecto.tareas || []}
                    userId={userId}
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
              <div className="contenedor-proyectos">
                {sinCategoria.map((proyecto) => (
                  <ContenedorProyecto
                    key={proyecto.id}
                    id={proyecto.id}
                    titulo={proyecto.titulo}
                    fecha_entrega={proyecto.fecha_entrega}
                    descripcion={proyecto.descripcion}
                    usuarios={proyecto.usuarios || []}
                    tareas={proyecto.tareas || []}
                    userId={userId}
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

export default PaginaProyectos;
