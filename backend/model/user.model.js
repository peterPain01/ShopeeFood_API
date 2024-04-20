const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
    fullname: { type: String },
    avatar: { type: String },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: { type: String, required: [true] },

    addresses: {
        type: Array,
        default: [],
    },
    birth_date: { type: Date },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    roles: { type: Number },
    bio: { type: String },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// create index for phone
userSchema.index({ phone: 1 });

userSchema.pre("validate", { document: true }, function (next) {
    if (!this.phone && !this.email)
        this.invalidate("Phone | Email one of the fields required.");
    else next();
});

module.exports = model("User", userSchema);
