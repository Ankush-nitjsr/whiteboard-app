const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const whiteboardsService = require("../services/whiteboard");

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
 * /whiteboard/{roomId}:
 *   get:
 *     summary: Get whiteboard data for a room
 *     description: Fetch the whiteboard data for a specific room.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the room to fetch whiteboard data for
 *     responses:
 *       200:
 *         description: Whiteboard data for the room
 *       404:
 *         description: Whiteboard not found
 *       400:
 *         description: Invalid roomId
 */
router.get(
  "/:roomId",
  param("roomId").notEmpty().withMessage("Room ID is required."),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const whiteboard = await whiteboardsService.getWhiteboard(
        req.params.roomId
      );
      if (!whiteboard) {
        return res.status(404).json({ error: "Whiteboard not found" });
      }
      res.json(whiteboard);
    } catch (err) {
      console.error(`Error while getting whiteboard: `, err.message);
      next(err);
    }
  }
);

/**
 * @swagger
 * /whiteboard:
 *   post:
 *     summary: Post/Update whiteboard data for a room
 *     description: Update or create whiteboard data for a room.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Whiteboard data updated successfully
 *       400:
 *         description: Invalid input data
 */
router.post(
  "/",
  [
    body("roomId").notEmpty().withMessage("Room ID is required."),
    body("imageUrl").notEmpty().withMessage("Image URL is required."),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const updatedWhiteboard = await whiteboardsService.updateWhiteboard(
        req.body
      );
      res.json(updatedWhiteboard);
    } catch (err) {
      console.error(`Error while updating whiteboard: `, err.message);
      next(err);
    }
  }
);

module.exports = router;
