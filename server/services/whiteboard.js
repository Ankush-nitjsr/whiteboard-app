const db = require("./db");

/**
 * Fetches whiteboard data for a room.
 */
async function getWhiteboard(roomId) {
  const rows = await db.query(
    `SELECT id, roomid, imageurl, updated_at 
     FROM whiteboards 
     WHERE roomid = $1`,
    [roomId]
  );

  return rows[0]; // Return the first matching whiteboard
}

/**
 * Updates whiteboard data for a room.
 */
async function updateWhiteboard(whiteboard) {
  const { roomId, imageUrl } = whiteboard;
  const result = await db.query(
    `INSERT INTO whiteboards (roomid, imageurl) 
     VALUES ($1, $2)
     ON CONFLICT (roomid) 
     DO UPDATE SET imageurl = $2, updated_at = CURRENT_TIMESTAMP 
     RETURNING affected_rows`,
    [roomId, imageUrl]
  );

  return { affectedRows: result[0].affected_rows };
}

module.exports = {
  getWhiteboard,
  updateWhiteboard,
};
