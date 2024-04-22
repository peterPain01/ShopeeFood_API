const express = require("express");
const UserController = require("../controller/user.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyAdmin } = require("../utils/auth");

// USER INFORMATION
router.get(
    "/users",
    verifyToken,
    verifyAdmin,
    errorHandler(UserController.getAllUser)
);

router.get("/user", verifyToken, errorHandler(UserController.getUserById));
router.patch("/user", verifyToken, errorHandler(UserController.update));

module.exports = router;
