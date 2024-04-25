const orderModel = require("../model/order.model");
const { BadRequest } = require("../modules/CustomError");
const productService = require("./product.service");

module.exports = {
    // Default: current day
    async getStatisticNumberOrder(shopId) {
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);
        
        try {
            const filter = {
                order_shop: shopId,
                $or: [
                    { order_state: "shipping" },
                    { order_state: "pending" },
                    {
                        $and: [
                            { order_state: "success" },
                            {
                                createdAt: {
                                    $gte: currentDate,
                                    $lt: new Date(
                                        currentDate.getTime() +
                                            24 * 60 * 60 * 1000
                                    ),
                                },
                            },
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
            // const reportRevenue = getRevenueByHour(successOrders);
            console.log(orders);

            const trendingProducts = await this.getTrendingProduct(shopId);
            return {
                numPendingOrder: pendingOrders.length || 0,
                numShippingOrder: shippingOrders.length || 0,
                totalRevenue,
                trendingProducts,
                reportRevenue: [],
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
        return (await productService.getTrendingProduct(shopId)) || null;
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
