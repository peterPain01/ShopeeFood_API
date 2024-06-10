const Joi = require("joi");
const {
    deleteFileByRelativePath,
    deleteRedundancyKey,
} = require("../utils/index");
const { BadRequest } = require("../modules/CustomError");
const { Types, isValidObjectId } = require("mongoose");
const { isValidOpenCloseHour } = require("../utils/shop");
const { addressSchema } = require("./addressValidation");
const { verifyToken } = require("../utils/auth");

const shopSchema = Joi.object({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().required().trim().strict(),
    phone: Joi.string().required().trim().strict(),
    // addresses: Joi.array().items(addressSchema).required(),
    address: Joi.object().required(),
    category: Joi.array().items().required(),
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
}).min(1);

async function validateCreateShop(req, res, next) {
    const data = req.body;
    console.log("validateCreateShop::::", req.body);

    const validAddress = JSON.parse(data.address);
    data.address = validAddress;
    console.log(data);

    if (!req.files["avatar"] || !req.files["image"])
        return next(new BadRequest("Missing avatar | image field"));

    deleteRedundancyKey(data, shopSchema.describe().keys);

    try {
        await shopSchema.validateAsync(data);
        if (!isValidOpenCloseHour(data.open_hour, data.close_hour))
            return next(
                new BadRequest("Open or Close Hour invalid format HH:mm")
            );
        next();
    } catch (error) {
        deleteFileByRelativePath(req.files["avatar"][0].path);
        deleteFileByRelativePath(req.files["image"][0].path);

        next(new BadRequest(error?.details?.at(0).message || error.message));
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

async function validateGetShopInfo(req, res, next) {
    const userId = req.headers["x-client-id"];
    const accessToken = req.headers["x-authorization"];
    
    // user that have token expire still can access this route
    if (userId && accessToken) {
        const isValidUserCredential = checkUserCredential(accessToken, userId);
        if (isValidUserCredential) await verifyToken(req, res, next);
        else next();
    } else {
        next();
    }
}

module.exports = {
    validateCreateShop,
    validateUpdateShop,
    validateGetShopInfo,
};
