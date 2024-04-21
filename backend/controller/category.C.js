const { InternalServerError } = require("../modules/CustomError");
const categoryModel = require("../model/category.model");
const { getInfoData } = require("../utils");

module.exports = {
    async getAllCategory(req, res) {
        let categories = await categoryModel.find({});
        if (!categories)
            throw new InternalServerError("Error when finding all categories");
        categories = categories.map((category) => {
            return {
                name: category.category_name,
                image: category.category_image,
            };
        });
        console.log(categories);
        res.status(200).json({ message: "Successfully", metadata: categories });
    },
};
