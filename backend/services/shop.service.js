const { update } = require("lodash");
const productModel = require("../model/product.model");
const { unPublishProductByShop } = require("../controller/shop.C");
const shopModel = require("../model/shop.model");
const { Types } = require("mongoose");
const { unSelectData, getSelectData } = require("../utils");

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

    async publishProductByShop(shopId, productId) {
        const filter = {
            product_shop: new Types.ObjectId(shopId),
            _id: new Types.ObjectId(productId),
        };
        const update = {
            isDraft: false,
            isPublished: true,
        };
        const option = { new: true };
        return await productModel.findOneAndUpdate(filter, update, option);
    },

    async unPublishProductByShop(shopId, productId) {
        const filter = {
            product_shop: new Types.ObjectId(shopId),
            _id: new Types.ObjectId(productId),
        };

        const update = {
            isDraft: true,
            isPublished: false,
        };
        const option = { new: true };
        return await productModel.findOneAndUpdate(filter, update, option);
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
        let shop = await shopModel
            .findById(shopId)
            .populate("category")
            .select(unSelectData(unSelect));
        if (!shop) return null;

        shop = JSON.parse(JSON.stringify(shop));
        if (shop.category) {
            shop.category = shop?.category.map((cate) => {
                return {
                    name: cate.category_name || "",
                    image: cate.category_image || "",
                };
            });
        } else shop.category = [];

        return shop;
    },

    async updateShop(shopId, bodyUpdate, filepath) {
        if (filepath) bodyUpdate = { ...bodyUpdate, image: filepath };

        return await shopModel.findByIdAndUpdate(shopId, {
            $set: { ...bodyUpdate },
        });
    },

    async getShopByKeySearch(keySearch, select) {
        return await shopModel
            .find({
                $or: [
                    {
                        name: { $regex: keySearch, $options: "i" },
                    },
                    {
                        description: { $regex: keySearch, $options: "i" },
                    },
                ],
            })
            .select(getSelectData(select));
    },

    async getRelatedKey(keySearch) {
        const select = ["name", "description"];

        const shops = await shopModel
            .find({
                $or: [
                    {
                        name: { $regex: keySearch, $options: "i" },
                    },
                    {
                        description: { $regex: keySearch, $options: "i" },
                    },
                ],
            })
            .lean()
            .select(getSelectData(select));

        // filter list of shops
        let relatedString = new Set();
        shops.forEach((shop) => {
            const key_name = shop.name.split(" ");
            const key_desc = shop.description.split(" ");

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

        return relatedString;
    },
};
