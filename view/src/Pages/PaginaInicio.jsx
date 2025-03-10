import RegisterForm from "../components/Forms/RegisterForm.jsx";
import LoginForm from "../components/Forms/LoginForm.jsx";
import { Link } from "react-router-dom";
import './inicio.css';

const PaginaInicio = () => {
  return (
    <div className='PaginaInicio'>
      <header className='header'>
        <div className='header-top'>Gestor personal</div>
      </header>
      <div className='formContainer'>
        <RegisterForm />
        <LoginForm />
      </div>
      <div className='link-container'>
        <Link to="/logueado">Ir a página logueado</Link>
      </div>
      <footer>
        <div className='footer'>TFG 2025</div>
      </footer>
    </div>
  );
};

export default PaginaInicio;
