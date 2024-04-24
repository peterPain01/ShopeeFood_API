const discountModel = require("../model/discount.model");
const { Types } = require("mongoose");
const { getSelectData } = require("../utils/index");
module.exports = {
    async createDiscount(payload, shopId) {
        const {
            name,
            description,
            code,
            type,
            value,
            start_date,
            end_date,
            is_active,
            min_order_value,
            usage_limit,
            max_use_per_user,
        } = payload;
        return await discountModel.create({
            discount_shopId: new Types.ObjectId(shopId),
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_type: type,
            discount_value: value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_min_order_value: min_order_value || 0,
            discount_usage_limit: +usage_limit,
            discount_shopId: shopId,
            discount_max_use_per_user: max_use_per_user,
            discount_is_active: is_active,
        });
    },

    async findAllDiscount({
        limit = 50,
        sort,
        page = 1,
        filter = {},
        select = {},
    }) {
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        return await discountModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .select(getSelectData(select))
            .lean();
    },

    async findAllNotActiveDiscount() {
        const filter = {
            discount_is_active: false,
        };
        return await discountModel.find({ filter });
    },

    async findAllActiveDiscount() {
        const filter = {
            discount_is_active: true,
        };
        return await discountModel.find({ filter });
    },

    async findDiscountAvailableForCart(shopId, userId, cartValue) {
        const filter = {
            discount_shopId: shopId,
            discount_min_order_value: { $lt: cartValue },
            discount_is_active: true,
            discount_usage_limit: { $gt: 0 },
            discount_end_date: { $gt: Date.now() },
        };

        const select = [
            "discount_name",
            "discount_code",
            "discount_type",
            "discount_value",
        ];
        let discounts = await this.findAllDiscount({
            filter,
            select,
        });
        if (!discounts) return null;

        discounts = this.checkUserUsed(discounts, userId);
        if(!discounts) return null; 

        return discounts;
    },

    checkUserUsed(discounts, userId) {
        let filteredDiscount = [];
        const max_use_per_user = discounts?.discount_max_use_per_user;
        if (!max_use_per_user) return null;

        for (const discount of discounts) {
            const user_used = discount?.discount_users_used?.length;
            if (user_used) {
                const times = user_used.filter(
                    (userUsedId) => userUsedId === userId
                );
                if (times < max_use_per_user) {
                    filteredDiscount.push(discount);
                }
            }
        }
        return filteredDiscount;
    },
};
