const { Schema, Types, model } = require("mongoose");

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },

    product_category: {
        type: Types.ObjectId,
        ref: "Category",
        required: true,
    },
    product_discounted_price: { type: Number, require: true },
    product_original_price: { type: Number, require: true },

    product_shop: { type: Types.ObjectId, ref: "Shop", required: true },
    product_sold: { type: Number, default: 0 },
    product_like: { type: Number, default: 0 },

    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
});

// create index for search
productSchema.index({ product_name: "text", product_description: "text" });

module.exports = model("Product", productSchema);
