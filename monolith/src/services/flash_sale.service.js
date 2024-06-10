const FlashSale = require('../model/flashSale.model')
const { Types } = require("mongoose");

module.exports = {
    async findByShopId(shopId) {
        const filter = {
            flash_shopId: new Types.ObjectId(shopId),
        };
        return await FlashSale.find(filter);
    },
};
