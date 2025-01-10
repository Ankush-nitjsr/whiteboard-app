require("dotenv").config();

const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "mysqlroot",
    database: process.env.DB_NAME || "whiteboard",
    connectTimeout: 60000,
  },
  listPerPage: 10,
};

module.exports = config;
