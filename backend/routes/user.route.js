const express = require("express");
const UserController = require("../controller/User.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

// USER INFORMATION
router.get("/user", errorHandler(UserController.getUserById));
router.get("/users", verifyToken, errorHandler(UserController.getAllUser));
router.patch("/user", errorHandler(UserController.update));

module.exports = router;
