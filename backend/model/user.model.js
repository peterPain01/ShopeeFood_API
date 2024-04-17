const { Schema, model, Types } = require("mongoose");
const { validate } = require("./shop.model");

function validateGender(value) {
    return ["male", "female"].includes(value);
}

const userSchema = new Schema({
    fullname: {
        type: String,
    },

    avatar: { 
        type: String, 
    }, 
    // add validate
    email: {
        type: String,
        // unique: true,
    },

    // add validate
    phone: {
        type: String,
        unique: true,
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
        validate: {
            validator: validateGender,
            message: 'Gender must be either "male" or "female"',
        },
    },
    
    roles: {
        type: Number,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
});
module.exports = model("User", userSchema);
