const Joi = require("joi");
const { BadRequest } = require("../modules/CustomError");
const moment = require("moment-timezone");
const { deleteFileByRelativePath } = require("../utils");

// client co the gui shop id len cung khong
const userToShop = Joi.object({
    productId: Joi.string().required(),
    orderId: Joi.string().required(),
    content_text: Joi.string().required(),
    star: Joi.number().required(),
    title: Joi.string().required(),
    date: Joi.date().required(),
});

const userToShipper = Joi.object({
    shipperId: Joi.string().required(),
    orderId: Joi.string().required(),
    content_text: Joi.string().required(),
    star: Joi.number().required(),
    date: Joi.date().required(),
});

const shopToUser = Joi.object({});

module.exports = {
    async validateCreateCommentUserToShop(req, res, next) {
        const data = req.body;
        try {
            if (data.date)
                data.date = moment
                    .tz(data.date, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
                    .toDate();
            await userToShop.validateAsync(data);
            next();
        } catch (error) {
            if(req.file)
                deleteFileByRelativePath(req.file.path);
            return next(
                new BadRequest(error?.details?.at(0)?.message || error.message)
            );
        }
    },

    async validateCreateCommentUserToShipper(req, res, next) {
        const data = req.body;
        try {
            if (data.date)
                data.date = moment
                    .tz(data.date, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
                    .toDate();
            await userToShipper.validateAsync(data);
            next();
        } catch (error) {
            return next(
                new BadRequest(error?.details?.at(0)?.message || error.message)
            );
        }
    },
};
