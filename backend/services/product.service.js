const productModel = require("../model/product.model");
const { Types } = require("mongoose");
const {
    getSelectData,
    unSelectData,
    removeNestedNullUndefined,
    NestedObjectParser,
} = require("../utils/index");

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
        return await productModel
            .create({
                ...product,
                product_shop: new Types.ObjectId(shopId),
            })
    },

    async updateProduct({ product_id, shopId, bodyUpdate }) {
        const filter = {
            _id: new Types.ObjectId(product_id),
            product_shop: new Types.ObjectId(shopId),
        };
        removeNestedNullUndefined(bodyUpdate);
        bodyUpdate = NestedObjectParser(bodyUpdate);
        return await productModel.findOneAndUpdate(filter, bodyUpdate, {
            new: true,
        });
    },

    async getAllProducts({ limit, sort, page, filter, select }) {
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        return await productModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .select(getSelectData(select))
            .lean();
    },

    async getProductById({ product_id, unSelect, select }) {
        let unSelectFields = {};
        let selectedFields = {};
        if (unSelect) unSelectFields = unSelectData(unSelect);
        if (select) selectedFields = getSelectData(select);
        console.log({
            ...unSelectFields,
            ...selectedFields,
        });
        return await productModel
            .findById(new Types.ObjectId(product_id))
            .select({ ...unSelectFields, ...selectedFields })
            .lean();
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
};
