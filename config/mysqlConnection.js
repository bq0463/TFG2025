import mysql from 'mysql2/promise';

export const connection = await mysql.createConnection({
    host: '127.0.0.1',  // Dirección IP del servidor MySQL
    port: 3306,         // Puerto predeterminado de MySQL
    user: 'root',       // Usuario que usas en Workbench
    password: '', // Contraseña que usas en Workbench
    database: 'TFG2025' // Cambia por el nombre de tu base de datos
});
