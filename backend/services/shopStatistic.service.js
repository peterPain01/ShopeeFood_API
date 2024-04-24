const orderModel = require("../model/order.model");
const { BadRequest } = require("../modules/CustomError");
const productService = require("./product.service");

module.exports = {
    // Default: current day
    async getStatisticNumberOrder(shopId) {
        try {
            const filter = {
                order_shop: shopId,
                $or: [
                    { order_state: "shipping" },
                    { order_state: "pending" },
                    {
                        $and: [
                            { order_state: "success" },
                            { createdAt: { $eq: new Date() } },
                        ],
                    },
                ],
            };
            const orders = await orderModel.find(filter);

            const pendingOrders = orders.filter(
                (order) => order.order_state === "pending"
            );
            const shippingOrders = orders.filter(
                (order) => order.order_state === "shipping"
            );
            const successOrders = orders.filter(
                (order) => order.order_state === "success"
            );
            const totalRevenue = this.countRevenueByOrders(successOrders);
            const reportRevenue = getRevenueByHour;
            const trendingProducts = this.getTrendingProduct(shopId);
            return {
                numPendingOrder: pendingOrders.length || 0,
                numShippingOrder: shippingOrders.length || 0,
                totalRevenue,
                trendingProducts,
                reportRevenue,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    },

    countRevenueByOrders(successOrders) {
        return successOrders.reduce(
            (sum, order) => sum + order.order_totalPrice,
            0
        );
    },

    // get list san pham ban chay
    async getTrendingProduct(shopId) {
        const trendingProductsOfShop = await productService.getTrendingProduct(
            shopId
        );

        if (!trendingProductsOfShop)
            throw new BadRequest("Shop have not products");

        return trendingProductsOfShop;
    },

    getRevenueByHour(successOrdersInDay) {
        const groupedByHour = {};

        successOrdersInDay.forEach((obj) => {
            const hour = obj.createdAt.getHours();
            if (!groupedByHour[hour]) {
                groupedByHour[hour] = [];
            }
            groupedByHour[hour].push(obj);
        });

        return groupedByHour;
    },
};
