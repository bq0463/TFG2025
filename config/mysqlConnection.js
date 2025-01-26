import mysql from 'mysql2/promise';
export const config = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'TFG2025'
});
