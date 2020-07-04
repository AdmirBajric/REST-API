// load modules
const express = require("express");
const authMiddleware = require("../middleware/authenticate");
const { userValidation, validate } = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const bcryptjs = require("bcryptjs");
const { models } = require("../db");
const { User } = models;
const router = express.Router();

// Route that returns the current authenticated user.
router.get(
  "/users",
  authMiddleware.authenticateUser,
  asyncHandler(async (req, res) => {
    const reqUser = req.currentUser;

    const user = await User.findOne({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      where: {
        emailAddress: reqUser.emailAddress,
      },
    });

    res.status(200).json({ user });
  })
);

// Route that creates a new user
router.post(
  "/users",
  userValidation(),
  validate,
  asyncHandler(async (req, res, next) => {
    try {
      const user = req.body;
      user.password = bcryptjs.hashSync(user.password);
      await User.create(user);
      res.status(201).location("/").end();
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const errorMessage = [];
        error.errors.map((err) => errorMessage.push(err.message));
        return res.status(400).json({ errors: errorMessage });
      } else {
        throw error;
      }
    }
  })
);
// Export router module
module.exports = router;
