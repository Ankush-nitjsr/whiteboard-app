const { Client } = require("pg");
const config = require("../config/dbconfig");

let client;

/**
 * Initializes the database connection.
 */
async function initDbConnection() {
  if (!client) {
    client = new Client({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      port: config.db.port || 5432, // Default PostgreSQL port
    });

    await client.connect();
    console.log("PostgreSQL database connection established");
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
    if (!client) {
      await initDbConnection();
    }
    const res = await client.query(sql, params); // Use client.query for PostgreSQL
    return res.rows; // PostgreSQL result is in 'rows'
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err;
  }
}

module.exports = {
  query,
  initDbConnection,
};
