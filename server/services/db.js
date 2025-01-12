const { Pool } = require("pg");
const config = require("../config/dbconfig");
const logger = require("winston");

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port || 5432, // Default PostgreSQL port
});

/**
 * Executes a query with the given SQL and parameters.
 * @param {string} sql - The SQL query string.
 * @param {Array} [params] - The parameters for the SQL query.
 * @returns {Promise<Array>} - The results of the query.
 */
async function query(sql, params = []) {
  try {
    const res = await pool.query(sql, params);
    return res.rows;
  } catch (err) {
    logger.error(`Database query failed for SQL: ${sql}, Params: ${params}`, {
      error: err.message,
    });
    throw err;
  }
}

/**
 * Tests the database connection during application startup.
 */
async function testDbConnection() {
  try {
    const result = await query("SELECT NOW()");
    logger.info("PostgreSQL database connection successful", { result });
  } catch (error) {
    logger.error("Database connection test failed:", { error: error.message });
    process.exit(1);
  }
}

/**
 * Shuts down the database pool during application termination.
 */
async function shutdown() {
  try {
    await pool.end();
    logger.info("PostgreSQL pool has been shut down gracefully");
  } catch (err) {
    logger.warn("Error while shutting down the PostgreSQL pool", {
      error: err.message,
    });
  }
}

module.exports = {
  query,
  testDbConnection,
  shutdown,
};
