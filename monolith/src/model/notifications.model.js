"use strict";
const { Schema, model, Types } = require("mongoose");
const { type } = require("os");

const DOCUMENT_NAME = "notification";
const COLLECTION_NAME = "notifications";

const notificationSchema = new Schema(
    {
        notify_channel: {
            type: String,
            enum: ["email", "sms", "push"],
            default: "push",
        },
        notify_type: {
            type: String,
            enum: ["ORDER-001", "PROMOTION-001", "PRODUCT-001", "SHOP-001"],
        },
        notify_senderId: {
            type: String,
            required: true,
        },
        notify_receiveId: {
            type: Types.ObjectId,
            required: true,
        },
        notify_content: { type: String },
        notify_options: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
