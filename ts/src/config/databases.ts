// config/database.ts
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: "34.97.5.240",
    port: 3306,
    user: "root",
    password: "R]>m3>uU:_`gpc,a",
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});