const {
    InternalServerError,
    BadRequest,
    Api404Error,
} = require("../modules/CustomError");
const productService = require("../services/product.service");
const { Types } = require("mongoose");

module.exports = {
    // get all products (from any shop)
    async getAllProducts(req, res, next) {
        const { limit = 50, sort = "ctime", page = 1 } = req.params;
        try {
            const filter = { isPublished: true };
            const select = ["product_name", "product_price", "product_thumb"];
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
        console.log(shopId);
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
            const { productId: product_id } = req.query;
            if (!product_id) throw new BadRequest("Missing required arguments");

            const found_products = await productService.getProductById({
                product_id,
                unSelect: ["__v"],
            });

            if (!found_products) throw new Api404Error("Product Not Found");
            return res
                .status(200)
                .json({ message: "Success", metadata: found_products });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async searchProduct(req, res) {
        const { keySearch } = req.params;
        if (!keySearch) throw new BadRequest("Missing required arguments");

        const results = await productService.searchProduct(keySearch);
        if (!results)
            throw new InternalServerError("Error when search product");
        return res
            .status(200)
            .json({ message: "Successfully", metadata: results });
    },
};
