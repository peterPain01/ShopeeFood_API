const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");
const orderController = require("../controller/order.C");

router.get(
    "/order/checkout",
    verifyToken,
    errorHandler(orderController.checkoutReview)
);


module.exports = router