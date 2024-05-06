const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyUser } = require("../utils/auth");
const orderController = require("../controller/order.C");

router.get(
    "/detail",
    verifyToken,
    errorHandler(orderController.getOrderDetail)
);

// this route used for zalo pay call 
router.post(
    "/callback/zalopay",
    errorHandler(orderController.handleZalopayCallback)
);

// Only user can order
router.use(verifyToken, verifyUser);

router.get("/sub/checkout", errorHandler(orderController.checkoutReview));

// checkout cash
router.post("/checkout/cash", orderController.checkoutPreProcess, errorHandler(orderController.checkoutCash));

// check out with vn pay
router.post("/create_payment_url", errorHandler(orderController.getVnpUrl));
router.get("/vnpay_return", errorHandler(orderController.handleVnpResult));

// checkout with zalo pay
router.post("/checkout/zalopay", orderController.checkoutPreProcess, errorHandler(orderController.checkoutZalo));

// checkout with paypal
router.get("/on-going", errorHandler(orderController.getOnGoingOrder));
router.get("/success", errorHandler(orderController.getSuccessOrder));

module.exports = router;
