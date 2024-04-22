const express = require("express");
const router = express.Router();
const discountController = require("../controller/discount.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");

/* 
    FEATURES
        User 
            1. Apply voucher by enter code 
            2. get voucher valid with product 
        Shop 
            1. CRUD discount 
            2. Flash sales ---- Thoi gian, Danh sach san pham, so luong, hinh anh 
        Admin 
            1. Delivery discount 

*/
//  [GET] discount available with product
router.get(
    "/discount/product/:product_id",
    errorHandler(discountController.getDiscountByProduct)
);

//  [GET] all discount of Shop
router.get(
    "/shop/discount/",
    verifyToken,
    errorHandler(discountController.getDiscountByShopId)
);

// [POST]
router.post(
    "/shop/discount",
    verifyToken,
    verifyShop,
    errorHandler(discountController.createDiscount)
);

// [PATCH]
router.patch(
    "/shop/discount/:discount_id",
    verifyToken,
    verifyShop,
    errorHandler(discountController.updateDiscount)
);

// [DELETE]
router.delete(
    "/shop/discount/:discount_id",
    verifyToken,
    verifyShop,
    errorHandler(discountController.deleteDiscountByShop)
);

module.exports = router;
