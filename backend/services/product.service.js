const productModel = require("../model/product.model");
const { Types } = require("mongoose");
const {
    getSelectData,
    unSelectData,
    removeNestedNullUndefined,
    NestedObjectParser,
} = require("../utils/index");
module.exports = {
    ProductInfo: class {
        constructor({
            name,
            thumb,
            description,
            price,
            quantity,
            category,
            shop,
        }) {
            this.name = name;
            this.thumb = thumb;
            this.description = description;
            this.price = price;
            this.quantity = quantity;
            this.category = category;
            this.shop = shop;
        }
    },
    async createProduct(product) {
        return await productModel.create(product);
    },

    async updateProduct({ product_id, product_shop, bodyUpdate }) {
        const filter = {
            _id: new Types.ObjectId(product_id),
            product_shop: new Types.ObjectId(product_shop),
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

    async getProductById({ product_id, unSelect }) {
        console.log(unSelectData(unSelect));
        return await productModel
            .findOne({
                _id: new Types.ObjectId(product_id),
            })
            .select(unSelectData(unSelect));
    },

    async deleteProduct(product_id) {
        return await productModel.deleteOne({
            _id: new Types.ObjectId(product_id),
        });
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
