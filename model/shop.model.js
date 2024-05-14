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
        avatar: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        /* 
        address:  
        { 
            type: ....., 
            street
            latlng:{ 
                lat: .... ,
                lng: .......
            } 
         }
        */
        addresses: {
            type: [Object],
            required: true,
        },
        category: [{ type: Types.ObjectId, ref: "Category", required: true }],

        status: {
            type: String,
            enum: ["open", "close"],
            default: "close",
        },

        owner: { type: Schema.Types.ObjectId, ref: "User" },

        avg_rating: {
            type: Number,
            default: 0,
        },

        open_hour: { type: String, required: true },

        close_hour: { type: String, required: true },
        user_liked: [{ type: Types.ObjectId, ref: "User" }],
        device_token: { type: String },
        totalComments: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Shop", shopSchema);
