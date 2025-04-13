import mysql from 'mysql2/promise';

export const connection = await mysql.createConnection({
    host: '127.0.0.1',  // Dirección IP del servidor MySQL
    port: 3306,         // Puerto 
    user: 'root',       // Usuario que usas en Workbench
    password: '', 
    database: 'TFG2025' 
});
