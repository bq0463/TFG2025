import  { useState } from "react";
import "./forms.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado");
    setMessage("");
    try {
      console.log("empezando fetch");
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_usuario: formData.username,
          email: formData.email,
          contrasena: formData.password
        })
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage(`✅ Registro exitoso: ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error en la conexión con el servidor");
    }
  };

  return (
    <div className="retro-container-R">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} acceptCharset="UTF-8">
        <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
