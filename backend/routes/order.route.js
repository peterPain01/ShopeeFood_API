const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");
const orderController = require("../controller/order.C");

router.get(
    "/sub/checkout",
    verifyToken,
    errorHandler(orderController.checkoutReview)
);

router.get("/checkout", verifyToken, errorHandler(orderController.checkout));

router.post("/create_payment_url", errorHandler(orderController.getVnpUrl));
router.get("/vnpay_return", errorHandler(orderController.handleVnpResult));

module.exports = router;
