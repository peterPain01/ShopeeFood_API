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

    async getSubOrderInfo(userId, list_product) {
        let subPrice = await this.countSubPriceOfCart(list_product);
        // let shippingFee = await this.getFeeShip(userId, shopId);
        let shippingFee = await this.getFeeShip(userId);
        let total = subPrice + shippingFee ? shippingFee : 0;
        return { subPrice, shippingFee, unit: "VND", list_product, totalPrice };
    },

    async createOrder(userId) {
        const orderInfo = await this.getSubOrderInfo();
        return await orderModel.create({
            order_user: userId,
            order_totalPrice: orderInfo.totalPrice,
            order_subPrice: orderInfo.subPrice,
            order_listProducts: orderInfo.list_product,
            // order_discountUsed:
        });
    },
};
