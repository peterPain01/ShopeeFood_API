const { Schema, Types, model } = require("mongoose");

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,

    product_category: {
        type: String,
        required: true,
        enum: ["MilkTea", "Rice", "Noodles"],
    },
    product_discounted_price: { type: Number, require: true },
    product_original_price: { type: Number, require: true },
    
    product_shop: { type: Types.ObjectId, ref: "Shop", required: true },
    product_sold: { type: Number, default: 0 },
    product_like: { type: Number, default: 0 },

    // is this effective way to store comment ?
    product_comments: [
        {
            user: { type: Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
});

// create index for search
productSchema.index({ product_name: "text", product_description: "text" });

module.exports = model("Product", productSchema);
