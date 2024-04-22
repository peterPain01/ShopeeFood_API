const express = require("express");
const authRouter = require("./auth.route");
const router = express.Router();
const userRouter = require("./user.route");
const productRouter = require("./product.route");
const shopRouter = require("./shop.route");
const discountRouter = require("./discount.route");
const cartRouter = require("./cart.route");
const flashSaleRouter = require("./flash_sale.route");
const categoryRouter = require("./category.route");
const orderRouter = require("./order.route");
const shipperRouter = require("./shipper.router");

router.use("/auth", authRouter);

router.use(userRouter);
router.use(productRouter);
router.use(discountRouter);
router.use(cartRouter);
router.use(flashSaleRouter);
router.use(categoryRouter);
router.use("/order", orderRouter);
router.use("/shipper", shipperRouter);
router.use(shopRouter);

module.exports = router;
