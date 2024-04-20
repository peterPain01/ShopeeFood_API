const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");
const categoryService = require("../services/category.service");

// [GET]
router.get("/categories", errorHandler(categoryService.getAllCategory));

module.exports = router;
