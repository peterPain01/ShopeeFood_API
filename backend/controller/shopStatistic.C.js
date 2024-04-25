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
            totalRevenue: totalRevenueToday,
            trendingProducts,
            reportRevenue,
        } = await shopStatisticService.getStatisticNumberOrder(shopId);

        res.status(200).json({
            message: "Success",
            metadata: {
                numPendingOrder,
                numShippingOrder,
                totalRevenueToday,
                trendingProducts,
                reportRevenue,
            },
        });
    },

    // get all running order 
    async getAllRunningOrder(req, res) {
        return
    },
    
    // get all pending order 
    async getAllPendingOrder(req, res) {},
    // get revenue specific time
    // San phan ban chay trong tuan nay
};
