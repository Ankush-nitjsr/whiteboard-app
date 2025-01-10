const express = require("express");
const router = express.Router();
const roomsService = require("../services/rooms");

/* GET all rooms. */
router.get("/", async (req, res, next) => {
  try {
    res.json(await roomsService.getRooms());
  } catch (err) {
    console.error(`Error while getting rooms: `, err.message);
    next(err);
  }
});

/* POST a new room. */
router.post("/", async (req, res, next) => {
  try {
    res.json(await roomsService.createRoom(req.body));
  } catch (err) {
    console.error(`Error while creating room: `, err.message);
    next(err);
  }
});

module.exports = router;
