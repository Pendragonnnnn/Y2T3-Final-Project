const path = require('path');
// This tells dotenv to look for the .env file in the root directory
// regardless of where db.js is located
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'LibraryReservationDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Example in your db.js or config file
console.log('--- DATABASE CONNECTION INFO ---');
console.log('Host:', process.env.DB_HOST);
console.log('Database Name:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('--------------------------------');

module.exports = pool;

