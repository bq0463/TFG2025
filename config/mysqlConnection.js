import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

//myqsl workbench
export const connection = await mysql.createConnection({
    host: process.env.MYSQL_host,  
    port: process.env.MYSQL_port,         
    user: process.env.MYSQL_user,    
    password: process.env.MYSQL_password, 
    database: process.env.MYSQL_database,
});
