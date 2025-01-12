const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const router = express.Router();
const usersService = require("../services/users");

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
 * /users:
 *   get:
 *     summary: Get all users in a room
 *     description: Fetch a list of all users in a specific room.
 *     parameters:
 *       - in: query
 *         name: roomId
 *         required: true
 *         description: The ID of the room to fetch users for
 *     responses:
 *       200:
 *         description: A list of users in the room
 *       400:
 *         description: Invalid roomId
 */
router.get(
  "/",
  query("roomId").notEmpty().withMessage("Room ID is required."),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const users = await usersService.getUsersInRoom(req.query.roomId);
      res.json(users);
    } catch (err) {
      console.error(`Error while getting users: `, err.message);
      next(err);
    }
  }
);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a specific user by userId
 *     description: Fetch a user's details by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to fetch
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid userId
 */
router.get(
  "/:userId",
  param("userId").notEmpty().withMessage("User ID is required."),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const user = await usersService.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(`Error while getting user: `, err.message);
      next(err);
    }
  }
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to a room.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               userId:
 *                 type: string
 *               roomId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("userId").notEmpty().withMessage("User ID is required."),
    body("roomId").notEmpty().withMessage("Room ID is required."),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const newUser = await usersService.addUser(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      console.error(`Error while creating user: `, err.message);
      next(err);
    }
  }
);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by userId
 *     description: Remove a user from the room by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to remove
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid userId
 */
router.delete(
  "/:userId",
  param("userId").notEmpty().withMessage("User ID is required."),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      await usersService.removeUser(req.params.userId);
      res.status(204).send();
    } catch (err) {
      console.error(`Error while deleting user: `, err.message);
      next(err);
    }
  }
);

module.exports = router;
