const mysql = require("mysql2/promise");
const config = require("../config/dbconfig");

let connection;

/**
 * Initializes the database connection pool.
 */
async function initDbConnection() {
  if (!connection) {
    connection = await mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Database connection pool created");
  }
}

/**
 * Executes a query with the given SQL and parameters.
 * @param {string} sql - The SQL query string.
 * @param {Array} params - The parameters for the SQL query.
 * @returns {Promise<Array>} - The results of the query.
 */
async function query(sql, params) {
  try {
    if (!connection) {
      await initDbConnection();
    }
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err; // Re-throw error for caller to handle
  }
}

module.exports = {
  query,
  initDbConnection,
};
