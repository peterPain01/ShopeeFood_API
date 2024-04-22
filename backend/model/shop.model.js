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
        address: {
            type: Object,
            required: true,
        },

        category: {
            type: [String],
            required: true,
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

        avg_rating: {
            type: Number,
        },

        open_hour: { type: Date, required: true },

        close_hour: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Shop", shopSchema);
