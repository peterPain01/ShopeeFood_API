const Joi = require("joi");
const { deleteFileByRelativePath } = require("../utils/index");
const { BadRequest } = require("../modules/CustomError");
const { Types, isValidObjectId } = require("mongoose");
const { isValidOpenCloseHour } = require("../utils/shop");
const { addressSchema } = require("./addressValidation");

const shopSchema = Joi.object({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().required().trim().strict(),
    phone: Joi.string().required().trim().strict(),
    // addresses: Joi.array().items(addressSchema).required(),
    category: Joi.array(),
    status: Joi.string(),
    open_hour: Joi.string().required(),
    close_hour: Joi.string().required(),
}).options({ abortEarly: false });

const updateShopSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    phone: Joi.string(),
    addresses: Joi.array().items(addressSchema),
    category: Joi.array(),
    status: Joi.string(),
    open_hour: Joi.string(),
    close_hour: Joi.string(),
});

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
        if (!isValidOpenCloseHour(data.open_hour, data.close_hour))
            return next(
                new BadRequest("Open or Close Hour invalid format HH:mm")
            );
        next();
    } catch (error) {
        deleteFileByRelativePath(path_file_stored);
        return next(
                new BadRequest(error?.details?.at(0).message || error.message)
        );
    }
}

async function validateUpdateShop(req, res, next) {
    const data = req.body;
    let path_file_stored = req?.file?.path || "";
    try {
        await updateShopSchema.validateAsync(data);
    } catch (error) {
        if (path_file_stored) deleteFileByRelativePath(path_file_stored);
        return next(new BadRequest(error.details[0].message));
    }
    next();
}
module.exports = {
    validateCreateShop,
    validateUpdateShop,
};
