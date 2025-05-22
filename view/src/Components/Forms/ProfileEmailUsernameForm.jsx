import './forms.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertaPersonalizada from "../AlertaPersonalizada/AlertaPersonalizada.jsx";

const ProfileEmailUsernameForm = ({userId}) => {
  const [email,setEmailForm]= useState("");
  const [username,setUsernameForm]= useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [messageType,setMessageType]= useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmailForm(value);
    if (name === "username") setUsernameForm(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre_usuario: username,
          email: email
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Cambio de email y/o usuario exitoso`);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
        }, 1000);
      } else {
        setMessage(data.message || "Error al modificar usuario");
        setMessageType("error"); 
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      setMessage("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="retro-container-EU">
      <h2>Cambio de Email/Nombre usuario</h2>
      <form onSubmit={handleSubmit} acceptCharset="UTF-8">
        <input type="email" name="email"  value={email} placeholder="Email nuevo" onChange={handleChange}/>
        <input type="text" name="username" value={username} placeholder="Nombre nuevo" onChange={handleChange}/>
        <button type="submit">Cambiar Email/Nombre</button>
      </form>
      <h3>Tanto el email como el usuario se pueden dejar vacios pero si no funciona es porque uno de los valores ya existe</h3>
      {message && showAlert && <AlertaPersonalizada message={message} type={messageType} />}
    </div>
  );
};

export default ProfileEmailUsernameForm;
