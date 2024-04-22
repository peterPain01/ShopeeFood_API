const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");

// [GET]
router.get(
    "/shop/:shopId/products/search/:keySearch",
    errorHandler(ShopController.searchProductInShop)
);

// [GET]
router.get("/shop/category", errorHandler(ShopController.getShopByCategory));

// [GET]
router.get("/shop/top-rated", errorHandler(ShopController.getTopRatedShops));


router.use(verifyToken, verifyShop);
// [POST]
router.post("/shop", errorHandler(ShopController.createShop));

router.get("/shop/drafts", errorHandler(ShopController.getAllDraftsForShop));
// [GET]
router.get("/shop/publish", errorHandler(ShopController.getAllPublishForShop));
// [POST]
router.post("/shop/publish", errorHandler(ShopController.publishProductByShop));

// [POST]
router.post(
    "/shop/un-publish",
    errorHandler(ShopController.unPublishProductsByShop)
);

router.post("/shop/product", errorHandler(ShopController.createProduct));

router.patch("/shop/product/:id", errorHandler(ShopController.updateProduct));

router.delete("/shop/product/:id", errorHandler(ShopController.deleteProduct));

module.exports = router;
