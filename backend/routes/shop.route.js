const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const discountController = require("../controller/discount.C");
const shopStatisticController = require("../controller/shopStatistic.C");
const { upload, uploadShop } = require("../config/multer");

const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");
const {
    validateCreateShop,
    validateUpdateShop,
    validateGetShopInfo
} = require("../validation/shopValidation");
const {
    validateCreateProduct,
    validateUpdateProduct,
} = require("../validation/productValidation");

router.get(
    "/:shopId/products/search/:keySearch",
    errorHandler(ShopController.searchProductInShop)
);
router.get("/category", errorHandler(ShopController.getShopByCategory));
router.get("/top-rated", errorHandler(ShopController.getTopRatedShops));
router.get("/detail", validateGetShopInfo, errorHandler(ShopController.getShopInfo));
router.get("/related", errorHandler(ShopController.getShopByKeySearch));
router.get("/suggest/", errorHandler(ShopController.getRelatedKey));

// ===== User Registered =====
router.use(verifyToken);

router.post(
    "",
    uploadShop.fields([
        { name: "avatar", maxCount: 1 },
        { name: "image", maxCount: 1 },
    ]),
    validateCreateShop,
    errorHandler(ShopController.createShop)
);
router.get("/discount", errorHandler(discountController.getDiscountByShopId));

// ===== SHOP =====
router.use(verifyShop);
router.post(
    "/update",
    [upload.single("image"), validateUpdateShop],
    errorHandler(ShopController.updateShop)
);

// ===== PRODUCT =====
router.get("/drafts", errorHandler(ShopController.getAllDraftsForShop));
router.get("/publish", errorHandler(ShopController.getAllPublishForShop));

router.post("/publish", errorHandler(ShopController.publishProductByShop));
router.post(
    "/un-publish",
    errorHandler(ShopController.unPublishProductsByShop)
);

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

router.get(
    "/statistic/order/shipping",
    errorHandler(shopStatisticController.getAllShippingOrder)
);

router.get(
    "/statistic/order/pending",
    errorHandler(shopStatisticController.getAllPendingOrder)
);

module.exports = router;
