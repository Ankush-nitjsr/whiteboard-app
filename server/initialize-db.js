const mysql = require("mysql2/promise");
const config = require("./config/dbconfig");

const createTables = async () => {
  const connection = await mysql.createConnection(config.db);

  // SQL statements for creating tables
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      userId VARCHAR(255) UNIQUE NOT NULL,
      roomId VARCHAR(255) NOT NULL,
      host BOOLEAN DEFAULT FALSE,
      presenter BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roomId VARCHAR(255) UNIQUE NOT NULL,
      hostId VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS whiteboards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roomId VARCHAR(255) NOT NULL,
      imageUrl TEXT DEFAULT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("Initializing database...");
    await connection.query(sql);
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  } finally {
    await connection.end();
  }
};

createTables();
