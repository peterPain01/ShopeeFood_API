const { Types } = require("mongoose");
const { BadRequest, InternalServerError } = require("../modules/CustomError");
const categoryModel = require("../model/category.model");

module.exports = {
    async getAllCategory(req, res) {
        const categories = await categoryModel.find({}).select({ __v: 0 });
        if (!categories)
            throw new InternalServerError("Error when finding all categories");
        res.status(200).json(categories);
    },

};
