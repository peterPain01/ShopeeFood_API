const orderModel = require("../model/order.model");
const shopModel = require("../model/shop.model");
const userModel = require("../model/user.model");
const { BadRequest } = require("../modules/CustomError");
const { unSelectData, getSelectData } = require("../utils");
const commentService = require("./comment.service");
const productService = require("./product.service");
const shopService = require("./shop.service");

module.exports = {
    // Default: current day
    // report revenue: data of current month
    async getStatisticNumberOrder(shopId) {
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);

        try {
            const filter = {
                "order_shop._id": shopId,
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
            const currentTime = new Date();

            const { totalRevenueInMonth, reportRevenueInMonth } =
                await this.revenueInMonth(shopId, currentTime.getMonth());


            const shopObj = await shopService.findShopById(shopId, [
                "totalComments",
                "addresses",
            ]);
            const totalComments = shopObj.totalComments;
            const address = shopObj.addresses[0];

            const trendingProducts = await this.getTrendingProduct(shopId);
            return {
                numPendingOrder: pendingOrders.length || 0,
                numShippingOrder: shippingOrders.length || 0,
                totalRevenueInMonth,
                trendingProducts,
                totalComments,
                address,
                reportRevenue: reportRevenueInMonth || [],
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

    // tinh revenue theo ngay trong thang
    async revenueInMonth(shopId, month, year) {
        if (!year) {
            const date = new Date();
            year = date.getFullYear();
        }

        const numDaysOfMonth = daysInMonth(month + 1, year);

        var start = new Date(year, month, 1);
        var end = new Date(year, month + 1, 0);

        // tim tat ca nhung order da thanh cong trong thang nay

        const filter = {
            "order_shop._id": shopId,
            order_state: "success",
            order_finishAt: { $gte: start, $lt: end },
        };
        const allOrdersSuccessInMonth = await orderModel.find(filter);
        const report = [];
        for (let i = 1; i <= numDaysOfMonth; ++i) {
            const allOrdersInDay = allOrdersSuccessInMonth.filter(
                (order) => order?.order_finishAt?.getDate() === i
            );
            const totalRevenueInDay = allOrdersInDay.reduce(
                (sum, order) => sum + order.order_totalPrice,
                0
            );
            report.push({
                time: i,
                revenue: totalRevenueInDay,
            });
        }
        const totalRevenueInMonth = allOrdersSuccessInMonth.reduce(
            (sum, order) => sum + order.order_totalPrice,
            0
        );
        return { totalRevenueInMonth, reportRevenueInMonth: report };
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

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
