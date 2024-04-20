const mongoose = require("mongoose");

const flashSaleSchema = new mongoose.Schema({
    flash_shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    flash_startTime: {
        type: Date,
        required: true,
    },
    flash_endTime: {
        type: Date,
        required: true,
    },
    
    flash_discountedProducts: {
        type: Array,
        required: true,
    },

    // fixed_open_time
});

const FlashSale = mongoose.model("FlashSale", flashSaleSchema);

module.exports = FlashSale;
