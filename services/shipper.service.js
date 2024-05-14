const shipperModel = require("../model/shipper.model");
const { BadRequest } = require("../modules/CustomError");
const notificationService = require("../services/notification.service");
const { getSelectData, unSelectData } = require("../utils");

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

    async findShipperById(shipperId, select = [], unSelect = []) {
        return await shipperModel
            .findById(shipperId)
            .select({ ...getSelectData(select), ...unSelectData(unSelect) });
    },

    async saveDeviceToken(token, shipperId) {
        return await shipperModel.findByIdAndUpdate(shipperId, {
            $set: { device_token: token },
        });
    },

    // find shipper and send notification
    // i just pick a random shipper 😭
    // => Improve it with better algorithms
    async findShipperNearest(lat, lng) {
        // them dieu kien status la "active"
        const shippers = await shipperModel.aggregate([
            { $sample: { size: 1 } },
        ]);
        return shippers.at(0);
    },

    // select chi tra ra dung fields token khong {_id, token}
    async sendNotificationToShipper(shipperId, body) {
        const tokenObject = await shipperModel
            .findById(shipperId)
            .select({ device_token: 1, _id: 0, isActive: 1 })
            .lean();
        const tokenDevice = tokenObject.device_token;
        const isActive = tokenObject.isActive;
        console.log("tokenDevice::", tokenDevice);
        if (!tokenDevice || isActive === false) return null;

        const title = "New Order";
        try {
            const response = await notificationService.sendNotifyToDevice(
                title,
                body,
                tokenDevice
            );
            console.log("Successful send to shipper", response);
        } catch (err) {
            console.log(err.message);
            return null;
        }
        return true;
    },

    async checkBalanceShipperWithOrder(shipperId, balanceNeedToConfirm) {
        const shipperBalance = await this.findShipperById(shipperId, [
            "balance",
        ]);
        console.log("shipperBalance::::", shipperBalance);
        if (shipperBalance.balance < balanceNeedToConfirm) return false;
        return true;
    },

    async subtractBalanceOfShipper(shipperId, amount) {
        return await shipperModel.findByIdAndUpdate(shipperId, {
            $inc: { balance: -amount },
        });
    },

    async setState(shipperId, isActive) {
        return await shipperModel.findByIdAndUpdate(
            shipperId,
            {
                $set: { isActive },
            },
            { new: true }
        );
    },
};
