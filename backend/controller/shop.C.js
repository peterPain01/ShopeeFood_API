const {
    BadRequest,
    Api404Error,
    InternalServerError,
} = require("../modules/CustomError");
const shopModel = require("../model/shop.model");
const { Types } = require("mongoose");
const shopService = require("../services/shop.service");
const { query } = require("express");

module.exports = {
    async createShop(req, res) {
        const userId = req.headers["x-client-id"];
        if (!userId) throw new BadRequest("Missing some information");

        const shop_data = req.body;
        if (!shop_data) throw new BadRequest("Missing some information");

        const new_shop = await shopModel.create({
            ...shop_data,
            owner: new Types.ObjectId(userId),
        });
        if (!new_shop) throw new InternalServerError("Shop Failure Create");
        console.log(new_shop);
        res.status(201).json(new_shop);
    },

    async getAllDraftsForShop(req, res) {
        const userId = req.headers["x-client-id"];
        if (!userId) throw new BadRequest("Missing some information");

        const query = { shop: userId, isDraft: true };
        const products = await shopService.findAllDraftsForShop({
            query,
            skip: 0,
            limit: 50,
        });
        if (!products) throw new Api404Error("All drafts Not Found");
        res.status(200).json(products);
    },

    async getAllPublishForShop(req, res) {
        const userId = req.headers["x-client-id"];
        if (!userId) throw new BadRequest("Missing some information");

        const query = { shop: userId, isPublish: true };
        const products = await shopService.findAllPublishForShop({
            query,
            skip: 0,
            limit: 50,
        });
        if (!products) throw new Api404Error("All drafts Not Found");
        res.status(200).json(products);
    },

    async publishProductByShop(req, res) {
        const update = { isDraft: false, isPublish: true };
        await updateProductByShop(req, res, update);
    },

    async unPublishProductByShop(req, res) {
        const update = { isDraft: true, isPublish: false };
        await updateProductByShop(req, res, update);
    },
    
    async updateProductByShop(req, res, update) {
        const userId = req.headers["x-client-id"];
        const { product_id } = req.body;
        if (!userId || !product_id)
            throw new BadRequest("Missing some information");

        const filter = {
            product_shop: new Types.ObjectId(userId),
            _id: new Types.ObjectId(product_id),
        };

        const updatedProduct = await shopService.updateProductByShop({
            filter,
            update,
        });
        if (!updatedProduct)
            throw new InternalServerError("Product update failed");

        res.status(200).json("Product successfully updated");
    },
};
