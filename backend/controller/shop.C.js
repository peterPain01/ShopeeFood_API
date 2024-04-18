const {
    BadRequest,
    Api404Error,
    InternalServerError,
    ConflictRequest,
} = require("../modules/CustomError");
const shopModel = require("../model/shop.model");
const { Types } = require("mongoose");
const shopService = require("../services/shop.service");
const productService = require("../services/product.service");

module.exports = {
    async createShop(req, res) {
        const { userId } = req.user;
        const shop_data = req.body;
        if (!shop_data) throw new BadRequest("Missing some information");

        const foundShop = await shopService.findShopById(userId);
        if (foundShop)
            throw new ConflictRequest("UserId used to register shop");

        const new_shop = await shopModel.create({ ...shop_data, _id: userId });
        if (!new_shop) throw new InternalServerError("Shop Failure Create");
        console.log(new_shop);
        res.status(201).json(new_shop);
    },

    async getAllDraftsForShop(req, res) {
        const { userId: shopId } = req.user;
        const query = { product_shop: shopId, isDraft: true };

        const products = await shopService.findAllDraftsForShop({
            query,
            skip: 0,
            limit: 50,
        });
        if (!products) throw new Api404Error("All drafts Not Found");
        res.status(200).json(products);
    },

    async getAllPublishForShop(req, res) {
        const { userId: shopId } = req.user;
        const query = { product_shop: shopId, isPublish: true };
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
        await updateProductState(req, res, update);
    },

    async unPublishProductsByShop(req, res) {
        const update = { isDraft: true, isPublish: false };
        await updateProductState(req, res, update);
    },

    async createProduct(req, res) {
        const product_data = req.body;
        const { userId: shopId } = req.user;
        if (!product_data) throw new BadRequest("Missing some product data");

        const foundShop = await shopService.findShopById(shopId);
        if (!foundShop) throw new Api404Error("ShopId Not Found");

        const createdProduct = await productService.createProduct(
            product_data,
            shopId
        );
        if (!createdProduct) throw new BadRequest("Product failure create");
        res.status(200).json(createdProduct);
    },

    async updateProduct(req, res) {
        const { userId: shopId } = req.user;
        const { id: product_id } = req.params;
        const bodyUpdate = req.body;
        if (!shopId || !product_id || !bodyUpdate)
            throw new BadRequest("Missing required arguments");

        const updatedProduct = await productService.updateProduct({
            product_id,
            product_shop: shopId,
            bodyUpdate,
        });

        if (!updatedProduct)
            throw new InternalServerError("Product Failure Update");
        res.status(200).json(updatedProduct);
    },

    async deleteProduct(req, res, next) {
        try {
            const { userId: shopId } = req.user;
            const { id: product_id } = req.params;

            if (!product_id) throw new BadRequest("Missing required arguments");
            const deleted_product = await productService.deleteProductById({
                _id: new Types.ObjectId(product_id),
                product_shop: new Types.ObjectId(shopId),
            });
            if (deleted_product.deletedCount !== 1)
                next(new InternalServerError("Err when deleting product"));
            return res.status(200).json("product successfully deleted");
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async updateProductState(req, res, update) {
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
