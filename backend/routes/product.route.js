const express = require("express");
const router = express.Router();
const productController = require("../controller/product.C");
const errorHandler = require("../utils/errorHandler");

router.get("/search/:keySearch", errorHandler(productController.searchProduct));

router.get("/all", errorHandler(productController.getAllProducts));
router.get("/all/shop", errorHandler(productController.getAllProductsByShop));

router.get("/:productId", errorHandler(productController.getProductById));

module.exports = router;
