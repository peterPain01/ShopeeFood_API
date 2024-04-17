const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.C");
const { verifyToken } = require("../utils/auth");

router.post("/cart/:id", verifyToken, cartController.addProductToCart);
router.get("/cart", verifyToken, cartController.getCart);

module.exports = router;
