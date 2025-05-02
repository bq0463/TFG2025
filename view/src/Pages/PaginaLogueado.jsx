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

const PaginaLogueado = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [examenes, setExamenes] = useState([]);
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

  useEffect(() => {
    console.log("Llamando a /me");
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
    }
  }, [userId]);


  const eventos = [
    ...tareas.map(t => ({
      title: `Tarea: ${t.descripcion}`,
      start: new Date(t.fecha_inicio || t.fecha_fin),
      end: new Date(t.fecha_fin),
      allDay: true,
      type: 'task',
    })),
    ...proyectos.map(p => ({
      title: `Proyecto: ${p.titulo}`,
      start: new Date(p.fecha_entrega),
      end: new Date(p.fecha_entrega),
      allDay: true,
      type: 'project',
    })),
    ...examenes.map(e => ({
      title: `Examen: ${e.asignatura}`,
      start: new Date(e.fecha),
      end: new Date(e.fecha),
      allDay: true,
      type: 'exam',
    })),
  ];
  console.log(eventos);
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
            <button onClick={handleTasks} className="nav-b">Tareas</button>
            <button onClick={handleProjects} className="nav-b">Proyectos</button>
            <button onClick={handleExams} className="nav-b">Examenes</button>
            <button onClick={handleLogout} className="nav-b">Cerrar sesión</button>
            <button onClick={handleProfile} className="username">{username}</button>
          </nav>
        </div>
      </header>
      <div className="header-top">
        <h1>Tus Eventos</h1>
      </div>
      <div className="content">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={eventos}
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
              if (event.type === "task") {
                className = "calendar-task-event";
              } else if (event.type === "project") {
                className = "calendar-project-event";
              } else if (event.type === "exam") {
                className = "calendar-exam-event";
              }
              return { className };
            }}
          />
        </div>
        <div className="eventos-proximos">
          <h3>Próximos eventos</h3>
          <hr />
          {eventosNoCaducados.length > 0 ? (
            eventosNoCaducados.map((evento, index) => (
              <div key={index} className="event-item">
                <h4>{evento.title}</h4>
                <p>{`Fecha: ${format(evento.start, 'dd/MM/yyyy')}`}</p>
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
