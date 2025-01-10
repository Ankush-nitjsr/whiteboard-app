const db = require("./db");

// Add a user to the database
async function addUser({
  name,
  userId,
  roomId,
  host = false,
  presenter = false,
}) {
  const sql = `
    INSERT INTO users (name, userid, roomid, host, presenter)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (userid) 
    DO UPDATE SET roomid = $3
    RETURNING *;
  `;
  const rows = await db.query(sql, [name, userId, roomId, host, presenter]);
  return rows; // Return the user data
}

// Remove a user from the database
async function removeUser(userId) {
  const sql = `DELETE FROM users WHERE userid = $1;`;
  await db.query(sql, [userId]);
}

// Get a specific user
async function getUser(userId) {
  const sql = `SELECT * FROM users WHERE userid = $1;`;
  const rows = await db.query(sql, [userId]);
  return rows.length ? rows[0] : null;
}

// Get all users in a room
async function getUsersInRoom(roomId) {
  const sql = `SELECT * FROM users WHERE roomid = $1;`;
  const rows = await db.query(sql, [roomId]);
  return rows;
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
