import { useState } from "react";
import "./ContenedorProyecto.css";

const ContenedorProyecto = ({ id, titulo, fecha_entrega, descripcion,usuarios,tareas }) => {
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(titulo);
  const [nuevaFecha, setNuevaFecha] = useState(fecha_entrega);
  const [nuevaDescripcion, setNuevaDescripcion] = useState(descripcion);
  
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
      const response = await fetch(`http://localhost:5000/proyectos/${id}`, {
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

  return (
    <div className="contenedor-proyecto">
      <h2>{titulo}</h2>
      <p className="fecha">{fecha_entrega}</p>
      <p className="nota">{descripcion}</p>
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
            {eliminando ? "Cancelar" : "Eliminar"}
          </button>
      )}
      </div>
      {editando && (
        <div className="formulario-modificar">
          <input
            type="text"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            placeholder="titulo"
          />
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
          />
          <input
            type="text"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            placeholder="Descripción"
          />
          <button onClick={handleModificar}>Guardar</button>
        </div>
      )}

      {eliminando && (
        <div className="formulario-eliminar">
          <p>¿Estás seguro de que quieres desasociarte este proyecto?</p>
          <button onClick={handleDesasociar}>Confirmar</button>
          <button onClick={() => setEliminando(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ContenedorProyecto;
