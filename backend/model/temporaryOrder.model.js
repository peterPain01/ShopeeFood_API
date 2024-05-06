const { Schema, Types, model } = require("mongoose");

const temporaryOrderSchema = new Schema({
    shipper_id: { type: Types.ObjectId, ref: "Shipper" },
    order_id: { type: Types.ObjectId, ref: "Order" },
    order_info: { type: Object },
    app_trans_id: { type: String },
    time: { type: Date, default: Date.now, index: { expires: 120 } },
});

module.exports = model("tempOrder", temporaryOrderSchema);
