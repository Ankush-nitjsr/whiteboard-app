const db = require("./db");

/**
 * Fetches all rooms.
 */
async function getRooms() {
  const rows = await db.query(
    `SELECT id, roomId, hostId, created_at 
     FROM rooms`
  );

  return rows;
}

/**
 * Creates a new room.
 */
async function createRoom(room) {
  const { roomId, hostId } = room;
  const result = await db.query(
    `INSERT INTO rooms (roomId, hostId) 
     VALUES (?, ?)`,
    [roomId, hostId]
  );

  return { id: result.insertId };
}

module.exports = {
  getRooms,
  createRoom,
};
