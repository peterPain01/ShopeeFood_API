const express = require("express");
const UserController = require("../controller/user.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

router.get("/user", verifyToken, errorHandler(UserController.getUserById));
router.patch("/user", verifyToken, errorHandler(UserController.update));


module.exports = router;
