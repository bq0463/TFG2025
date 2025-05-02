import "./alertaPersonalizada.css";

const AlertaPersonalizada = ({ message, type = "success" }) => {
  return (
    <div className={`alerta ${type}`}>
      {message}
    </div>
  );
};

export default AlertaPersonalizada;