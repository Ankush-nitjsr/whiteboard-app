const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const roomsService = require("../services/rooms");

// Middleware for handling validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Fetch a list of all rooms.
 *     responses:
 *       200:
 *         description: A list of rooms
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res, next) => {
  try {
    const rooms = await roomsService.getRooms();
    res.json(rooms);
  } catch (err) {
    console.error(`Error while getting rooms: `, err.message);
    next(err);
  }
});

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get a specific room by roomId
 *     description: Fetch a room's details by its ID.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the room to fetch
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 *       400:
 *         description: Invalid roomId
 */
router.get(
  "/:roomId",
  param("roomId").notEmpty().withMessage("Room ID is required."),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const room = await roomsService.getRoom(req.params.roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (err) {
      console.error(`Error while getting room: `, err.message);
      next(err);
    }
  }
);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     description: Create a new room by providing roomId and hostId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               hostId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Invalid input data
 */
router.post(
  "/",
  body("roomId").notEmpty().withMessage("Room ID is required."),
  body("hostId").notEmpty().withMessage("Host ID is required."),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const newRoom = await roomsService.createRoom(req.body);
      res.status(201).json(newRoom);
    } catch (err) {
      console.error(`Error while creating room: `, err.message);
      next(err);
    }
  }
);

module.exports = router;
