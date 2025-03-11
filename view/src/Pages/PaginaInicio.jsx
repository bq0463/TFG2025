import RegisterForm from "../components/Forms/RegisterForm.jsx";
import LoginForm from "../components/Forms/LoginForm.jsx";
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
      <footer>
        <div className='footer'>TFG 2025</div>
      </footer>
    </div>
  );
};

export default PaginaInicio;
