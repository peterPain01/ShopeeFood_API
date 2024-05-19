const { Schema, model, Types } = require("mongoose");
const transactionSchema = new Schema({
    shipperId: { type: Types.ObjectId },
    app_trans_id: String,
});

module.exports = model("Transaction", transactionSchema);
