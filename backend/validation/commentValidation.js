const Joi = require("joi");
const { BadRequest } = require("../modules/CustomError");
const { createDateFromString } = require("../utils");
const moment = require("moment-timezone");
const commentSchema = Joi.object({
    productId: Joi.string().required(),
    childId: Joi.string(),
    content: Joi.string().required(),
    star: Joi.number().required(),
    title: Joi.string().required(),
    date: Joi.date().required(),
});

module.exports = {
    async validateCreateComment(req, res, next) {
        const data = req.body;
        try {
            if (data.date)
                data.date = moment
                    .tz(data.date, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
                    .toDate();
            await commentSchema.validateAsync(data);
            next();
        } catch (error) {
            return next(
                new BadRequest(error?.details?.at(0)?.message || error.message)
            );
        }
    },
};
