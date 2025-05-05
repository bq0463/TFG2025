
import { format } from "date-fns";

const TareaCard = ({ event }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="event-details">
      <p><strong>Descripción:</strong> {event.descripcion}</p>
      {event.valor !== 0 && (
        <p><strong>Valor:</strong> {event.valor}</p>
      )}
      {event.fecha_inicio && (
        <p><strong>Fecha Inicio:</strong> {formatDate(event.fecha_inicio)}</p>
      )}
      <p><strong>Fecha Fin:</strong> {formatDate(event.fecha_fin)}</p>
      <p><strong>Estado:</strong> {event.estado}</p>
    </div>
  );
};

export default TareaCard;
