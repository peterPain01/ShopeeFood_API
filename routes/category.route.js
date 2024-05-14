const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const categoryController = require("../controller/category.C");

// [GET]
router.get("/categories", errorHandler(categoryController.getAllCategory));

module.exports = router;
