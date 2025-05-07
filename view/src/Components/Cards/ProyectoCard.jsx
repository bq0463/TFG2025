import { format } from "date-fns";

const ProyectoCard = ({ event }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy");
  }
  return (
  <div className="event-details">
    <p><strong>Título:</strong> {event.titulo}</p>
    <p><strong>Fecha de Entrega:</strong> {formatDate(event.fecha_entrega)}</p>
    <p><strong>Descripción:</strong> {event.descripcion}</p>
    <p><strong>Usuarios:</strong> {Array.isArray(event.usuarios) ? event.usuarios.join(", ") : event.usuarios}</p>
    <p><strong>Tareas:</strong> { Array.isArray(event.tareas)
    ? event.tareas.map(t => `${t.descripcion}`).join(", ")
    : "Sin tareas"}</p>
  </div>
  );
}
export default ProyectoCard;
