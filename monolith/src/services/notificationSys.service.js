"use strict";

const notificationsModel = require("../model/notifications.model");

class NotificationSystem {
    static async pushNotifyToSystem({
        type = "SHOP-001",
        channel = "push",
        receiveId = 1,
        senderId = 1,
        options = {},
    }) {
        let notify_content = "";
        if (type === "SHOP-001") {
        } else if (type === "PROMOTION-001") {
        }

        const newNotify = await notificationsModel.create({
            notify_type: type,
            notify_content,
            notify_senderId: senderId,
            notify_receiveId: receiveId,
            notify_options: options,
        });

        return newNotify;
    }

    static async listNotifyByUser({ userId = 1, type = "ALL", isRead = 0 }) {
        const match = { notify_receiveId: userId };
        if (type !== "ALL") {
            match["notify_type"] = type;
        }

        let notify_content;
        if (type === "ORDER-001") notify_content = "You have a new order";
        else if (type === "PROMOTION-001")
            notify_content = "You have a new voucher";
        else if (type === "PRODUCT-001")
            notify_content = "Shop @@@ created new product";

        return await notificationsModel.aggregate([
            {
                $match: match,
            },
            {
                $project: {
                    notify_type: 1,
                    notify_senderId: 1,
                    notify_receiveId: 1,
                    notify_content: 1,
                    notify_option: 1,
                    createAt: 1,
                },
            },
        ]);
    }
}

module.exports = NotificationSystem;
