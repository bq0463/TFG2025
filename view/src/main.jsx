import { createRoot } from 'react-dom/client'
//import { ButtonAdd,ButtonDelete,ButtonUpdate } from './components/CRUD_operations/botones_CRUD.jsx';
import RegisterForm from "./Components/Forms/RegisterForm.jsx";
import LoginForm from "./Components/Forms/LoginForm.jsx";
import './inicio.css';

createRoot(document.getElementById('root')).render(
  <>
    {/* <ButtonAdd text="añadir tarea"></ButtonAdd>
    <ButtonDelete text="eliminar tarea"></ButtonDelete>
    <ButtonUpdate text="actualizar tarea"></ButtonUpdate> */
    <div className='formContainer'>
      <RegisterForm/>
      <LoginForm/>
    </div>
    }
  </>
)
