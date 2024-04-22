const productService = require("../services/product.service");
const orderModel = require("../model/order.model");

module.exports = {
    async countSubPriceOfCart(list_product) {
        let subPrice = 0;

        for (product of list_product) {
            const foundProduct = await productService.getProductById({
                product_id: product.productId,
                select: ["product_discounted_price", "product_original_price"],
            });
            subPrice +=
                foundProduct.product_discounted_price * product.quantity;
        }
        return subPrice;
    },

    async getFeeShip() {},

    async getSubOrderInfo(userId, list_product, note) {
        let subPrice = await this.countSubPriceOfCart(list_product);
        // let shippingFee = await this.getFeeShip(userId, shopId);
        let shippingFee = await this.getFeeShip(userId);

        // plus shippingFee
        let totalPrice = subPrice;

        let subOrderInfo = {
            subPrice,
            shippingFee,
            unit: "VND",
            list_product,
            totalPrice,
        };
        if (note) subOrderInfo = { ...subOrderInfo, note };
        return subOrderInfo;
    },

    async getOrderInfo(userId, shopId, paymentMethod, list_products, note) {
        let subPrice = await this.countSubPriceOfCart(list_products);
        // let shippingFee = await this.getFeeShip(userId, shopId);
        let shippingFee = await this.getFeeShip(userId);

        // plus shippingFee
        let totalPrice = subPrice;

        let orderInfo = {
            subPrice,
            shippingFee,
            unit: "VND",
            list_products,
            totalPrice,
            shopId,
            paymentMethod,
        };
        if (note) orderInfo = { ...orderInfo, note };
        return orderInfo;
    },
    async createOrder(userId, orderInfo) {
        return await orderModel.create({
            order_user: userId,
            order_shop: orderInfo.shopId,
            order_totalPrice: orderInfo.totalPrice,
            order_subPrice: orderInfo.subPrice,
            order_listProducts: orderInfo.list_products,
            order_note: orderInfo.note,
            order_payment_method: orderInfo.paymentMethod,
        });
    },

    async findOrderByUserId(userId, skip = 0, limit = 10) {
        return await orderModel
            .find({
                order_user: userId,
            })
            .skip(skip)
            .limit(limit);
    },
};
