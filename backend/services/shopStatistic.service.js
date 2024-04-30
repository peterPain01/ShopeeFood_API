const orderModel = require("../model/order.model");
const userModel = require("../model/user.model");
const { BadRequest } = require("../modules/CustomError");
const { unSelectData, getSelectData } = require("../utils");
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
        return (
            (await productService.getTrendingProduct(shopId, [
                "product_shop",
            ])) || []
        );
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

    async getPendingOrder(shopId, unSelect = [], select = []) {
        const orders = await orderModel
            .find({
                "order_shop._id": shopId,
                order_state: "pending",
            })
            .select({ ...unSelectData(unSelect), ...getSelectData(select) });
        return orders;
    },

    async getShippingOrder(shopId, unSelect = {}, select = {}) {
        return await orderModel
            .find({
                "order_shop._id": shopId,
                order_state: "shipping",
            })
            .select({ ...unSelectData(unSelect), ...getSelectData(select) });
    },
};
