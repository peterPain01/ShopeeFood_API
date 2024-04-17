const {
    InternalServerError,
    BadRequest,
    Api404Error,
} = require("../modules/CustomError");
const productService = require("../services/product.service");
const { Types } = require("mongoose");

module.exports = {
    async getAllProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts({
                limit: 50,
                sort: "ctime",
                page: 1,
                filter: { isPublished: true },
                select: ["product_name", "product_price", "product_thumb"],
            });
            if (!products) throw new Api404Error("Not Found Products");
            return res.status(200).json(products);
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async getProductById(req, res, next) {
        try {
            const { id: product_id } = req.params;
            if (!product_id) throw new BadRequest("Missing required arguments");

            const found_products = await productService.getProductById({
                product_id,
                unSelect: ["__v"],
            });

            if (!found_products) throw new Api404Error("Not Found Products");
            return res.status(200).json(found_products);
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async createProduct(req, res) {
        const product_data = req.body;
        if (!product_data) throw new BadRequest("Missing some product data");
        const newProduct = new productService.ProductInfo(product_data);
        const createdProduct = await productService.createProduct(newProduct);

        if (!createdProduct) throw new BadRequest("Product failure create");
        res.status(200).json(newProduct);
    },

    async updateProduct(req, res) {
        const shopId = req.headers["x-client-id"];
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

    async searchProduct(req, res) {
        const { keySearch } = req.params;
        if (!keySearch) throw new BadRequest("Missing required arguments");
       
        const results = await productService.searchProduct(keySearch);
        if (!results)
            throw new InternalServerError("Error when search product");
        return res.status(200).json(results);
    },
    
    async deleteProduct(req, res, next) {
        try {
            const { product_id } = req.body;
            if (!product_id) throw new BadRequest("Missing required arguments");
            const deleted_product = await productService.deleteProduct(
                product_id
            );
            if (deleted_product.deletedCount !== 1)
                next(new InternalServerError("Err when deleting product"));
            return res.status(200).json("product successfully deleted");
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },
};
