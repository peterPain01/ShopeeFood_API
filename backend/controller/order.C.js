const { Api404Error, InternalServerError } = require("../modules/CustomError");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
const paymentService = require("../services/payment.service");

module.exports = {
    /* 
        originalPrice // gia chua giam 
        totalPrice  // gia da giam 
        discountPrice // originalPrice - totalPrice
        // get user address and count fee 
        feeShip 
    */
    async checkoutReview(req, res) {
        const { userId } = req.user;

        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products)
            throw new Api404Error("Cart Not Found");

        const orderInfo = await orderService.getSubOrderInfo(
            userId,
            foundCart.cart_products,
            foundCart.cart_note
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");
        res.status(200).json({
            message: "Review Order Info",
            metadata: orderInfo,
        });
    },

    async checkoutCash(req, res) {
        const { userId } = req.user;

        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products.length)
            throw new Api404Error("Cart Not Found Or Empty");

        const paymentMethod = "cash";
        const shopId = foundCart.cart_shop;

        const orderInfo = await orderService.getOrderInfo(
            userId,
            shopId,
            paymentMethod,
            foundCart.cart_products,
            foundCart.cart_note
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");

        const createdOrder = await orderService.createOrder(userId, orderInfo);

        if (!createdOrder)
            throw new InternalServerError("Error when create order info");

        let metadata = createdOrder;
        if (foundCart.note)
            metadata = { ...createdOrder, note: foundCart.note };

        res.status(201).json({
            message: "Order Successful Created",
            metadata,
        });
    },

    async handleVnpResult(req, res) {
        const result = paymentService.getVnPayResult(req);
        res.status(200).send(result);
    },

    async getVnpUrl(req, res) {
        const VnpUrl = paymentService.getVnpUrl(req);
        res.status(200).send(VnpUrl);
    },
};
