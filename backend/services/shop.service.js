const { update } = require("lodash");
const productModel = require("../model/product.model");
const { unPublishProductByShop } = require("../controller/shop.C");

module.exports = {
    async findAllDraftsForShop({ query, limit, skip }) {
        return await this.queryAllProduct(query, limit, skip);
    },

    async findAllPublishForShop({ query, limit, skip }) {
        return await this.queryAllProduct(query, limit, skip);
    },

    async queryAllProduct({ query, limit, skip }) {
        return await productModel
            .find(query)
            .populate("product_shop", "name phone -_id")
            .sort({ updated_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    },

    async publishProductByShop({ filter, update }) {
        return await productModel.findOneAndUpdate(filter, update);
    },

    async unPublishProductByShop({ filter, update }) {
        return await productModel.findOneAndUpdate(filter, update);
    },
};
