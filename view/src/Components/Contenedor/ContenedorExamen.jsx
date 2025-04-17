import { useState } from "react";
import "./contenedorExamen.css";

const ContenedorExamen = ({ id, asignatura, fecha, nota }) => {
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [nuevaAsignatura, setNuevaAsignatura] = useState(asignatura);
  const [nuevaFecha, setNuevaFecha] = useState(fecha);
  const [nuevaNota, setNuevaNota] = useState(nota);
  
  const handleModificar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/examenes/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asignatura: nuevaAsignatura,
          fecha: nuevaFecha,
          nota: parseFloat(nuevaNota),
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al modificar examen");
      }
    } catch (error) {
      console.error("Error al modificar examen", error);
    }
  };

  const handleEliminar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/examenes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al eliminar examen");
      }
    } catch (error) {
      console.error("Error al eliminar examen", error);
    }
  };

  return (
    <div className="contenedor-examen">
      <h2>{asignatura}</h2>
      <p className="fecha">{fecha}</p>
      {nota && parseFloat(nota) !== 0 && (<p className="nota">{nota}</p>)}
      <div className="gestion-examen">
        <button 
          className="modificar-examen" 
          onClick={() => {
            setEditando(!editando);
            setEliminando(false);
          }}
        >
          {editando ? "Cancelar" : "Modificar"}
        </button>
        {!editando && ( 
        <button 
          className="eliminar-examen" 
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
            value={nuevaAsignatura}
            onChange={(e) => setNuevaAsignatura(e.target.value)}
            placeholder="Asignatura"
          />
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
          />
          <input
            type="number"
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            step="0.1"
          />
          <button onClick={handleModificar}>Guardar</button>
        </div>
      )}
      {eliminando && (
        <div className="formulario-eliminar">
          <p>¿Estás seguro de que quieres eliminar este examen?</p>
          <button onClick={handleEliminar}>Confirmar</button>
          <button onClick={() => setEliminando(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ContenedorExamen;
