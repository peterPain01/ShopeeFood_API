const discountModel = require("../model/discount.model");
const { Types } = require("mongoose");
module.exports = {
    async createDiscount(payload) {
        const {
            name,
            description,
            code,
            type,
            value,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            usage_limit,
            max_uses_per_user,
            applies_to,
            product_ids,
            users_used,
            uses_count,
        } = payload;
        return await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_type: type,
            discount_value: value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_min_order_value: min_order_value || 0,
            discount_usage_limit: usage_limit,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        });
    },

    async findAllDiscount({ limit, sort, page, filter, select }) {
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        return await discountModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .select(getSelectData(select))
            .lean();
    },

};
