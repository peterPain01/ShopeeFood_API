const Joi = require("joi");
const { BadRequest } = require("../modules/CustomError");
const { deleteFileByRelativePath } = require("../utils");

const currentPositionObject = Joi.object({
    type: Joi.string().valid("CurrentPosition").required(),
    latlng: Joi.object({
        lat: Joi.string().required(),
        lng: Joi.string().required(),
    }).required(),
});

const shipperSchema = Joi.object({
    license_plate_number: Joi.string().required(),
    fullname: Joi.string().required(),
    phone: Joi.string().required(),
});

const shipperUpdateSchema = Joi.object({
    balance: Joi.number(),
    license_plate_number: Joi.string(),
    currentPosition: currentPositionObject.optional(),
});
// handle upload 2 images

async function validateCreateShipper(req, res, next) {
    const data = req.body;
    if (!req.files["avatar"] || !req.files["vehicle_image"])
        return next(new BadRequest("Missing avatar | vehicle Image"));
    try {
        await shipperSchema.validateAsync(data);
        next();
    } catch (err) {
        deleteFileByRelativePath(req.files["avatar"].path);
        deleteFileByRelativePath(req.files["image"].path);
        next(new BadRequest(err?.details?.at(0)?.message || err.message));
    }
}

async function validateUpdateShipper(req, res, next) {
    const data = req.body;
    try {
        await shipperUpdateSchema.validateAsync(data);
    } catch (err) {
        return next(
            new BadRequest(err?.details?.at(0)?.message || err.message)
        );
    }
    next();
}

module.exports = { validateCreateShipper, validateUpdateShipper };
