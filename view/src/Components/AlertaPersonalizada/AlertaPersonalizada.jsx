import "./alertaPersonalizada.css";

const AlertaPersonalizada = ({ message, type}) => {
  return (
    <div className={`alerta ${type}`}>
      {message}
    </div>
  );
};

export default AlertaPersonalizada;