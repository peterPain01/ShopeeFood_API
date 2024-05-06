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
const adminRouter = require("./admin.route");
const commentRouter = require("./comment.route");
const stateRouter = require("./state.router");
const errorHandler = require("../utils/errorHandler");
const notificationService = require("../services/notification.service");

router.use("/auth", authRouter);
router.use("/state", stateRouter);
router.use("/order", orderRouter);
router.use("/shipper", shipperRouter);
router.use("/admin", adminRouter);
router.use("/shop", shopRouter);
router.use("/product", productRouter);
router.use("/discount", discountRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use("/comment", commentRouter);
router.use(flashSaleRouter);
router.use(categoryRouter);

router.post(
    "/notify",
    errorHandler(notificationService.sendConfirmNotifyToShipper)
);
module.exports = router;
