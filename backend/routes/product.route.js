const express = require("express");
const router = express.Router();
const productController = require("../controller/Product.C");
const errorHandler = require("../utils/errorHandler");
const authRouter = require("./auth.route");
const authUtils = require("../utils/auth");
const { verifyToken } = require("../utils/auth");

router.get(
    "/product/search/:keySearch",
    errorHandler(productController.searchProduct)
);
router.get("/products", errorHandler(productController.getAllProducts));
router.get("/product/:id", errorHandler(productController.getProductById));

// ======== Authenticate ========

router.post("/product", verifyToken, errorHandler(productController.createProduct));
router.patch("/product/:id", verifyToken, errorHandler(productController.updateProduct));
router.delete("/product",verifyToken,  errorHandler(productController.deleteProduct));

module.exports = router;
