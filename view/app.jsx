import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicio from "./src/Pages/PaginaInicio.jsx";
import PaginaLogueado from "./src/Pages/PaginaLogueado.jsx";
import RutaProtegida from "./src/middleware/RutaProtegida.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route element={<RutaProtegida />}>
          <Route path="/logueado" element={<PaginaLogueado />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
