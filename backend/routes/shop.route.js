const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

// [POST]
router.post("/shop", verifyToken, errorHandler(ShopController.createShop));

// [GET]
router.get(
    "/shop/:shopId/products/search/:keySearch",
    errorHandler(ShopController.searchProductInShop)
);

// [GET]
router.get("/shop/category", errorHandler(ShopController.getShopByCategory))

router.get(
    "/shop/drafts",
    verifyToken,
    errorHandler(ShopController.getAllDraftsForShop)
);
// [GET]
router.get(
    "/shop/publish",
    verifyToken,
    errorHandler(ShopController.getAllPublishForShop)
);
// [POST]
router.post(
    "/shop/publish",
    verifyToken,
    errorHandler(ShopController.publishProductByShop)
);

// [POST]
router.post(
    "/shop/un-publish",
    verifyToken,
    errorHandler(ShopController.unPublishProductsByShop)
);

router.post(
    "/shop/product",
    verifyToken,
    errorHandler(ShopController.createProduct)
);

router.patch(
    "/shop/product/:id",
    verifyToken,
    errorHandler(ShopController.updateProduct)
);

router.delete(
    "/shop/product/:id",
    verifyToken,
    errorHandler(ShopController.deleteProduct)
);

module.exports = router;
