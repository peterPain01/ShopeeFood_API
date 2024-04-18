const { Schema, model, Types } = require("mongoose");

const shopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 150,
        },
        image: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
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

        avg_rating: {
            type: Number,
        },
        // Lưu trữ các menu các món ăn, mỗi món ăn có các option khác nhau
        // position: string
        // positionMap: string
    },
    {
        timestamps: true,
    }
);

module.exports = model("Shop", shopSchema);
