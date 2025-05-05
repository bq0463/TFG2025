import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./PaginaLogueado.css";
import esLocale from 'date-fns/locale/es';
import MetaCard from "../Components/Cards/MetaCard";
import TareaCard from "../Components/Cards/TareaCard";
import ProyectoCard from "../Components/Cards/ProyectoCard";
import ExamenCard from "../Components/Cards/ExamenCard";
import { set } from "date-fns";

const PaginaLogueado = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [metas, setMetas] = useState([]);
  const locales = {
    es: esLocale,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: esLocale }),
    getDay,
    locales,
  });
  const [fechaActual, setFechaActual] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [totalPuntos, setTotalPuntos] = useState(0);
  
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
      
      const getMetas = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/metas`, {
            method: "GET",
            credentials: "include",
          });
      
          const data = await response.json();
          setMetas(data);
          const puntos = data.reduce((total, meta) => total + parseFloat(meta.valor || 0), 0);
          setTotalPuntos(puntos);
        } catch (error) {
          console.error("Error al obtener metas", error);
        }
      };

      const getProyectos = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/proyectos`, {
            method: "GET",
            credentials: "include",
          });

          const data = await response.json();
          setProyectos(data);
        }
        catch (error) {
          console.error("Error al obtener proyectos", error);
        }
      };

      const getExamenes = async () => {
        try {
          const response = await fetch(`http://localhost:5000/usuarios/${userId}/examenes`, {
            method: "GET",
            credentials: "include",
          });

          const data = await response.json();
          setExamenes(data);
        }
        catch (error) {
          console.error("Error al obtener examenes", error);
        }
      };

      getTareas();
      getProyectos();
      getExamenes();
      getMetas();
    }
  }, [userId]);


  const eventos = [
    ...tareas.map(t => ({
      title: `Tarea: ${t.descripcion}`,
      start: new Date(t.fecha_inicio || t.fecha_fin),
      end: new Date(t.fecha_fin),
      allDay: true,
      type: 'tarea',
      data: t,
    })),
    ...metas.map(m => ({
      title: `Meta: ${m.descripcion}`,
      start: new Date(m.fecha_inicio || m.fecha_fin),
      end: new Date(m.fecha_fin),
      allDay: true,
      type: 'meta',
      data: m,
    })),
    ...proyectos.map(p => ({
      title: `Proyecto: ${p.titulo}`,
      start: new Date(p.fecha_entrega),
      end: new Date(p.fecha_entrega),
      allDay: true,
      type: 'proyecto',
      data: p,
    })),
    ...examenes.map(e => ({
      title: `Examen: ${e.asignatura}`,
      start: new Date(e.fecha),
      end: new Date(e.fecha),
      allDay: true,
      type: 'examen',
      data: e,
    })),
  ];
  

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

  const handleExams = async () => {
    try {
      navigate("/examenes");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const handleIntro = async () => {
    try {
      navigate("/inicio");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const handleProfile = async () => {
    try {
      navigate("/perfil");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }

  const handleTasks = async () => {
    try {
      navigate("/tareas");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }

  const handleProjects = async () => {
    try {
      navigate("/proyectos");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }

  const eventosNoCaducados = eventos.filter(evento => evento.end >= new Date());

  return (
    <div className="PaginaLogueado">
      <header className="header">
        <div className="header-bottom">
          <nav>
            <button onClick={handleIntro} className="nav-b">Inicio</button>
            <button onClick={handleTasks} className="nav-b">Tareas/Metas</button>
            <button onClick={handleProjects} className="nav-b">Proyectos</button>
            <button onClick={handleExams} className="nav-b">Examenes</button>
            <button onClick={handleLogout} className="nav-b">Cerrar sesión</button>
            <button onClick={handleProfile} className="username">{username}</button>
          </nav>
        </div>
      </header>
      <div className="header-top">
        <h1>Tus Eventos</h1>
        <h2 className="totalPuntos">Puntos de Metas: {totalPuntos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>

      </div>
      <div className="content">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={eventos}
            onSelectEvent={event => setSelectedEvent(event)}
            startAccessor="start"
            endAccessor="end"
            date={fechaActual}
            style={{  width:'200vh' }}
            views={['month']}
            culture="es"
            onNavigate={(date) => setFechaActual(date)}
            messages={{
              allDay: 'Todo el día',
              previous: 'Anterior',
              next: 'Siguiente',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango.',
            }}
            formats={{
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'EEEE', culture), 
              weekdayFormat: (date, culture, localizer) =>
                localizer.format(date, 'EEEE', culture), 
              monthHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, "MMMM yyyy", culture),
            }}
            eventPropGetter={(event) => {
              let className = "";
              if (event.type === "tarea") {
                className = "calendar-task-event";
              } else if (event.type === "proyecto") {
                className = "calendar-project-event";
              } else if (event.type === "examen") {
                className = "calendar-exam-event";
              } else if (event.type === "meta") {
                className = "calendar-goal-event";
              }
              return { className };
            }}
          />
        </div>
        
        {selectedEvent && (
          <div className="event-card-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="event-card" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedEvent.title}</h3>
              {selectedEvent.type === "tarea" && <TareaCard event={selectedEvent.data} />}
              {selectedEvent.type === "proyecto" && <ProyectoCard event={selectedEvent.data} />}
              {selectedEvent.type === "examen" && <ExamenCard event={selectedEvent.data} />}
              {selectedEvent.type === "meta" && <MetaCard event={selectedEvent.data} />}
              <button onClick={() => setSelectedEvent(null)}>Cerrar</button>
            </div>
          </div>
        )}
        
        <div className="eventos-proximos">
          <h3>Próximos eventos</h3>
          <hr />
          {eventosNoCaducados.length > 0 ? (
            eventosNoCaducados.map((evento, index) => (
              <div key={index} className="event-item">
                <h4>{evento.title}</h4>
                <p>{`Fecha: ${format(evento.end, 'dd/MM/yyyy')}`}</p>
              </div>
            ))
          ) : (
            <p>No hay eventos próximos.</p>
          )}
        </div>
      </div>
    </div>
  );  
};

export default PaginaLogueado;
