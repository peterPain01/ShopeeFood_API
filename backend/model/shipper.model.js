const { required } = require("joi");
const { Schema, Types, model } = require("mongoose");

const shipperSchema = new Schema(
    {
        avatar: { type: String, required: true },
        fullname: { type: String, required: true },
        phone: { type: String, required: true },
        currentPosition: { type: Object },
        balance: { type: Number, default: 0 },
        revenue: { type: Number },
        license_plate_number: { type: String, required: true },
        vehicle_image: { type: String, required: true },
        shipper_user: { type: Types.ObjectId, required: true, ref: "User" },
        device_token: { type: String },
        isActive: {
            type: Boolean,
            default: "true",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Shipper", shipperSchema);
