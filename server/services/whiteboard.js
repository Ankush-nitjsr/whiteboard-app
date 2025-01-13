const db = require("./db");
/**
 * Fetches whiteboard data for a room.
 */
async function getWhiteboard(roomId) {
  try {
    const result = await db.query(
      "SELECT * FROM whiteboards WHERE roomid = $1",
      [roomId]
    );
    if (!result) {
      console.warn(`No whiteboard found for roomId: ${roomId}`);
      return null;
    }
    console.log("GetWhiteboard result: ", result);
    return result[0];
  } catch (error) {
    console.error(`Error fetching whiteboard for roomId ${roomId}:`, error);
    throw new Error("Error fetching whiteboard.");
  }
}

/**
 * Updates whiteboard data for a room.
 */
async function updateWhiteboard({ roomId, imageUrl }) {
  try {
    if (!roomId || !imageUrl) {
      throw new Error("Invalid data for whiteboard update.");
    }

    const result = await db.query(
      `INSERT INTO whiteboards (roomid, imageurl) 
       VALUES ($1, $2)
       ON CONFLICT (roomid) 
       DO UPDATE SET imageurl = $2, updated_at = CURRENT_TIMESTAMP 
       RETURNING *`,
      [roomId, imageUrl]
    );

    return result[0];
  } catch (error) {
    console.error(
      "Error updating whiteboard:",
      { roomId, imageUrl },
      error.message
    );
    throw new Error("Error updating whiteboard.");
  }
}

module.exports = {
  getWhiteboard,
  updateWhiteboard,
};
