const Joi = require("joi");

const addressSchema = Joi.object({
    type: Joi.string().valid("Company", "Home", "Other").required(),
    name: Joi.string(),
    street: Joi.string().required(),
    latlng: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
    }).required(),
});

module.exports = { addressSchema };
