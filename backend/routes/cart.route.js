const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.C");
const cartRedisController = require("../controller/cartRedis.C");

const { verifyToken } = require("../utils/auth");
const errorHandler = require("../utils/errorHandler");

router.use(verifyToken);

router.get("/", errorHandler(cartController.getCart));

router.post("/", errorHandler(cartController.addProductToCart));

router.delete("", errorHandler(cartController.deleteCart));

router.post("/note", errorHandler(cartController.createNote));

router.patch(
    "/remove/product/:product_id",
    errorHandler(cartController.removeProductFromCart)
);

router.patch(
    "/reduce/product/:product_id",
    errorHandler(cartController.reduceProductQuantity)
);

router.patch(
    "/inc/product/:product_id",
    errorHandler(cartController.incProductQuantity)
);


// ===== REDIS =====
router.post("/redis", errorHandler(cartRedisController.addProductToCart));
router.patch(
    "/redis/remove/product/",
    errorHandler(cartRedisController.removeProductFromCart)
);
router.delete("/redis", errorHandler(cartRedisController.deleteCart));
router.get("/redis", errorHandler(cartRedisController.getCart));


module.exports = router;
