import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forms.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Necesario para que las cookies funcionen
        body: JSON.stringify({
          nombre_usuario: formData.username,
          contrasena: formData.password,
        }),
      });

      if (response.ok) {
        setMessage("✅ Inicio de sesión exitoso");
        navigate("/logueado");
      } else {
        const data = await response.json();
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error en la conexión con el servidor");
    }
  };

  return (
    <div className="retro-container-L">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Ingresar</button>
        <p>¿No tienes cuenta? Regístrate</p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
