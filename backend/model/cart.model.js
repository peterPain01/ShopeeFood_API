const { Schema, model, Types } = require("mongoose");
const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "failed", "pending"],
            default: "active",
        },

        cart_products: { type: Array, required: true, default: [] },
        cart_count_product: { type: Number, default: 0 },
        cart_userId: { type: Types.ObjectId, required: true, ref: "User" },
    },
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
        },
    }
);

module.exports = model("Cart", cartSchema);
