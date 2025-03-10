import React from "react";
import ReactDOM from "react-dom/client"; // Para versiones de React 18+
import App from "./app"; // Ruta al componente principal

// Renderizamos la aplicación dentro de 'root'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
