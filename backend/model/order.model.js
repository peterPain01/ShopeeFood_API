const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    order_user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    order_totalPrice: { type: Number, required: true },
    order_subPrice: { type: Number, required: true },
    order_listProducts: { type: Array, required: true },
    order_discountUsed: { types: Array },
});

module.exports = model("Order", orderSchema);
