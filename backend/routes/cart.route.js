const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.C");
const { verifyToken } = require("../utils/auth");
const errorHandler = require("../utils/errorHandler");

router.use(verifyToken);

router.get("/", errorHandler(cartController.getCart));

router.post("/", errorHandler(cartController.addProductToCart));

router.delete("", errorHandler(cartController.deleteCart));

router.post("/note", errorHandler(cartController.createNote));

router.patch(
    "/remove/product/:product_id",
    errorHandler(cartController.removeProductFromCart)
);

router.patch(
    "/reduce/product/:product_id",
    errorHandler(cartController.reduceProductQuantity)
);

router.patch(
    "/inc/product/:product_id",
    errorHandler(cartController.incProductQuantity)
);

module.exports = router;
