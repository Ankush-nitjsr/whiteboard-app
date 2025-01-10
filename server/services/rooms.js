const db = require("./db");

/**
 * Fetches all rooms.
 */
async function getRooms() {
  const rows = await db.query(
    `SELECT id, roomid, hostid, created_at 
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
    `INSERT INTO rooms (roomid, hostid) 
     VALUES ($1, $2) RETURNING id`,
    [roomId, hostId]
  );

  return { id: result[0].id }; // PostgreSQL returns rows as an array
}

module.exports = {
  getRooms,
  createRoom,
};
