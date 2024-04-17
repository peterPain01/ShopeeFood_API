const { Schema, model, Types } = require("mongoose");

const shopSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150,
    },

    description: {
        type: String,
    },

    phone: {
        type: String,
    },

    address: {
        type: String,
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },

    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },

    owner: { type: Schema.Types.ObjectId, ref: "User" },

    roles: {
        type: Array,
        default: [],
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at: {
        type: Date,
        default: Date.now,
    },

    avg_rating: {
        type: Number, 
    },
    // Lưu trữ các menu các món ăn, mỗi món ăn có các option khác nhau
    //     image: string
    // position: string
    // positionMap: string
});

module.exports = model("Shop", shopSchema);
