
import "./contenedorExamen.css";

const ContenedorExamen = ({ asignatura, fecha, nota }) => {
  return (
    <div className="contenedor-examen">
      <h2>{asignatura}</h2>
      <p className="fecha">Fecha: {fecha}</p>
      <p className="nota">{nota}</p>
    </div>
  );
};

export default ContenedorExamen;
