const Joi = require("joi");
const { deleteFileByRelativePath } = require("../utils/index");
const { BadRequest } = require("../modules/CustomError");
const { Types, isValidObjectId } = require("mongoose");

const addressSchema = Joi.object({
    type: Joi.string().valid("Company", "Home").required(),
    street: Joi.string().required(),
    latlng: Joi.object({
        lat: Joi.string().required(),
        lng: Joi.string().required(),
    }).required(),
});

const shopSchema = Joi.object({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().required().trim().strict(),
    phone: Joi.string().required().trim().strict(),
    addresses: Joi.array().items(addressSchema).required(),
    category: Joi.array(),
    status: Joi.string(),
    open_hour: Joi.string().required(),
    close_hour: Joi.string().required(),
}).options({ abortEarly: false });

const productSchema = Joi.object({
    product_name: Joi.string().required(),
    product_description: Joi.string(),
    product_category: Joi.string().required(),
    product_original_price: Joi.number().required(),
    product_discounted_price: Joi.number().required(),
});

async function validateCreateProduct(req, res, next) {
    const data = req.body;
    const path_file_stored = req.file.path;
    try {
        await productSchema.validateAsync(data);
        if (!isValidObjectId(data.product_category))
            return next(
                new BadRequest("Category of Product is invalid ObjectId")
            );
    } catch (error) {
        deleteFileByRelativePath(path_file_stored);
        return next(new BadRequest(error.details[0].message || error.message));
    }
    next();
}

async function validateCreateShop(req, res, next) {
    const data = req.body;
    // remove it on Front end side
    const plainObject = JSON.parse(JSON.stringify(data));
    if (!req.file) return next(new BadRequest("Missing image for shop"));
    const path_file_stored = req.file.path;

    try {
        await shopSchema.validateAsync(plainObject);
        const inValidItems = data.category.filter(
            (cate) => !isValidObjectId(cate)
        );
        if (inValidItems.length > 0)
            return next(
                new BadRequest("Category must be an array of Object Id")
            );
        next();
    } catch (error) {
        deleteFileByRelativePath(path_file_stored);
        return next(new BadRequest(error.details[0].message));
    }
}

// Update
async function validateUpdateProduct(req, res, next) {
    const data = req.body;
    let path_file_stored = "";
    if (req.file) path_file_stored = req.file.path;

    try {
        await productSchema.validateAsync(data);
        if (!isValidObjectId(data.product_category))
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
    validateCreateShop,
    validateCreateProduct,
    validateUpdateProduct,
};
