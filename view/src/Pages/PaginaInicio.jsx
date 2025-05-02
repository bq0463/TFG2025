import RegisterForm from "../Components/Forms/RegisterForm.jsx";
import LoginForm from "../Components/Forms/LoginForm.jsx";
import './inicio.css';
import { useEffect } from "react";
const PaginaInicio = () => {
  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("http://localhost:5000/logout", {
          method: "POST",
          credentials: "include"
        });
      } catch (error) {
        console.error("Error al cerrar sesión automáticamente", error);
      }
    };

    logout();
  }, []);
  return (
    <div className='PaginaInicio'>
      <header className='header'>
        <div className='header-top'>Gestor personal</div>
      </header>
      <div className='formContainer'>
        <RegisterForm />
        <LoginForm />
      </div>
      <footer>
        <div className='footer'>TFG 2025</div>
      </footer>
    </div>
  );
};

export default PaginaInicio;
