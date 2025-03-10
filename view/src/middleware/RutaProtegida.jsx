import { Navigate, Outlet } from "react-router-dom";

const RutaProtegida = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default RutaProtegida;
