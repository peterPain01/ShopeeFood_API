const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.C");
const { verifyToken } = require("../utils/auth");
const errorHandler = require("../utils/errorHandler");

router.post(
    "/cart/:id",
    verifyToken,
    errorHandler(cartController.addProductToCart)
);
router.get("/cart", verifyToken, errorHandler(cartController.getCart));
router.delete("/cart", verifyToken, errorHandler(cartController.deleteCart));

router.patch(
    "/cart/remove/product/:product_id",
    verifyToken,
    errorHandler(cartController.removeProductFromCart)
);

router.patch(
    "/cart/reduce/product/:product_id",
    verifyToken,
    errorHandler(cartController.reduceProductQuantity)
);

router.patch(
    "/cart/inc/product/:product_id",
    verifyToken,
    errorHandler(cartController.incProductQuantity)
);

module.exports = router;
