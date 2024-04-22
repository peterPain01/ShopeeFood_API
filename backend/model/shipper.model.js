const { Schema, Types,model } = require("mongoose");

const shipperSchema = new Schema(
    {
        avatar: { type: String, required: true },
        currentPosition: { type: Object },
        balance: { type: Number, default: 0 },
        license_plate_number: { type: String, required: true },
        vehicle_image: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Shipper", shipperSchema);
