const { Client } = require("pg");
const config = require("./config/dbconfig");

const createTables = async () => {
  const client = new Client(config.db);

  // SQL statements for creating tables
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      userId VARCHAR(255) UNIQUE NOT NULL,
      roomId VARCHAR(255) NOT NULL,
      host BOOLEAN DEFAULT FALSE,
      presenter BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      roomId VARCHAR(255) UNIQUE NOT NULL,
      hostId VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS whiteboards (
      id SERIAL PRIMARY KEY,
      roomId VARCHAR(255) NOT NULL,
      imageUrl TEXT DEFAULT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("Initializing database...");
    await client.connect();
    await client.query(sql);
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  } finally {
    await client.end();
  }
};

createTables();
