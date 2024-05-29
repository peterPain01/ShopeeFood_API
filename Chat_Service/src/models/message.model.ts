import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "message";
const COLLECTION_NAME = "messages";

const messageSchema = new Schema(
    {
        content: { type: String, required: true, trim: true },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        shipper: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        
        admin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const Message = model(DOCUMENT_NAME, messageSchema);
module.exports = Message;
