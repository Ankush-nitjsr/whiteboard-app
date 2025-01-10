const express = require("express");
const router = express.Router();
const whiteboardsService = require("../services/whiteboards");

/* GET whiteboard data for a room. */
router.get("/:roomId", async (req, res, next) => {
  try {
    res.json(await whiteboardsService.getWhiteboard(req.params.roomId));
  } catch (err) {
    console.error(`Error while getting whiteboard: `, err.message);
    next(err);
  }
});

/* POST/PUT whiteboard data for a room. */
router.post("/", async (req, res, next) => {
  try {
    res.json(await whiteboardsService.updateWhiteboard(req.body));
  } catch (err) {
    console.error(`Error while updating whiteboard: `, err.message);
    next(err);
  }
});

module.exports = router;
