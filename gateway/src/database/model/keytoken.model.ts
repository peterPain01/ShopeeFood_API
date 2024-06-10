import { timeStamp } from "console";
import { Schema, model, Document } from "mongoose";

interface KeyToken extends Document {
    user: Schema.Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshTokensUsed: Schema.Types.Array;
    refreshToken: string;
}

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "keys";

const keytokenSchema = new Schema<KeyToken>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Schema.Types.Array,
            default: [],
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);

const KeyStoreModel = model<KeyToken>(DOCUMENT_NAME, keytokenSchema);

export { KeyStoreModel };
