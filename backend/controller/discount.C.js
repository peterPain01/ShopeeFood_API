const discountModel = require("../model/discount.model");
const {
    ConflictRequest,
    BadRequest,
    Api404Error,
    ForbiddenRequest,
} = require("../modules/CustomError");
const discountService = require("../services/discount.service");
const { Types } = require("mongoose");

module.exports = {
    async createDiscount(req, res) {
        const { userId: shopId } = req.user;
        const { code, start_date, end_date } = req.body;

        if (
            new Date(start_date) < Date.now() ||
            new Date(end_date) < new Date(start_date)
        )
            throw new BadRequest("Start date must be before end date");

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
        res.status(200).json({
            message: "Successfully",
            metadata: newDiscount,
        });
    },

    async updateDiscount(req, res) {
        const { userId: shopId } = req.user;
        const updateBody = req.body;
        const { discount_id } = req.params;
        if (!discount_id) throw new BadRequest("Missing required arguments");

        const filter = {
            _id: new Types.ObjectId(discount_id),
            discount_shopId: new Types.ObjectId(shopId),
        };

        const updatedDiscount = await discountModel.findOneAndUpdate(
            filter,
            { $set: updateBody },
            { new: true }
        );
        res.status(200).json({
            message: "Successfully",
            metadata: updatedDiscount,
        });
    },

    async getDiscountByShopId(req, res) {
        const { userId: shopId } = req.user;

        const filter = {
            discount_shopId: new Types.ObjectId(shopId),
        };

        const select = [
            "discount_name",
            "discount_description",
            "discount_end_date",
            "discount_type",
            "discount_value",
        ];
        const discounts = await discountService.findAllDiscount({
            filter,
            limit: 50,
            page: 1,
            select,
        });
        if (!discounts) throw new Api404Error("Discounts Not Found");
        res.status(200).json({ message: "Successfully", metadata: discounts });
    },

    // get discount available with product
    async getDiscountByProduct(req, res) {
        const { product_id } = req.params;
        if (!product_id) throw new BadRequest("Missing required arguments");

        const discounts = await discountService.findDiscountByProduct(
            product_id
        );
        if (!discounts)
            throw new Api404Error("Discount for this product not found");

        res.status(200).json({ message: "Successfully", metadata: discounts });
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
        res.status(200).json({ message: "Discount Successfully Deleted" });
    },
};
