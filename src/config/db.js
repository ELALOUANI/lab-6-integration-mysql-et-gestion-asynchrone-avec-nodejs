const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.withConnection = async (callback) => {
  let connection;

  try {
    connection = await pool.getConnection();
    return await callback(connection);
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = pool;
