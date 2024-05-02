const {
    Api404Error,
    InternalServerError,
    BadRequest,
} = require("../modules/CustomError");
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
        const { type, latlng, street } = req.body;
        if (!type || !latlng || !street)
            throw new BadRequest(`Missing type | latlng | street in req.body`);

        const address = {
            type,
            latlng,
            street,
        };
        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products.length)
            throw new Api404Error("Cart Not Found Or Empty");

        const paymentMethod = "cash";
        const shopId = foundCart.cart_shop;

        const orderInfo = await orderService.getOrderInfo(
            userId,
            shopId,
            address,
            foundCart.cart_count_product,
            paymentMethod,
            foundCart.cart_products,
            foundCart.cart_note
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");

        const createdOrder = await orderService.createOrder(orderInfo);

        if (!createdOrder)
            throw new InternalServerError("Error when create order info");

        let metadata = createdOrder;
        if (foundCart.note)
            metadata = { ...createdOrder, note: foundCart.note };

        res.status(201).json({
            message: "Order Successful Created",
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

    async getOnGoingOrder(req, res) {
        const { userId } = req.user;
        const select = [
            "_id",
            "order_shop",
            "order_totalPrice",
            "order_totalItems",
            "order_listProducts",
        ];
        const orders = await orderService.getAllOnGoingOrder(userId, select);

        res.status(200).json({ message: "Success", metadata: orders || {} });
    },

    async getSuccessOrder(req, res) {
        const { userId } = req.user;
        const select = [
            "_id",
            "order_shop",
            "order_totalPrice",
            "order_totalItems",
            "order_listProducts",
        ];
        const orders = await orderService.getAllSuccessOrderOverview(
            userId,
            select
        );
        res.status(200).json({ message: "Success", metadata: orders || {} });
    },
};
