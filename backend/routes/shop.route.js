const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const discountController = require("../controller/discount.C");
const shopStatisticController = require("../controller/shopStatistic.C");
const upload = require("../config/multer");

const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");

router.get(
    "/:shopId/products/search/:keySearch",
    errorHandler(ShopController.searchProductInShop)
);
router.get("/category", errorHandler(ShopController.getShopByCategory));
router.get("/top-rated", errorHandler(ShopController.getTopRatedShops));
router.get("/detail", errorHandler(ShopController.getShopInfo));

// ===== User Registered =====
router.use(verifyToken);
router.post(
    "",
    verifyToken,
    upload.single("image"),
    errorHandler(ShopController.createShop)
);
router.get(
    "/discount",
    verifyToken,
    errorHandler(discountController.getDiscountByShopId)
);

// ===== SHOP =====
router.use(verifyShop);

// ===== PRODUCT =====
router.get("/drafts", errorHandler(ShopController.getAllDraftsForShop));
router.get("/publish", errorHandler(ShopController.getAllPublishForShop));
router.post("/publish", errorHandler(ShopController.publishProductByShop));
router.post(
    "/un-publish",
    errorHandler(ShopController.unPublishProductsByShop)
);
router.post("/product", errorHandler(ShopController.createProduct));
router.patch("/product/:id", errorHandler(ShopController.updateProduct));
router.delete("/product/:id", errorHandler(ShopController.deleteProduct));

// ===== DISCOUNT =====
router.post("/discount", errorHandler(discountController.createDiscount));

router.patch(
    "/discount/:discount_id",
    errorHandler(discountController.updateDiscount)
);

router.delete(
    "/discount/:discount_id",
    errorHandler(discountController.deleteDiscountByShop)
);

// ===== STATISTIC =====
router.get(
    "/statistic/overall",
    errorHandler(shopStatisticController.getStatisticOverall)
);

module.exports = router;
