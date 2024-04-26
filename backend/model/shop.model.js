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
            required: true,
        },

        /* 
        address:  
        { 
            address: ....., 
            position:{ 
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
        },

        open_hour: { type: String, required: true },

        close_hour: { type: String, required: true },
        comment: [
            {
                star: { type: Number, required: true },
                title: { type: String, required: true },
                comment_user: { type: Types.ObjectId, required: true, ref: "User" },
                content: { type: String, required: true },
                date: { type: Date, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = model("Shop", shopSchema);
