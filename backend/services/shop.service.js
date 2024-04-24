const { update } = require("lodash");
const productModel = require("../model/product.model");
const { unPublishProductByShop } = require("../controller/shop.C");
const shopModel = require("../model/shop.model");
const { Types } = require("mongoose");
const { unSelectData } = require("../utils");

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

    async findShopById(shopId) {
        return await shopModel.findById(shopId);
    },

    async searchProductInShop(keySearch, shopId) {
        const regexSearch = new RegExp(keySearch);
        return await productModel
            .find(
                {
                    isDraft: false,
                    $text: { $search: regexSearch },
                    product_shop: new Types.ObjectId(shopId),
                },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .lean();
    },

    async getDetailOfShop(shopId, unSelect) {
        let shops = await shopModel
            .findById(shopId)
            .populate("category")
            .select(unSelectData(unSelect));

        shops = JSON.parse(JSON.stringify(shops));
        if (shops.category) {
            shops.category = shops?.category.map((cate) => {
                return {
                    name: cate.category_name || "",
                    image: cate.category_image || "",
                };
            });
        } else shops.category = [];

        return shops;
    },
};
