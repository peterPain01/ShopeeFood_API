const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
    role_name: { type: String, required: true },
    role_slug: { type: String, required: true },
});

module.exports = model("Role", roleSchema);
