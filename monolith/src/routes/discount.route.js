const express = require("express");
const router = express.Router();
const discountController = require("../controller/discount.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");


//  [GET] discount available with cart
router.get(
    "/cart/",
    verifyToken,
    errorHandler(discountController.getDiscountByCart)
);

module.exports = router;
