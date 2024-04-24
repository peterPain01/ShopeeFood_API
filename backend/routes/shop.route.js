const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");

// [GET]
router.get(
    "/:shopId/products/search/:keySearch",
    errorHandler(ShopController.searchProductInShop)
);

// [GET]
router.get("/category", errorHandler(ShopController.getShopByCategory));

// [GET]
router.get("/top-rated", errorHandler(ShopController.getTopRatedShops));
router.get("/detail", errorHandler(ShopController.getShopInfo));

router.post("", verifyToken, errorHandler(ShopController.createShop));

router.use(verifyToken, verifyShop);
// [POST]

router.get("/drafts", errorHandler(ShopController.getAllDraftsForShop));
// [GET]
router.get("/publish", errorHandler(ShopController.getAllPublishForShop));
// [POST]
router.post("/publish", errorHandler(ShopController.publishProductByShop));

// [POST]
router.post(
    "/un-publish",
    errorHandler(ShopController.unPublishProductsByShop)
);

router.post("/product", errorHandler(ShopController.createProduct));

router.patch("/product/:id", errorHandler(ShopController.updateProduct));

router.delete("/product/:id", errorHandler(ShopController.deleteProduct));

module.exports = router;
