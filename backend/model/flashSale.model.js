const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop', 
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    discountedProducts: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        discountedPrice: {
            type: Number,
            required: true
        },
        quantityAvailable: {
            type: Number,
            required: true
        }
    }]

    // fixe_open_time 
});

const FlashSale = mongoose.model('FlashSale', flashSaleSchema);

module.exports = FlashSale;
