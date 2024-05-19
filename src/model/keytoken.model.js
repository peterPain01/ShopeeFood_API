"use strict";

const { Schema, model } = require("mongoose");

const keytokenSchema = new Schema({
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
        required: true
    },
});

module.exports = model("Key", keytokenSchema);
