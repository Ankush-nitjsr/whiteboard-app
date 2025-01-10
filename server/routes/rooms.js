const express = require("express");
const router = express.Router();
const roomsService = require("../services/rooms");

/* GET all rooms. */
router.get("/", async (req, res, next) => {
  try {
    const rooms = await roomsService.getRooms();
    res.json(rooms);
  } catch (err) {
    console.error(`Error while getting rooms: `, err.message);
    next(err);
  }
});

/* POST a new room. */
router.post("/", async (req, res, next) => {
  try {
    const newRoom = await roomsService.createRoom(req.body);
    res.json(newRoom);
  } catch (err) {
    console.error(`Error while creating room: `, err.message);
    next(err);
  }
});

module.exports = router;
