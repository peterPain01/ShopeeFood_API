const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new Schema(
    {
        order_state: {
            type: String,
            enum: ["pending", "shipping", "success", "failure"],
            default: "pending",
        },
        order_user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        // store shop id and shop address
        order_shop: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        order_shipper: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        order_totalPrice: { type: Number, required: true },
        order_subPrice: { type: Number, required: true },
        order_listProducts: { type: Array, required: true },
        order_discountUsed: { types: Array },
        order_note: String,
        order_paymentMethod: {
            type: String,
            enum: ["cash", "vnpay"],
            required: true,
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
