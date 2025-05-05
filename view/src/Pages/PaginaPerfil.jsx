import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePasswordForm from "../Components/Forms/ProfilePasswordForm";
import "./PaginaPerfil.css";
import ProfileEmailUsernameForm from "../Components/Forms/ProfileEmailUsernameForm";
import ProfileDeleteForm from "../Components/Forms/ProfileDeleteForm";
import AdminPromoteForm from "../Components/Forms/AdminPromoteForm.jsx";
import AdminDeleteForm from "../Components/Forms/AdminDeleteForm.jsx";

const PaginaPerfil = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [rol, setUserRol] = useState("");

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
        setUserRol(data.rol);
      } catch (error) {
        navigate("/");
      }
    };

    verificarAutenticacion();
  }, [navigate]);

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
      <div className="profileContent">
        <h1>Ajustes de perfil</h1>
          <ProfilePasswordForm userId={userId}/>
          <ProfileEmailUsernameForm userId={userId}/>
          <ProfileDeleteForm userId={userId}></ProfileDeleteForm>
          {rol === "Admin" && <AdminDeleteForm/>}
          {rol === "Admin" && <AdminPromoteForm/>}
      </div>
    </div>
  );  
};

export default PaginaPerfil;
