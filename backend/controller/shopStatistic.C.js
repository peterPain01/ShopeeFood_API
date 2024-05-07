const shopStatisticService = require("../services/shopStatistic.service");
/* 
    So don hang dang giao (da dua cho shipper)
        + 1 router chi tiet , 1 chi lay so 
    So don hang dang chuan bi (Dang chuan bi mon)
        + 1 router chi tiet , 1 chi lay so 
    Tong doanh thu 
        + Ngay 
        + Tuan 
        + Thang 
        + Nam 
    Review ve shop 
    
*/
module.exports = {
    async getStatisticOverall(req, res) {
        const { userId: shopId } = req.user;

        const {
            numPendingOrder,
            numShippingOrder,
            totalRevenueInMonth,
            trendingProducts,
            reportRevenue,
            totalComments,
            address,
        } = await shopStatisticService.getStatisticNumberOrder(shopId);
        res.status(200).json({
            message: "Success",
            metadata: {
                numPendingOrder,
                numShippingOrder,
                totalRevenueInMonth,
                trendingProducts,
                reportRevenue,
                totalComments,
                address,
            },
        });
    },

    async getAllShippingOrder(req, res) {
        const { userId: shopId } = req.user;
        const select = ["order_totalPrice", "order_user"];
        const orders = await shopStatisticService.getShippingOrder(
            shopId,
            [],
            select
        );
        res.status(200).json({ message: "Success", metadata: orders || [] });
    },

    async getAllPendingOrder(req, res) {
        const { userId: shopId } = req.user;
        const select = ["order_totalPrice", "order_user"];

        const orders = await shopStatisticService.getPendingOrder(
            shopId,
            [],
            select
        );

        res.status(200).json({ message: "Success", metadata: orders || [] });
    },

    // get revenue specific time
    // San phan ban chay trong tuan nay
};
