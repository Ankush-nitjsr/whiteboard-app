const db = require("./db");

// Fetch all users in a specific room
async function getUsersInRoom(roomId) {
  try {
    const result = await db.query("SELECT * FROM users WHERE roomid = $1", [
      roomId,
    ]);
    return result;
  } catch (error) {
    console.error(`Error fetching users in room ${roomId}:`, error.message);
    throw new Error("Error fetching users in room.");
  }
}

// Fetch a single user by their socket ID
async function getUserBySocketId(socketId) {
  try {
    const result = await db.query("SELECT * FROM users WHERE socketid = $1", [
      socketId,
    ]);
    if (!result) {
      console.warn(`No user found for socketId: ${socketId}`);
      return null;
    }
    return result[0];
  } catch (error) {
    console.error(
      `Error fetching user by socketId ${socketId}:`,
      error.message
    );
    throw new Error("Error fetching user by socketId.");
  }
}

// Add a user to the database
async function addUser({ name, userId, roomId, socketId, host, presenter }) {
  try {
    // Validate required fields
    if (!name || !userId || !roomId || !socketId) {
      console.error("Invalid user data:", {
        name,
        userId,
        roomId,
        socketId,
        host,
        presenter,
      });
      throw new Error("Invalid user data.");
    }

    const result = await db.query(
      "INSERT INTO users (name, userid, roomid, socketid, host, presenter) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, userId, roomId, socketId, host, presenter]
    );

    if (!result) {
      console.error("Failed to add user:", {
        name,
        userId,
        roomId,
        socketId,
        host,
        presenter,
      });
      throw new Error(
        "Failed to add user due to unexpected database response."
      );
    }

    console.log("User successfully added:", result[0]);
    return result[0];
  } catch (error) {
    console.error(
      "Error adding user:",
      { name, userId, roomId, socketId },
      error.message
    );
    throw new Error("Error adding user.");
  }
}

// Remove a user from the database
async function removeUser(userId) {
  try {
    const result = await db.query(
      "DELETE FROM users WHERE userid = $1 RETURNING *",
      [userId]
    );
    if (!result) {
      console.warn(`No user found to remove with userId: ${userId}`);
      return null;
    }

    console.log("User successfully removed:", result[0]);
    return result[0];
  } catch (error) {
    console.error(`Error removing user with userId ${userId}:`, error.message);
    throw new Error("Error removing user.");
  }
}

module.exports = {
  getUsersInRoom,
  getUserBySocketId,
  addUser,
  removeUser,
};
