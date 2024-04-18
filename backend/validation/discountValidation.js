const Joi = require("joi");

module.exports = {
    async createDiscount(req, res, next) {
        const discountValidation = Joi.object({
            name: Joi.string().trim().strict(),
            description: Joi.string().trim().strict().required(),
            code: Joi.string().trim().strict().required(),
            value: Joi.number().required(),
            start_date: Joi.date().required(),
            end_date: Joi.date().min(Joi.ref("start_date")).required(),
            usage_limit: Joi.number().required(),
            max_uses_per_user: Joi.number().required(),
            min_order_value: Joi.number().required(),
        });
        try {
            await discountValidation.validateAsync(req.body);
            next();
        } catch (err) {
            res.status(422).json(err.message);
        }
    },
};
