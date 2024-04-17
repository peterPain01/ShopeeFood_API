const express = require("express");
const router = express.Router();
const ShopController = require("../controller/shop.C");
const errorHandler = require("../utils/errorHandler");
const authUtils = require("../utils/auth");
const { verifyToken } = require("../utils/auth");
// Authenticate

router.post("/shop", verifyToken, errorHandler(ShopController.createShop));
router.get(
    "/shop/drafts",
    verifyToken,
    errorHandler(ShopController.getAllDraftsForShop)
);
router.get(
    "/shop/publish",
    verifyToken,
    errorHandler(ShopController.getAllPublishForShop)
);
router.post(
    "/shop/publish",
    verifyToken,
    errorHandler(ShopController.publishProductByShop)
);
router.post(
    "/shop/un-publish",
    verifyToken,
    errorHandler(ShopController.unPublishProductByShop)
);

module.exports = router;
