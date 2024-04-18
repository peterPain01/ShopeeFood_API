const express = require("express");
const router = express.Router();
const discountController = require("../controller/discount.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

// [POST]
router.post("/shop/discount", verifyToken, errorHandler(discountController.createDiscount));

// [PATCH]
router.patch('/shop/discount/:id', verifyToken, errorHandler(discountController.updateDiscount))

// [GET]
// get discount available with product 
router.get('/discount/product/:product_id', verifyToken, errorHandler(discountController.getDiscountByProduct))
router.get('/shop/discount/:id', verifyToken, errorHandler(discountController.getDiscountByShop))

// [DELETE]
router.delete('/shop/discount/:discount_id',verifyToken,  errorHandler(discountController.deleteDiscountByShop))

module.exports = router;
