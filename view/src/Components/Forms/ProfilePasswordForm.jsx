import './forms.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePasswordForm = ({userId}) => {
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    oldPassword:""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const navigate= useNavigate;
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Cambio de contraseña exitoso: ${data.message}`);
        navigate("/");
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error en la conexión con el servidor");
    }
  };

  return (
    <div className="retro-container-P">
      <h2>Cambio de contraseña</h2>
      <form onSubmit={handleSubmit} acceptCharset="UTF-8">
        <input type="password" name="oldPassword" placeholder="Contraseña antigua " onChange={handleChange} required />
        <input type="password" name="newPassword" placeholder="Contraseña nueva " onChange={handleChange} required />
        <button type="submit">Cambiar contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfilePasswordForm;
