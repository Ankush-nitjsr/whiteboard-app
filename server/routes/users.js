const express = require("express");
const router = express.Router();
const usersService = require("../services/users");

/* GET all users with pagination. */
router.get("/", async (req, res, next) => {
  try {
    res.json(await usersService.getUsers(req.query.page));
  } catch (err) {
    console.error(`Error while getting users: `, err.message);
    next(err);
  }
});

/* POST a new user. */
router.post("/", async (req, res, next) => {
  try {
    res.json(await usersService.createUser(req.body));
  } catch (err) {
    console.error(`Error while creating user: `, err.message);
    next(err);
  }
});

/* DELETE a user by ID. */
router.delete("/:id", async (req, res, next) => {
  try {
    res.json({ deleted: await usersService.deleteUser(req.params.id) });
  } catch (err) {
    console.error(`Error while deleting user: `, err.message);
    next(err);
  }
});

module.exports = router;
