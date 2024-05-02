const shipperModel = require("../model/shipper.model");

module.exports = {
    async createShipper() {},

    async getAllShippers({ filter = {}, skip = 0, limit = 50, sort = {} }) {
        const sortBy = sort ? sort : { updatedAt: 1 };
        return await shipperModel
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit);
    },

    async findShipperById(shipperId) {
        return await shipperModel.findById(shipperId);
    },

    async saveDeviceToken(token, shipperId) {
        return await shipperModel.findByIdAndUpdate(shipperId, {
            $set: { device_token: token },
        });
    },
};
