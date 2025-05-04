
import { useState } from "react";
import "./forms.css";
import AlertaPersonalizada from "../AlertaPersonalizada/AlertaPersonalizada.jsx";

const AdminDeleteForm = () => {
  const [nombreMiembro, setNombreMiembro] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setNombreMiembro(e.target.value);
  };

  const AdminEliminaMiembro = async () => {
    try {
      const response = await fetch('http://localhost:5000/adminDeleteMember', {
        method: 'DELETE',
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
    await AdminEliminaMiembro();
  };
  
  return (
    <>
      <h1>Sección de Admin</h1>
      <div className="retro-container-DELETE">
        <h2>Eliminar Miembro</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombreMiembro"
            placeholder="Nombre de usuario"
            onChange={handleChange}
            required
          />
          <button type="submit">Eliminar</button>
        </form>
        {showAlert && <AlertaPersonalizada message={message} />}
      </div>
    </>
  );
}

export default AdminDeleteForm;