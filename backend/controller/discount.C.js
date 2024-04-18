const discountModel = require("../model/discount.model");
const {
    ConflictRequest,
    BadRequest,
    Api404Error,
    ForbiddenRequest,
} = require("../modules/CustomError");
const discountService = require("../services/discount.service");
const { Types } = require("mongoose");
const { getSelectData } = require("../utils");

module.exports = {
    async createDiscount(req, res) {
        const { userId: shopId } = req.user;
        const { code, start_date, end_date } = req.body;

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
        if (foundDiscount) throw new ConflictRequest("Discount code existed");

        const newDiscount = await discountService.createDiscount(
            req.body,
            shopId
        );
        if (!newDiscount) throw new BadRequest("Discount Failure Create");
        res.status(200).json(newDiscount);
    },

    async updateDiscount(req, res) {
        const updateBody = req.body;
        const { discountId } = req.params;

        // 1. find discount (discount, shopId)
        // 2. apply joi
        const filter = {};
        await discountModel.updateOne(filter, { $set: updateBody });
    },

    async getDiscountByShop(req, res) {
        const { userId: shopId } = req.user;

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

    // get discount available with product
    async getDiscountByProduct(req, res) {
        const { product_id } = req.params;
        if (!product_id) throw new BadRequest("Missing required arguments");

        const filter = {
            $or: [
                { discount_applies_to: "all" },
                {
                    discount_applies_to: "specific",
                    discount_products_id: new Types.ObjectId(product_id),
                },
            ],
        };
        const select = [
            "discount_name",
            "discount_code",
            "discount_type",
            "discount_value",
        ];
        const discounts = await discountService.findAllDiscount({
            filter,
            select,
        });
        if (!discounts)
            throw new Api404Error("Discounts for this product not found");

        return res.status(200).json(discounts);
    },

    async deleteDiscountByShop(req, res) {
        const { userId: shopId } = req.user;
        const { discount_id } = req.params;

        const foundDiscount = await discountModel.findById(discount_id).lean();
        if (!foundDiscount) throw new Api404Error("Discount Not Found");
        if (!foundDiscount.discount_shopId.toString().includes(shopId))
            throw ForbiddenRequest("Cant not delete discount by this shop");

        const filter = {
            _id: new Types.ObjectId(discount_id),
            discount_shopId: new Types.ObjectId(shopId),
        };
        const { deletedCount } = await discountModel.deleteOne(filter);
        if (!deletedCount) throw new Api404Error("Not Found Discount");
        res.status(200).send("Discount Successfully Deleted");
    },
};
