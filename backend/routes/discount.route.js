const express = require("express");
const router = express.Router();
const discountController = require("../controller/discount.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

router.post("/discount", verifyToken, errorHandler(discountController.createDiscount));
router.patch('/discount/:id', verifyToken, errorHandler(discountController.updateDiscount))

// get discount by Shop 
router.get('/discount/shop:id', verifyToken, errorHandler(discountController.getDiscountByShop))
router.delete('/discount/:discount_id',verifyToken,  errorHandler(discountController.deleteDiscountByShop))

module.exports = router;
