const db = require("./db");

/**
 * Fetches all rooms.
 */
async function getRooms() {
  try {
    const rooms = await db.query("SELECT * FROM rooms");
    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}

/**
 * Fetches room with specific roomId.
 */
async function getRoom(roomId) {
  try {
    const room = await db.query("SELECT * FROM rooms WHERE roomid = $1", [
      roomId,
    ]);
    return room[0];
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
}

/**
 * Creates a new room.
 */
async function createRoom(roomData) {
  const { roomId, hostId } = roomData;
  try {
    const newRoom = await db.query(
      "INSERT INTO rooms (roomid, hostid) VALUES ($1, $2) RETURNING *",
      [roomId, hostId]
    );
    return newRoom[0];
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

module.exports = {
  getRooms,
  getRoom,
  createRoom,
};
