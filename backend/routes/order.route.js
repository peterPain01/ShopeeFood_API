const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyUser } = require("../utils/auth");
const orderController = require("../controller/order.C");

// Only user can order 
router.use(verifyToken, verifyUser);

router.get("/sub/checkout", errorHandler(orderController.checkoutReview));
router.get("/checkout/cash", errorHandler(orderController.checkoutCash));
router.post("/create_payment_url", errorHandler(orderController.getVnpUrl));
router.get("/vnpay_return", errorHandler(orderController.handleVnpResult));

module.exports = router;
