import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaTareas.css";
import ContenedorTarea from "../Components/Contenedor/ContenedorTarea.jsx";
import AlertaPersonalizada from "../Components/AlertaPersonalizada/AlertaPersonalizada.jsx";

const PaginaTareas = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [tareas, setTareas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [metas, setMetas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    descripcion: "",
    valor: 0,
    fecha_inicio: "",
    fecha_fin: "",
    estado: "Pendiente",
    tipo: "tarea",
  });
  const navigate = useNavigate();
  const [creationMessage, setCreationMessage] = useState("");
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    Pendiente: false,
    "En progreso": false,
    Completada: false,
  });

  const agruparPorEstado = (tareas) => {
    return tareas.reduce((grupo, tarea) => {
      const estado = tarea.estado || "Otros";
      if (!grupo[estado]) grupo[estado] = [];
      grupo[estado].push(tarea);
      return grupo;
    }, {});
  };

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
      const getTareas = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/tareas`, {
            method: "GET",
            credentials: "include",
          });

          const data = await response.json();
          setTareas(data);
        } catch (error) {
          console.error("Error al obtener tareas", error);
        }
      };

      getTareas();

      const getMetas = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/metas`, {
            method: "GET",
            credentials: "include",
          });
      
          const data = await response.json();
          setMetas(data);
        } catch (error) {
          console.error("Error al obtener metas", error);
        }
      };
      
      getMetas();
      
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
    setNuevaTarea({ ...nuevaTarea, [name]: value });
  };

  const handleGuardarTarea = async () => {
    try {
      if (!nuevaTarea.descripcion || !nuevaTarea.fecha_fin) {
        setCreationMessage("Faltan campos obligatorios como fecha fin o descripción");
        return;
      }
  
      const fechaInicioValida = nuevaTarea.fecha_inicio && nuevaTarea.fecha_inicio.trim() !== "";
  
      if (fechaInicioValida && nuevaTarea.fecha_inicio > nuevaTarea.fecha_fin) {
        setCreationMessage("La fecha de inicio no puede ser mayor que la fecha de fin");
        return;
      }
  
      let fechaFormateadaInicio = null;
      
      if (
        nuevaTarea.fecha_inicio !== null &&
        nuevaTarea.fecha_inicio !== undefined &&
        nuevaTarea.fecha_inicio !== ""
      ) {
        const fecha = new Date(nuevaTarea.fecha_inicio);
        if (!isNaN(fecha.getTime())) {
          fechaFormateadaInicio = fecha.toISOString().split("T")[0];
        }
      }

  
      const fechaFormateadaFin = new Date(nuevaTarea.fecha_fin).toISOString().split("T")[0];
  
      const valorNumerico = nuevaTarea.valor !== "" ? parseFloat(nuevaTarea.valor) : 0;
  
      const response = await fetch(`http://localhost:5000/tareas/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor: valorNumerico,
          fecha_inicio: fechaFormateadaInicio,
          fecha_fin: fechaFormateadaFin,
          estado: nuevaTarea.estado,
          descripcion: nuevaTarea.descripcion,
          tipo: nuevaTarea.tipo,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("✅ Tarea/Meta creada con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          window.location.reload();
        }
        , 1000);
      } else {
        setCreationMessage(data.message || "Error al crear tarea/meta");
      }
    } catch (error) {
      console.error("Error al crear tarea", error);
    }
  };
  

  const toggleSeccion = (estado) => {
    setSeccionesExpandidas({
      ...seccionesExpandidas,
      [estado]: !seccionesExpandidas[estado],
    });
  };

  const renderSeccionPorTipo = (lista, tipo) => {
    const agrupadas = agruparPorEstado(lista);
    return Object.keys(agrupadas).map((estado) => (
      <div key={`${tipo}-${estado}`} className="seccion-tareas">
        <button onClick={() => toggleSeccion(`${tipo}-${estado}`)} id="seccion-titulo">
          <span className={`icono ${seccionesExpandidas[`${tipo}-${estado}`] ? 'expandido' : ''}`}>
            {seccionesExpandidas[`${tipo}-${estado}`] ? "▼" : "►"}
          </span>
          {estado} ({agrupadas[estado].length})
        </button>
        {seccionesExpandidas[`${tipo}-${estado}`] && (
          <div className="contenedor-tareas">
            {agrupadas[estado].map((tarea) => (
              <ContenedorTarea
                key={tarea.id}
                id={tarea.id}
                descripcion={tarea.descripcion}
                valor={tarea.valor}
                fecha_inicio={tarea.fecha_inicio}
                fecha_fin={tarea.fecha_fin}
                estado={tarea.estado}
              />
            ))}
          </div>
        )}
      </div>
    ));
  };
  

  return (
    <div className="PaginaTareas">
      <header className="header">
        <nav>
          <button onClick={() => navigate("/inicio")} className="nav-b">Inicio</button>
          <button onClick={() => navigate("/examenes")} className="nav-b">Examenes</button>
          <button onClick={() => navigate("/proyectos")} className="nav-b">Proyectos</button>
          <button onClick={handleLogout} className="nav-b">Cerrar sesión</button>
          <button onClick={() => navigate("/perfil")} className="username">{username}</button>
        </nav>
      </header>

      <div className="tareas">
        <h1>Tus Objetivos</h1>
        <button onClick={toggleFormulario} className="nav-b">{mostrarFormulario ? "Cerrar Formulario" : "Crear Tarea/Meta"}</button>
        
        {mostrarFormulario && (
          <div className="formulario-tarea">
            <input type="text" name="descripcion" placeholder="Descripción" value={nuevaTarea.descripcion} onChange={handleInputChange}  />
            <input type="number" name="valor" placeholder="Valor" value={nuevaTarea.valor} onChange={handleInputChange}  />
            <input type="date" name="fecha_inicio" value={nuevaTarea.fecha_inicio} onChange={handleInputChange}  />
            <input type="date" name="fecha_fin" value={nuevaTarea.fecha_fin} onChange={handleInputChange}  />
            <select className="estado" name="estado" value={nuevaTarea.estado} onChange={handleInputChange}>
              <option value="Pendiente" >Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
            </select>
            <select className="tipo" name="tipo" value={nuevaTarea.tipo} onChange={handleInputChange}>
              <option value="tarea">Tarea</option>
              <option value="meta">Meta</option>
            </select>
            <div className="mensaje-con-boton">
              <button onClick={handleGuardarTarea} className="nav-b">Guardar Tarea/Meta</button>
              {creationMessage && <span className="creation-message">{creationMessage}</span>}
              {message && showAlert && <AlertaPersonalizada message={message} type="success" />}
            </div>
          </div>
        )}
        
        <h1>Tareas</h1>
        {renderSeccionPorTipo(tareas, "tarea")}

        <h1>Metas</h1>
        {renderSeccionPorTipo(metas, "meta")}
      </div>
    </div>
  );
};

export default PaginaTareas;
