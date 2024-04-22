const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    order_state: { type: String, enum: ["pending", "success", "failure"] },
    order_user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    order_delivery_man: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    order_totalPrice: { type: Number, required: true },
    order_subPrice: { type: Number, required: true },
    order_listProducts: { type: Array, required: true },
    order_discountUsed: { types: Array },
    order_note: String,
    order_payment_method: {
        type: String,
        enum: ["cash", "vnpay"],
        required: true,
    },
});

module.exports = model("Order", orderSchema);
