const Joi = require("joi");
const { BadRequest } = require("../modules/CustomError");

const updateUserSchema = Joi.object({
    fullname: Joi.string(),
    email: Joi.string().email(),
    addresses: Joi.array(),
    birth_date: Joi.date(),
    gender: Joi.string().valid("male", "female"),
    bio: Joi.string(),
}).options({ abortEarly: false });

const User = require("../model/user.model");

module.exports = {
    validateUpdateUser(req, res, next) {
        const data = req.body;
        const { error } = updateUserSchema.validate(data);

        if (data.phone || data.state || data.role || data.password)
            throw new BadRequest(
                "Do not put [Phone | State | Role | Password ] in request"
            );

        if (error) throw new BadRequest(error.details[0].message);

        next();
    },
};
