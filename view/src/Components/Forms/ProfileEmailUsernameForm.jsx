import './forms.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileEmailUsernameForm = ({userId}) => {
  const [email,setEmailForm]= useState("");
  const [username,setUsernameForm]= useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  
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
        navigate("/");
      } else {
        setMessage(`Error: ${data.message}`);
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfileEmailUsernameForm;
