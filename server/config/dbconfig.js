require("dotenv").config();

const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "ankush",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "postgres",
    port: process.env.DB_PORT || 5432,
  },
  listPerPage: 10,
};

module.exports = config;
