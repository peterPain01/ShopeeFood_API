const { Schema, model, Types } = require("mongoose");
const adminSchema = new Schema({
    balance: { type: Number, default: 0 },
    numsShop: { type: Number, default: 0 },
});

module.exports = model("Admin", adminSchema);
