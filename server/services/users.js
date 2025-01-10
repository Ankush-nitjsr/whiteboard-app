const db = require("./db");

// Add a user to the database
async function addUser({
  name,
  userId,
  roomId,
  host = false,
  presenter = false,
  socketId,
}) {
  const sql = `
    INSERT INTO users (name, userId, roomId, host, presenter, socketId)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE roomId = ?, socketId = ?;
  `;
  await db.query(sql, [
    name,
    userId,
    roomId,
    host,
    presenter,
    socketId,
    roomId,
    socketId,
  ]);
  return getUsersInRoom(roomId); // Return updated users in room
}

// Remove a user from the database
async function removeUser(userId) {
  const sql = `DELETE FROM users WHERE userId = ?;`;
  await db.query(sql, [userId]);
}

// Get a specific user
async function getUser(userId) {
  const sql = `SELECT * FROM users WHERE userId = ?;`;
  const rows = await db.query(sql, [userId]);
  return rows.length ? rows[0] : null;
}

// Get all users in a room
async function getUsersInRoom(roomId) {
  const sql = `SELECT * FROM users WHERE roomId = ?;`;
  const rows = await db.query(sql, [roomId]);
  return rows;
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
