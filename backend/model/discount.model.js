const { Schema, Types, model } = require("mongoose");

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_code: { type: String, required: true },
    discount_type: {
        type: String,
        enum: ["fix_amount", "percentage"],
        default: "fix_amount",
    },
    discount_value: { type: Number, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },

    discount_usage_limit: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true, default: 0 },
    discount_users_used: { type: Array, required: true, default: [] },
    discount_max_uses_per_user: { type: Number, required: true },

    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Types.ObjectId, ref: "Shop", required: true },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ["all", "specific"],
        default: "all",
    },

    /*  if applies_tp is specific 
    -> shop must be give list of product that apply discount 
    */
    discount_products_id: { type: Array, default: [] },
});

module.exports = model("Discount", discountSchema);
