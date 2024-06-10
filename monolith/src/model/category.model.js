const { Schema, model, Types } = require("mongoose");
const categorySchema = new Schema({
    category_name: {
        type: String,
        enum: ["Hot Dog", "Pizza", "Burger", "Noodles"],
    },

    category_image: {
        type: String,
        require: true,
    },
});

module.exports = model("Category", categorySchema);
