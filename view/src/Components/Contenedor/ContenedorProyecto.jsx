import { useState } from "react";
import "./ContenedorProyecto.css";

const ContenedorProyecto = ({ id, titulo, fecha_entrega, descripcion, usuarios, tareas, userId }) => {
  
  const listaUsuarios = typeof usuarios === "string"
  ? usuarios.split(",").map(u => u.trim()).filter(Boolean)
  : [];

  const listaTareas = typeof tareas === "string"
  ? tareas.split(",").map(t => t.trim()).filter(Boolean)
  : [];

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

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al modificar proyecto");
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
        window.location.reload();
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

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al asociar usuario o no existe");
      }
    } catch (error) {
      console.error("Error al asociar usuario", error);
    }
  };

  const handleCrearTareaProyecto = async () => {
    try {
      const response = await fetch(`http://localhost:5000/proyectos/tarea/${id}/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: TPDescripcion,
          fecha_inicio: TPFechaInicio,
          fecha_fin: TPFechaFin,
          estado: TPEstado,
          valor: TPValor,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al crear tarea");
      }
    } catch (error) {
      console.error("Error al crear tarea", error);
    }
  };

  return (
    <div className="contenedor-proyecto">
      <h2>{titulo}</h2>
      <p className="fecha">{fecha_entrega}</p>
      <p className="nota">{descripcion}</p>

      <div className="usuarios-asociados">
        <h3>Usuarios</h3>
        <p>{(listaUsuarios || []).join(', ')}</p>
      </div>

      <div className="tareas-asociadas">
        <h3>Tareas</h3>
        <ul>
          {(listaTareas || []).map((tarea, i) => (
            <li key={i}>
              <strong>{tarea}</strong>
            </li>
          ))}
        </ul>
      </div>

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
            <button onClick={handleAsociar}>Asociar</button>
          </div>
        )}

        <button onClick={() => setMostrarFormularioTarea(!mostrarFormularioTarea)}>
          {mostrarFormularioTarea ? "Cancelar tarea" : "Agregar tarea"}
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
            <button onClick={handleCrearTareaProyecto}>Crear tarea</button>
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
          {editando ? "Cancelar" : "Modificar"}
        </button>
        {!editando && (
          <button 
            className="eliminar-proyecto" 
            onClick={() => setEliminando(!eliminando)}
          >
            {eliminando ? "Cancelar" : "Desasociar"}
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
          />
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
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
