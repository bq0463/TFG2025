
import { format, formatDate } from "date-fns";

const ExamenCard = ({ event }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="event-details">
      <p><strong>Asignatura:</strong> {event.asignatura}</p>
      <p><strong>Fecha:</strong> {formatDate(event.fecha)}</p>
      <p><strong>Nota:</strong> {event.nota}</p>
    </div>
  );

}
export default ExamenCard;
