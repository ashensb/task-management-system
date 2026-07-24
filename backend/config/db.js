const mysql = require('mysql2/promise');
require('dotenv').config();

// Create Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection
db.getConnection()
    .then(connection => {
        console.log('MySQL Database Connected Successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('Database Connection Failed: ', err.message);
    });

module.exports = db;