const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const discountController = require("../controller/discount.C");
const shopStatisticController = require("../controller/shopStatistic.C");
const { upload } = require("../config/multer");

const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");

const {
    validateCreateShop,
    validateCreateProduct,
    validateUpdateProduct,
} = require("../validation/shopValidation");

router.get(
    "/:shopId/products/search/:keySearch",
    errorHandler(ShopController.searchProductInShop)
);
// checked
router.get("/category", errorHandler(ShopController.getShopByCategory));
// checked
router.get("/top-rated", errorHandler(ShopController.getTopRatedShops));
// checked
router.get("/detail", errorHandler(ShopController.getShopInfo));

// ===== User Registered =====
router.use(verifyToken);

// checked
router.post(
    "",
    [upload.single("image"), validateCreateShop],
    errorHandler(ShopController.createShop)
);
router.get("/discount", errorHandler(discountController.getDiscountByShopId));

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

// checked
router.post(
    "/product",
    [upload.single("product_thumb"), validateCreateProduct],
    errorHandler(ShopController.createProduct)
);
router.patch(
    "/product",
    [upload.single("product_thumb"), validateUpdateProduct],
    errorHandler(ShopController.updateProduct)
);
router.delete("/product", errorHandler(ShopController.deleteProduct));

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
