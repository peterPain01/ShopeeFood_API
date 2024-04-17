const discountModel = require("../model/discount.model");
const {
    AuthFailureError,
    ConflictRequest,
    BadRequest,
    Api404Error,
    ForbiddenRequest,
} = require("../modules/CustomError");
const discountService = require("../services/discount.service");
const { Types } = require("mongoose");
module.exports = {
    async createDiscount(req, res) {
        const { userId } = req.user;
        const { code, start_date, end_date, shopId } = req.body;

        if (userId !== shopId)
            throw new AuthFailureError("Forbidden create discount with shopId");
        if (
            new Date(start_date) < Date.now() ||
            new Date(end_date) < new Date(start_date)
        )
            throw new BadRequest("Start day must be before end day");

        const foundDiscount = await discountModel
            .findOne({
                discount_shopId: new Types.ObjectId(shopId),
                discount_code: code,
            })
            .lean();
        if (foundDiscount) throw new ConflictRequest("Discount existed");

        const newDiscount = await discountService.createDiscount(req.body);
        if (!newDiscount) throw new BadRequest("Discount Failure Create");
        res.status(200).json(newDiscount);
    },

    async updateDiscount(req, res) {
        const updateBody = req.body;
        // filter updateBody 
        await discountModel.updateOne(filter, { $set: updateBody });
    },

    async getDiscountByShop(req, res) {
        const { userId } = req.user;
        if (!userId) throw new BadRequest("Missing required arguments");

        const filter = {
            discount_shopId: new Types.ObjectId(shopId),
        };
        const discounts = await discountService.findAllDiscount({
            filter,
            limit: 50,
            page: 1,
        });
        if (!discounts) throw new Api404Error("Discounts Not Found");

        res.status(200).send(discounts);
    },

    async deleteDiscountByShop(req, res) {
        const { userId: shopId } = req.user;
        const { discount_id } = req.prams;

        const foundDiscount = await discountModel.findById(discount_id);
        if (foundDiscount.discount_shopId !== shopId)
            throw ForbiddenRequest("Cant not delete discount by this shop");

        const filter = {
            _id: new Types.ObjectId(discount_id),
            discount_shopId: new Types.ObjectId(shopId),
        };
        const { deletedCount } = await discountModel.deleteOne(filter);
        if (!deletedCount) throw new Api404Error("Not Found Discount");
        res.status(200).send("Discount Successfully Deleted");
    },

    async getDiscountByProduct(req, res) {
    },
};
