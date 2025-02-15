const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "childrens",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 20,
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log(" Connected to MySQL database");
    connection.release();
  }
});


setInterval(() => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(" MySQL connection lost, attempting to reconnect:", err.message);
    } else {
      console.log(" MySQL connection active");
      connection.release();
    }
  });
}, 30000); 

module.exports = pool;


