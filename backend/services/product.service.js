const productModel = require("../model/product.model");
const commentModel = require("../model/comment.model");

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
        const regexSearch = new RegExp("^" + keySearch);
        return await productModel
            .find(
                {
                    isDraft: false,
                    $text: { $search: regexSearch, $caseSensitive: false },
                },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .lean();
    },

    async checKExistProduct(productId, select = []) {
        return await productModel.findById(productId).select(select).lean();
    },

    async getProductByIdAndUpdate(productId, update) {
        return await productModel.findByIdAndUpdate(productId, update);
    },

    async getTrendingProduct(shopId, unSelect) {
        return await productModel
            .find({ product_shop: new Types.ObjectId(shopId) })
            .select(unSelectData(unSelect))
            .sort({ product_sold: -1 })
            .limit(5);
    },

    async getRelatedKey(keySearch) {
        const select = ["product_name", "product_description"];

        const listOfProducts = await productModel
            .find({
                isDraft: false,
                product_description: { $regex: keySearch, $options: "i" },
                product_name: { $regex: keySearch, $options: "i" },
            })
            .lean()
            .select(getSelectData(select));

        // filter list of products

        let relatedString = new Set();
        listOfProducts.forEach((product) => {
            const key_name = product.product_name.split(" ");
            const key_desc = product.product_description.split(" ");

            for (key of key_name) {
                console.log("key::", key.toLowerCase());
                if (key.toLowerCase().includes(keySearch.toLowerCase()))
                    relatedString.add(key.replace(",", ""));
            }
            for (key of key_desc) {
                if (key.toLowerCase().includes(keySearch.toLowerCase()))
                    relatedString.add(key);
            }
        });

        console.log("relatedString:::", relatedString);
        return relatedString;
    },

    async getAllCommentsOfProduct(productId) {
        const filter = {
            comment_productId: productId,
        };
        const select = [
            "comment_userAvatar",
            "_id",
            "comment_shopId",
            "comment_userId",
            "comment_content_text",
            "comment_content_image",
            "comment_star",
            "comment_title",
            "comment_date",
        ];
        const comments = await commentModel
            .find(filter)
            .select(getSelectData(select));
        return comments;
    },
};
