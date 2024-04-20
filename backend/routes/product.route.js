const express = require("express");
const router = express.Router();
const productController = require("../controller/product.C");
const errorHandler = require("../utils/errorHandler");

router.get(
    "/product/search/:keySearch",
    errorHandler(productController.searchProduct)
); 

router.get("/products", errorHandler(productController.getAllProducts));
router.get("/products/shop/:id", errorHandler(productController.getAllProductsByShop));
router.get("/product/:id", errorHandler(productController.getProductById));

module.exports = router;
