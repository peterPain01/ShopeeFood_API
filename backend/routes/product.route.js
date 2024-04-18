const express = require("express");
const router = express.Router();
const productController = require("../controller/product.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");

router.get(
    "/product/search/:keySearch",
    errorHandler(productController.searchProduct)
); 
router.get("/products", errorHandler(productController.getAllProducts));
router.get("/product/:id", errorHandler(productController.getProductById));
router.get("/product/shop/:id", errorHandler(productController.getAllProductsByShop));

module.exports = router;
