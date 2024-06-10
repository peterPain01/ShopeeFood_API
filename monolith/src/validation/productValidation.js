const Joi = require("joi");
const { BadRequest } = require("../modules/CustomError");
const { deleteFileByRelativePath } = require("../utils");
const { isValidObjectId } = require("mongoose");

const productSchema = Joi.object({
    product_name: Joi.string().required(),
    product_description: Joi.string(),
    product_category: Joi.string().required(), // ObjectId
    product_original_price: Joi.number().required(),
    product_discounted_price: Joi.number(),
});

const productUpdateSchema = Joi.object({
    product_name: Joi.string(),
    product_description: Joi.string(),
    product_category: Joi.string(), // ObjectId
    product_original_price: Joi.number(),
    product_discounted_price: Joi.number(),
});

async function validateCreateProduct(req, res, next) {
    const data = req.body;
    console.log(req.file);
    const path_file_stored = req?.file?.path || "";
    if (!path_file_stored)
        return next(
            new BadRequest("Product need image in field product_thumb")
        );

    if (!data.product_discounted_price)
        data.product_discounted_price = data.product_original_price;

    try {
        await productSchema.validateAsync(data);
        if (!isValidObjectId(data.product_category))
            return next(
                new BadRequest("Category of Product is invalid ObjectId")
            );
    } catch (error) {
        deleteFileByRelativePath(path_file_stored);
        return next(
            new BadRequest(error?.details?.at(0)?.message || error.message)
        );
    }
    next();
}

async function validateUpdateProduct(req, res, next) {
    const data = req.body;
    let path_file_stored = "";
    if (req?.file) path_file_stored = req.file.path;

    try {
        await productUpdateSchema.validateAsync(data);
        if (data.product_category && !isValidObjectId(data.product_category))
            return next(
                new BadRequest("Category of Product is invalid ObjectId")
            );
    } catch (error) {
        deleteFileByRelativePath(path_file_stored);
        return next(new BadRequest(error.details[0].message || error.message));
    }
    next();
}

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
};
