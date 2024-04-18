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
            max_uses_per_user,
            applies_to,
            products_id,
            users_used,
            uses_count,
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
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_products_id:
                applies_to === "all" || !applies_to
                    ? []
                    : products_id.map((id) => new Types.ObjectId(id)),
        });
    },

    async findAllDiscount({ limit = 50, sort, page = 1, filter, select }) {
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        return await discountModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .select(getSelectData(select))
            .lean();
    },

    async findDiscountByProduct(product_id) {
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
        return await this.findAllDiscount({
            filter,
            select,
        });
    },
};
