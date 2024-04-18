const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
    fullname: {
        type: String,
    },

    avatar: {
        type: String,
    },

    // need more validate in phone and email
    phone: {
        type: String,
        required: true,
    },

    email: {
        type: String,
    },

    password: {
        type: String,
        require: true,
    },

    // long - lat
    address: {
        type: Array,
        default: [],
    },

    birth_date: {
        type: String,
    },

    gender: {
        type: String,
        enum: ["male", "female"],
    },

    roles: {
        type: Number,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
});

// create index for phone
userSchema.index({ phone: 1 });

module.exports = model("User", userSchema);
