const db = require("./db");

/**
 * Fetches whiteboard data for a room.
 */
async function getWhiteboard(roomId) {
  const rows = await db.query(
    `SELECT id, roomId, imageUrl, updated_at 
     FROM whiteboards 
     WHERE roomId = ?`,
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
    `INSERT INTO whiteboards (roomId, imageUrl) 
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE 
     imageUrl = VALUES(imageUrl), 
     updated_at = CURRENT_TIMESTAMP`,
    [roomId, imageUrl]
  );

  return { affectedRows: result.affectedRows };
}

module.exports = {
  getWhiteboard,
  updateWhiteboard,
};
