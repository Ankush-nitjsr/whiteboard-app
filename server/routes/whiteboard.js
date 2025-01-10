const express = require("express");
const router = express.Router();
const whiteboardsService = require("../services/whiteboards");

/* GET whiteboard data for a room. */
router.get("/:roomId", async (req, res, next) => {
  try {
    const whiteboard = await whiteboardsService.getWhiteboard(
      req.params.roomId
    );
    res.json(whiteboard);
  } catch (err) {
    console.error(`Error while getting whiteboard: `, err.message);
    next(err);
  }
});

/* POST/PUT whiteboard data for a room. */
router.post("/", async (req, res, next) => {
  try {
    const updatedWhiteboard = await whiteboardsService.updateWhiteboard(
      req.body
    );
    res.json(updatedWhiteboard);
  } catch (err) {
    console.error(`Error while updating whiteboard: `, err.message);
    next(err);
  }
});

module.exports = router;
