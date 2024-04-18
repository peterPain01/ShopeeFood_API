const Joi = require("joi");

module.exports = {
    async createProduct(req, res, next) {
        const productValidation = Joi.object({
            product_name: Joi.string().required(),
            product_thumb: Joi.string().required(),
            product_description: Joi.string(),
            product_category: Joi.string()
                .valid("MilkTea", "Rice", "Noodles")
                .required(),

            isDraft: Joi.boolean().default(true),
            isPublished: Joi.boolean().default(false),
        });
        try {
            await productValidation.validateAsync(req.body);
            next();
        } catch (err) {
            res.status(422).json(err.message);
        }
    },
};
