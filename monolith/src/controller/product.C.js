const {
    InternalServerError,
    BadRequest,
    Api404Error,
} = require("../modules/CustomError");
const commentService = require("../services/comment.service");
const productService = require("../services/product.service");
const { Types } = require("mongoose");

module.exports = {
    // get all products (from any shop)
    async getAllProducts(req, res, next) {
        const { limit = 50, sort = "ctime", page = 1 } = req.params;
        try {
            const filter = { isPublished: true };
            const select = [
                "product_name",
                "product_price",
                "product_thumb",
                "product_sold",
                "_id",
            ];
            const products = await productService.getAllProducts({
                limit,
                sort,
                page,
                filter,
                select,
            });
            if (!products.length) throw new Api404Error("Not Found Products");
            return res
                .status(200)
                .json({ message: "Success", metadata: products });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    // get all products (from specific shop)
    async getAllProductsByShop(req, res, next) {
        const { limit = 50, sort = "ctime", page = 1 } = req.params;
        const { shopId } = req.query;
        if (!shopId) throw new BadRequest("Missing required arguments");
        try {
            const filter = {
                isPublished: true,
                isDraft: false,
                product_shop: new Types.ObjectId(shopId),
            };
            const select = [
                "product_name",
                "product_discounted_price",
                "product_original_price",
                "product_thumb",
                "product_description",
                "product_sold",
            ];

            const products = await productService.getAllProducts({
                limit,
                sort,
                page,
                filter,
                select,
            });

            return res.status(200).json({
                message: "Product",
                metadata: products ? products : [],
            });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async getProductById(req, res, next) {
        try {
            const { productId } = req.params;
            if (!productId) throw new BadRequest("Missing required arguments");

            const found_products = await productService.getProductById({
                productId,
                unSelect: ["__v", "product_shop"],
            });

            if (!found_products) throw new Api404Error("Product Not Found");
            const product_reviews = await commentService.getCommentByProductId({
                productId: productId,
            });
            return res.status(200).json({
                message: "Success",
                metadata: {
                    ...found_products,
                    product_reviews: product_reviews || {},
                },
            });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async searchProduct(req, res) {
        const { keySearch } = req.query;
        if (!keySearch) throw new BadRequest("Missing required arguments");

        const results = await productService.searchProduct(keySearch);
        if (!results)
            throw new InternalServerError("Error when search product");
        return res
            .status(200)
            .json({ message: "Successfully", metadata: results });
    },

    // return list of string contains key search
    // keySearch: a
    // return : ["an vat", "an com"]
    async getRelatedKey(req, res) {
        res.status(200).json({ message: "Deprecated" });
        const { keySearch } = req.query;
        if (!keySearch) throw new BadRequest("Missing required arguments");
        const relatedString = await productService.getRelatedKey(keySearch);
        console.log(Array.from(relatedString));
        return res.status(200).json({
            message: "Successful get related String ",
            metadata: Array.from(relatedString),
        });
    },
};
