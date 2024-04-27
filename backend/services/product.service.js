const productModel = require("../model/product.model");
const { Types } = require("mongoose");
const {
    getSelectData,
    unSelectData,
    removeNestedNullUndefined,
    NestedObjectParser,
} = require("../utils/index");
const { update } = require("lodash");

module.exports = {
    async createProduct(product, shopId) {
        const unSelect = [
            "product_shop",
            "product_sold",
            "product_like",
            "isDraft",
            "isPublished",
            "_id",
            "product_comments",
            "__v",
        ];
        return await productModel.create({
            ...product,
            product_shop: new Types.ObjectId(shopId),
        });
    },

    async updateProduct({ productId, shopId, bodyUpdate, product_thumb }) {
        const filter = {
            _id: new Types.ObjectId(productId),
            product_shop: new Types.ObjectId(shopId),
        };
        // removeNestedNullUndefined(bodyUpdate);
        // bodyUpdate = NestedObjectParser(bodyUpdate);
        if (product_thumb) {
            bodyUpdate = {
                ...bodyUpdate,
                product_thumb,
            };
        }
        return await productModel.findOneAndUpdate(
            filter,
            { $set: { ...bodyUpdate } },
            {
                new: true,
            }
        );
    },

    async getAllProducts({
        limit = 50,
        sort,
        page = 1,
        filter = {},
        select = {},
    }) {
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        return await productModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .select(getSelectData(select))
            .lean();
    },

    async getProductById({ productId, unSelect = [], select = [] }) {
        let unSelectFields = {};
        let selectedFields = {};
        if (unSelect) unSelectFields = unSelectData(unSelect);
        if (select) selectedFields = getSelectData(select);
        console.log({
            ...unSelectFields,
            ...selectedFields,
        });
        return await productModel
            .findById(productId)
            .select({ ...unSelectFields, ...selectedFields })
            .lean()
            .exec();
    },

    async deleteProductById(filter) {
        return await productModel.deleteOne(filter);
    },

    async searchProduct(keySearch) {
        const regexSearch = new RegExp(keySearch);
        return await productModel
            .find(
                { isDraft: false, $text: { $search: regexSearch } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .lean();
    },

    async checKExistProduct(productId) {
        return await productModel.findById(productId).lean();
    },

    async getProductByIdAndUpdate(productId, update) {
        return await productModel.findByIdAndUpdate(productId, update);
    },

    async getTrendingProduct(shopId, unSelect) {
        return await productModel
            .find({ product_shop: new Types.ObjectId(shopId) })
            .select(unSelectData(unSelect))
            .sort({ product_sold: -1 });
    },
};
