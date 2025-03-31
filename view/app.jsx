import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicio from "./src/Pages/PaginaInicio.jsx";
import PaginaLogueado from "./src/Pages/PaginaLogueado.jsx";
import RutaProtegida from "./src/middleware/RutaProtegida.jsx";
import PaginaPerfil from "./src/Pages/PaginaPerfil.jsx";
import PaginaExamenes from "./src/Pages/PaginaExamenes.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route element={<RutaProtegida />}>
          <Route path="/inicio" element={<PaginaLogueado />} />
          <Route path="/tareas" element={<PaginaLogueado />} />
          <Route path="/proyectos" element={<PaginaLogueado />} />
          <Route path="/examenes" element={<PaginaExamenes />} />
          <Route path="/perfil" element={<PaginaPerfil/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
