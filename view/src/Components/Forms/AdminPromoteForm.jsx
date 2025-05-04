
import { useState } from "react";
import "./forms.css";
import AlertaPersonalizada from "../AlertaPersonalizada/AlertaPersonalizada.jsx";

const AdminPromoteForm = () => {
  const [nombreMiembro, setNombreMiembro] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setNombreMiembro(e.target.value);
  };

  const AdminPromoteMember = async () => {
    try {
      const response = await fetch('http://localhost:5000/AdminUpdateMember', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ nombre_usuario: nombreMiembro })
      });
  
      const data = await response.json();
      if (response.ok) {
        setShowAlert(true);
        setMessage(data.message);
        setTimeout(() => {
          setShowAlert(false);
          setMessage('');
        }, 1500);
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Error al conectar con el servidor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    await AdminPromoteMember();
  };
  
  return (
      <div className="retro-container-DELETE">
        <h2>Promocionar a un miembro</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombreMiembro"
            placeholder="Nombre de usuario"
            onChange={handleChange}
            required
          />
          <button type="submit">Promocionar</button>
        </form>
        {showAlert && <AlertaPersonalizada message={message} />}
      </div>
  );
}

export default AdminPromoteForm;