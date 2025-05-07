import { useState } from "react";
import "./contenedorTarea.css";
import AlertaPersonalizada from "../AlertaPersonalizada/AlertaPersonalizada.jsx";

const ContenedorTarea = ({ id, descripcion, valor, fecha_inicio, fecha_fin, estado,tipo }) => {
  const ajustarFechaLocal = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    const offset = fecha.getTimezoneOffset();
    const fechaLocal = new Date(fecha.getTime() - offset * 60 * 1000);
    return fechaLocal.toISOString().split("T")[0];
  };
  const [message, setMessage] = useState("");
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState(descripcion);
  const [nuevoValor, setNuevoValor] = useState(valor);
  const [nuevaFechaInicio, setNuevaFechaInicio] = useState(ajustarFechaLocal(fecha_inicio));
  const [nuevaFechaFin, setNuevaFechaFin] = useState(ajustarFechaLocal(fecha_fin));
  const [nuevoEstado, setNuevoEstado] = useState(estado);
  const [showAlert, setShowAlert] = useState(false);

  const handleModificar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tareas/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: nuevaDescripcion,
          valor: parseFloat(nuevoValor),
          fecha_inicio: nuevaFechaInicio,
          fecha_fin: nuevaFechaFin,
          estado: nuevoEstado,
          tipo: tipo,
        }),
      });

      if (response.ok) {
        setMessage("✅ Tarea/Meta modificada con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        console.error("Error al modificar tarea");
      }
    } catch (error) {
      console.error("Error al modificar tarea", error);
    }
  };

  const handleEliminar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tareas/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMessage("✅ Tarea/Meta eliminada con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
          window.location.reload();
        }
        , 1000);
      } else {
        console.error("Error al eliminar tarea/meta");
      }
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };

  return (
    <div className="contenedor-tarea" data-estado={estado.toLowerCase().replace(/\s/g, "-")}>
      <h2>{descripcion}</h2>
      {valor && parseFloat(valor) !== 0 && (
      <p className="valor">{tipo === "meta" ? "Nota" : "Valor"}: {valor}</p>
      )}
      {nuevaFechaInicio && nuevaFechaInicio !== "1970-01-01" && (
        <p className="fecha">Inicio: {nuevaFechaInicio}</p>
      )}
      <p className="fecha">Límite: {nuevaFechaFin}</p>
      <p className="estado">{estado}</p>

      <div className="gestion-tarea">
        <button 
          className="modificar-tarea" 
          onClick={() => {
            setEditando(!editando);
            setEliminando(false);
          }}
        >
          {editando ? "Cancelar" : "Modificar"}
        </button>
        {!editando && (
          <button 
            className="eliminar-tarea" 
            onClick={() => setEliminando(!eliminando)}
          >
            {eliminando ? "Cancelar" : "Eliminar"}
          </button>
        )}
      </div>

      {editando && (
        <div className="formulario-modificar">
          <input
            type="text"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            placeholder="Descripción"
          />
          <input
            type="number"
            value={nuevoValor}
            onChange={(e) => setNuevoValor(e.target.value)}
            step="0.1"
            placeholder="Valor"
          />
          <input
            type="date"
            value={nuevaFechaInicio}
            onChange={(e) => setNuevaFechaInicio(e.target.value)}
          />
          <input
            type="date"
            value={nuevaFechaFin}
            onChange={(e) => setNuevaFechaFin(e.target.value)}
          />
          <select 
            value={nuevoEstado} 
            onChange={(e) => setNuevoEstado(e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
          <button onClick={handleModificar}>Guardar</button>
          {message && showAlert && <AlertaPersonalizada message={message} type="success" />}
        </div>
      )}

      {eliminando && (
        <div className="formulario-eliminar">
          <p>¿Estás seguro de que quieres eliminar esta tarea?</p>
          <button onClick={handleEliminar}>Confirmar</button>
          <button onClick={() => setEliminando(false)}>Cancelar</button>
          {message && showAlert && <AlertaPersonalizada message={message} type="success" />}
        </div>
      )}
    </div>
  );
};

export default ContenedorTarea;
