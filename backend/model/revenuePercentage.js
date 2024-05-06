const { Schema, model } = require("mongoose");
const db = require("../services/initMongoDatabase");
const { conformsTo } = require("lodash");
const revenuePercentageSchema = new Schema({
    shipper: { type: Number, default: 20 },
    shop: { type: Number, default: 10 },
});

revenuePercentageSchema.pre("save", async (next) => {
    try {
        const existingDocumentCount = await revenuePercentage.countDocuments(
            {}
        );
        if (existingDocumentCount > 0) {
            throw new Error("Only one document is allowed in the collection.");
        }
        next();
    } catch (error) {
        next(error);
    }
});

const revenuePercentage = model("RevenuePercentage", revenuePercentageSchema);
module.exports = {
    revenuePercentage,
};
