import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "supporter";
const COLLECTION_NAME = "supporters";

// TODO: move to Redis instead
const supporterSchema = new Schema(
    {
        id: {
            type: Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const Supporter = model(DOCUMENT_NAME, supporterSchema);
export default Supporter;
