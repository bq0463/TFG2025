
import ReactDOM from 'react-dom/client'
//import { ButtonAdd,ButtonDelete,ButtonUpdate } from './components/CRUD_operations/botones_CRUD.jsx';
import RegisterForm from "./Components/Forms/RegisterForm.jsx";
import LoginForm from "./Components/Forms/LoginForm.jsx";
import './inicio.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    {/* <ButtonAdd text="añadir tarea"></ButtonAdd>
    <ButtonDelete text="eliminar tarea"></ButtonDelete>
    <ButtonUpdate text="actualizar tarea"></ButtonUpdate> */
    <>
      <body>
        <header className='header'>
          <div className='header-top'>
            Gestor personal
          </div>
        </header>
        <div className='formContainer'>
          <RegisterForm/>
          <LoginForm/>
        </div>
        <footer>
          <div className='footer'>
            TFG 2025
          </div>
        </footer>
        </body>
    </>
    }
  </>
)
