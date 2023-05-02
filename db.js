const mysql = require('mysql2')
const db = mysql.createConnection({
  // host: '49.50.161.32',
  host: '127.0.0.1',
  port: '3306',
  user: 'bside',
  password: 'bside',
  database: 'bside',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = db;