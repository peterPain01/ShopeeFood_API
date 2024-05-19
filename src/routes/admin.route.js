const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyAdmin, verifyToken } = require("../utils/auth");
const adminController = require("../controller/admin.C");

router.use([verifyToken, verifyAdmin]);

// get all users
router.get("/users", errorHandler(adminController.getAllUser));

// get all shipper
router.get("/shippers", errorHandler(adminController.getAllShippers));

module.exports = router;
