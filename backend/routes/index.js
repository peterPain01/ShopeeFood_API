const express = require("express");
const authRouter = require("./auth.route");
const router = express.Router();
const userRouter = require("./user.route");
const productRouter = require("./product.route");
const shopRouter = require("./shop.route");
const discountRouter = require("./discount.route");
const cartRouter = require("./cart.route");

router.use(authRouter);

router.use(userRouter);
router.use(shopRouter);
router.use(productRouter);
router.use(discountRouter);
router.use(cartRouter);

module.exports = router;
