const Joi = require("joi");
const { BadRequest, InternalServerError } = require("../modules/CustomError");
const User = require("../model/user.model");
const { addressSchema } = require("./addressValidation");

const updateUserSchema = Joi.object({
    fullname: Joi.string(),
    email: Joi.string().email(),
    addresses: Joi.array().items(addressSchema),
    birth_date: Joi.date(),
    gender: Joi.string().valid("male", "female"),
    bio: Joi.string(),
}).options({ abortEarly: false });

module.exports = {
    async validateUpdateUser(req, res, next) {
        try {
            const data = req.body;
            Object.keys(data).forEach((key) => {
                if (
                    !Object.keys(updateUserSchema.describe().keys).includes(key)
                )
                    delete data[key];
            });
            await updateUserSchema.validateAsync(data);
            next();
        } catch (err) {
            next(
                new InternalServerError(
                    err?.details?.at(0)?.message || err.message
                )
            );
        }
    },
};
