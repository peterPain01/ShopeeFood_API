const Joi = require("joi");
const { BadRequest } = require("../modules/CustomError");
const { deleteFileByRelativePath } = require("../utils");

const addressSchema = Joi.object({
    type: Joi.string().valid("CurrentPosition").required(),
    latlng: Joi.object({
        lat: Joi.string().required(),
        lng: Joi.string().required(),
    }).required(),
});

const shipperSchema = Joi.object({
    balance: Joi.number(),
    license_plate_number: Joi.string().required(),
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
        deleteFileByRelativePath(avatar_file_path);
        deleteFileByRelativePath(vehicle_image_file_path);
        next(new BadRequest(err.details[0].message || err.message));
    }
}

module.exports = { validateCreateShipper };
