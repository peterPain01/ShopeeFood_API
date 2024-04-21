const { Api404Error, InternalServerError } = require("../modules/CustomError");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
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
            // shopId,
            foundCart.cart_products
        );
        if (!orderInfo) throw new InternalServerError("Create Order Failure");
        res.status(200).json({
            message: "Order Successful Created",
            metadata: orderInfo,
        });
    },

    async checkout(req, res) {
        const { userId } = req.user;

        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products)
            throw new Api404Error("Cart Not Found");

        const orderInfo = await orderService.getSubOrderInfo(
            userId,
            // shopId,
            foundCart.cart_products
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");
        const createdOrder = await orderService.createOrder(userId);
        if (!createdOrder)
            throw new InternalServerError("Error when create order info");
        res.status(201).json({
            message: "Order Successful Created",
            metadata: createdOrder,
        });
    },
};
