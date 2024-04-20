const express = require("express");
const UserController = require("../controller/user.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

// USER INFORMATION
router.get("/user", verifyToken, errorHandler(UserController.getUserById));
router.get("/users", verifyToken, errorHandler(UserController.getAllUser));
router.patch("/user", verifyToken, errorHandler(UserController.update));

module.exports = router;
