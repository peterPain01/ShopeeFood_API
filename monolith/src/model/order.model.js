const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const userOrderSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    fullname: { type: String },
    phone: { type: String, required: true },
    address: { type: Object, required: true },
});

const shopOrderSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, ref: "Shop" },
    name: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: Object },
});

const orderSchema = new Schema(
    {
        order_state: {
            type: String,
            enum: ["pending", "shipping", "success", "failure"],
            default: "pending",
        },
        order_user: {
            type: userOrderSchema,
            required: true,
        },
        order_shop: {
            type: shopOrderSchema,
            required: true,
        },
        order_shipper: {
            type: Schema.Types.ObjectId,
            ref: "Shipper",
        },
        order_shippingFee: {
            type: Number,
            required: true,
        },
        order_shipperReceive: {
            type: Number,
            required: true,
        },
        order_totalPrice: { type: Number, required: true },
        order_subPrice: { type: Number, required: true },
        order_listProducts: { type: Array, required: true },
        order_totalItems: { type: Number, required: true },
        // order_discountUsed: { types: Array },
        order_note: String,
        order_paymentMethod: {
            type: String,
            enum: ["cash", "vnpay", "zalopay"],
            required: true,
        },
        order_finishAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

orderSchema.pre("save", function (next) {
    const currentDate = new Date();
    const currentTimezone = "Asia/Ho_Chi_Minh";
    const currentUserDate = moment(currentDate)
        .tz(currentTimezone)
        .format("YYYY-MM-DD HH:mm:ss");

    this.updatedAt = currentUserDate;
    if (!this.createdAt) {
        this.createdAt = currentUserDate;
    }
    next();
});
module.exports = model("Order", orderSchema);
