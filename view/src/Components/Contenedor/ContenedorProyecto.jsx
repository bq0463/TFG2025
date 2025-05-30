import { useState } from "react";
import "./ContenedorProyecto.css";
import AlertaPersonalizada from "../AlertaPersonalizada/AlertaPersonalizada.jsx";

const ContenedorProyecto = ({ id, titulo, fecha_entrega, descripcion, usuarios, tareas, userId }) => {
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(titulo);
  const [nuevaFecha, setNuevaFecha] = useState(fecha_entrega);
  const [nuevaDescripcion, setNuevaDescripcion] = useState(descripcion);

  const [usuarioAsociado, setUsuarioAsociado] = useState("");
  const [mostrarFormularioAsociar, setMostrarFormularioAsociar] = useState(false);

  const [TPDescripcion, setTPDescripcion] = useState("");
  const [TPFechaInicio, setTPFechaInicio] = useState("");
  const [TPFechaFin, setTPFechaFin] = useState("");
  const [TPEstado, setTPEstado] = useState("");
  const [TPValor, setTPValor] = useState("");
  const [mostrarFormularioTarea, setMostrarFormularioTarea] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const ajustarFechaLocal = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    const offset = fecha.getTimezoneOffset();
    const fechaLocal = new Date(fecha.getTime() - offset * 60 * 1000);
    return fechaLocal.toISOString().split("T")[0];
  };

  const handleModificar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/proyectos/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: nuevoTitulo,
          fecha_entrega: nuevaFecha,
          descripcion: nuevaDescripcion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Proyecto modificado con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        setMessage(data.message || "Error al modificar");
        setMessageType("error"); 
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al modificar proyecto", error);
    }
  };

  const handleDesasociar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/proyectos/${id}/usuario/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMessage("✅ Proyecto desasociado con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        console.error("Error al desasociar proyecto");
      }
    } catch (error) {
      console.error("Error al desasociar proyecto", error);
    }
  };

  const handleAsociar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/proyectos/asociar/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_usuario: usuarioAsociado }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Usuario asociado con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        setMessage(data.message || "Error al asociar");
        setMessageType("error"); 
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al asociar usuario", error);
    }
  };

  const handleCrearTareaProyecto = async () => {
    try {

      if (!TPDescripcion || !TPFechaFin) {
        setCreationMessage("Faltan campos obligatorios como fecha de fin o descripción");
        return;
      }

      if (TPFechaInicio && TPFechaInicio > TPFechaFin) {
        setCreationMessage("La fecha de inicio no puede ser mayor que la fecha de fin");
        return;
      }

      const fechaEntrega = new Date(fecha_entrega);
      fechaEntrega.setDate(fechaEntrega.getDate() + 1);
      
      if(TPFechaFin > fechaEntrega) {
        setCreationMessage("La fecha fin de la meta no puede ser mayor que la fecha de entrega del proyecto");
        return;
      }

      let fechaFormateadaInicio = null;
      
      if (
        TPFechaInicio !== null &&
        TPFechaInicio !== undefined &&
        TPFechaInicio !== ""
      ) {
        const fecha = new Date(TPFechaInicio);
        if (!isNaN(fecha.getTime())) {
          fechaFormateadaInicio = fecha.toISOString().split("T")[0];
        }
      }

  
      const fechaFormateadaFin = new Date(TPFechaFin).toISOString().split("T")[0];
  
      const valorNumerico = TPValor !== "" ? parseFloat(TPValor) : 0;

      const response = await fetch(`http://localhost:5000/proyectos/tarea/${id}/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: TPDescripcion,
          fecha_inicio: fechaFormateadaInicio,
          fecha_fin: fechaFormateadaFin,
          estado: TPEstado,
          valor: valorNumerico,
          tipo: 'meta',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCreationMessage("✅ Meta creada con éxito en el proyecto");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        setMessage(data.message || "Error al crear la meta");
        setMessageType("error"); 
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al crear tarea", error);
    }
  };

  const handleEliminarTarea = async (idTarea) => {
    try {
      const response = await fetch(`http://localhost:5000/tareas/${idTarea}`, {
        method: "DELETE",
        credentials: "include"
      });
  
      if (response.ok) {
        setMessage("✅ Meta eliminada del proyecto con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error al eliminar Meta del proyecto");
      }
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };

  return (
    <div className="contenedor-proyecto">
      <h2>{titulo}</h2>
      <p className="fecha">{ajustarFechaLocal(fecha_entrega)}</p>
      <p className="nota">{descripcion}</p>

      <div className="usuarios-asociados">
        <h3>Usuarios</h3>
        {usuarios && usuarios.length > 0 && (
          <div className="usuarios-asociados-linea">
            {usuarios.map((usuario, i) => (
              <span key={i}>
                {usuario}{i < usuarios.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>


      {tareas && tareas.length > 0 && (
        <div className="tareas-asociadas">
          <h3>Metas</h3>
          <ul>
            {tareas.map((tarea, i) => (
              <li key={i}>
                <span>
                  {tarea.descripcion}
                  {parseInt(tarea.id_usuario) === parseInt(userId) && (
                    <button
                      className="btn-eliminar-tarea"
                      onClick={() => handleEliminarTarea(tarea.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {message && showAlert && <AlertaPersonalizada message={message} type={messageType} />}
      <div className="botones-acciones">
        <button onClick={() => setMostrarFormularioAsociar(!mostrarFormularioAsociar)}>
          {mostrarFormularioAsociar ? "Cancelar" : "Asociar usuario"}
        </button>
        {mostrarFormularioAsociar && (
          <div className="formulario-asociar">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={usuarioAsociado}
              onChange={(e) => setUsuarioAsociado(e.target.value)}
            />
            <button onClick={handleAsociar}>Asociar usuario</button>
          </div>
        )}
        <button onClick={() => setMostrarFormularioTarea(!mostrarFormularioTarea)}>
          {mostrarFormularioTarea ? "Cancelar meta" : "Agregar meta"}
        </button>
        {mostrarFormularioTarea && (
          <div className="formulario-tarea">
            <input
              type="text"
              placeholder="Descripción"
              value={TPDescripcion}
              onChange={(e) => setTPDescripcion(e.target.value)} required
            />
            <input
              type="date"
              value={TPFechaInicio}
              placeholder="Fecha de inicio"
              onChange={(e) => setTPFechaInicio(e.target.value)}
            />
            <input
              type="date"
              value={TPFechaFin}
              onChange={(e) => setTPFechaFin(e.target.value)} required
              placeholder="Fecha de fin"
            />
            <select 
            value={TPEstado} 
            onChange={(e) => setTPEstado(e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
            </select>
            <input
              type="number"
              placeholder="Valor"
              value={TPValor}
              onChange={(e) => setTPValor(e.target.value)}
            />
            <button onClick={handleCrearTareaProyecto}>Crear Meta</button>
            {creationMessage && (<span className="mensaje-error">{creationMessage}</span>)}
          </div>
        )}
      </div>

      <div className="gestion-proyecto">
        <button 
          className="modificar-proyecto" 
          onClick={() => {
            setEditando(!editando);
            setEliminando(false);
          }}
        >
          {editando ? "Cancelar" : "Modificar proyecto"}
        </button>
        {!editando && (
          <button 
            className="eliminar-proyecto" 
            onClick={() => setEliminando(!eliminando)}
          >
            {eliminando ? "Cancelar" : "Desasociar proyecto"}
          </button>
        )}
      </div>

      {editando && (
        <div className="formulario-modificar">
          <input
            type="text"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            placeholder="Título"
            required
          />
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            required
          />
          <textarea
            rows="4"
            cols="50"
            type="text"
            maxLength="200"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            placeholder="Descripción"
          />
          <button onClick={handleModificar}>Guardar</button>
        </div>
      )}

      {eliminando && (
        <div className="formulario-eliminar">
          <p>¿Estás seguro de que quieres desasociarte de este proyecto?</p>
          <button onClick={handleDesasociar}>Confirmar</button>
          <button onClick={() => setEliminando(false)}>Cancelar</button>
        </div>
      )}      
    </div>

  );
};

export default ContenedorProyecto;
