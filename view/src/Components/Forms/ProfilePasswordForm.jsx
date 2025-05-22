import './forms.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertaPersonalizada from "../AlertaPersonalizada/AlertaPersonalizada.jsx";

const ProfilePasswordForm = ({userId}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [messageType, setMessageType] = useState("");
  const navigate= useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    oldPassword:""
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
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
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
        }, 1000);
        
      } else {
        setMessage(data.message || "Error al modificar contraseña");
        setMessageType("error"); 
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      setMessage("❌ Error en la conexión con el servidor");
    } finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className="retro-container-P">

      <h2>Cambio de contraseña</h2>
      <form onSubmit={handleSubmit} acceptCharset="UTF-8">
        <input type="password" name="oldPassword" placeholder="Contraseña antigua " onChange={handleChange} required />
        <input type="password" name="newPassword" placeholder="Contraseña nueva " onChange={handleChange} required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "⏳ Procesando..." : "Cambiar contraseña"}
        </button>
      </form>
      {message && showAlert && <AlertaPersonalizada message={message} type={messageType} />}
    </div>
  );
};

export default ProfilePasswordForm;
