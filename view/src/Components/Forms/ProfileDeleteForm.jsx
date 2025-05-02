import './forms.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertaPersonalizada from "../alerta personalizada/AlertaPersonalizada.jsx";const ProfileDeleteForm = ({ userId }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Cuenta borrada con éxito");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          
          navigate("/");
        }, 1000);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error en la conexión con el servidor");
    }
    setShowConfirm(false);
  };

  return (
    <div className="retro-container-DELETE">
      <h2>Borrar Cuenta</h2>
      <form onSubmit={(e) => e.preventDefault()} acceptCharset="UTF-8">
        <button type="button" onClick={() => setShowConfirm(true)}>
          Borrar
        </button>
        {message && <AlertaPersonalizada message={message} type="success" />}
      </form>

      {showConfirm && (
        <div className="retro-confirm">
          <p>⚠️ ¿Estás seguro de borrar tu cuenta?</p>
          <button onClick={handleDelete}>Confirmar</button>
          <button onClick={() => setShowConfirm(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDeleteForm;
