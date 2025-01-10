const express = require("express");
const router = express.Router();
const usersService = require("../services/users");

/* GET all users in a room. */
router.get("/", async (req, res, next) => {
  try {
    const users = await usersService.getUsersInRoom(req.query.roomId);
    res.json(users);
  } catch (err) {
    console.error(`Error while getting users: `, err.message);
    next(err);
  }
});

/* POST a new user. */
router.post("/", async (req, res, next) => {
  try {
    const newUser = await usersService.addUser(req.body);
    res.json(newUser);
  } catch (err) {
    console.error(`Error while creating user: `, err.message);
    next(err);
  }
});

/* DELETE a user by userId. */
router.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await usersService.removeUser(req.params.userId);
    res.json({ deleted: deletedUser });
  } catch (err) {
    console.error(`Error while deleting user: `, err.message);
    next(err);
  }
});

module.exports = router;
