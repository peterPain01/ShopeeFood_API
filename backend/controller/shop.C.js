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
const userModel = require("../model/user.model");

module.exports = {
    async createShop(req, res) {
        const { userId } = req.user;
        const shop_data = req.body;
        if (!shop_data) throw new BadRequest("Missing some information");

        const foundShop = await shopService.findShopById(userId);
        if (foundShop)
            throw new ConflictRequest("UserId was used to register shop");

        const new_shop = await shopModel.create({ ...shop_data, _id: userId });
        if (!new_shop) throw new InternalServerError("Shop Failure Create");

        const user = await userModel.findByIdAndUpdate(userId, {
            $set: { roles: "shop" },
        });
        if (!user) throw new InternalServerError("Error when assign roles");

        console.log(new_shop);
        res.status(201).json({
            message: "Shop Successfully Created",
            metadata: new_shop,
        });
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
        if (!product_data) throw new BadRequest("Missing data of product");

        const foundShop = await shopService.findShopById(shopId);
        if (!foundShop) throw new Api404Error("ShopId Not Found");

        const createdProduct = await productService.createProduct(
            product_data,
            shopId
        );
        if (!createdProduct) throw new BadRequest("Product failure create");
        res.status(200).json({
            message: "Product Successful Created",
            metadata: createdProduct,
        });
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

    async searchProductInShop(req, res) {
        const { keySearch, shopId } = req.params;
        if (!keySearch || !shopId)
            throw new BadRequest("Missing required arguments");

        const foundProducts = await shopService.searchProductInShop(
            keySearch,
            shopId
        );
        if (!foundProducts)
            throw new Api404Error("Products Empty in this shop");

        res.status(200).json({
            message: "Successfully",
            metadata: foundProducts,
        });
    },

    async getShopByCategory(req, res) {
        const { limit = 10, skip = 0, category } = req.params;
        if (!category) throw new BadRequest("Missing required arguments");

        const shopsWithCategory = await shopModel
            //   ==================== ====================
            .find({ category: category })
            .limit(limit)
            .skip(skip);

        if (!shopsWithCategory)
            throw new InternalServerError(
                "Error when finding shop by category"
            );

        res.status(200).json({
            message: "Successfully",
            metadata: shopsWithCategory,
        });
    },

    async getTopRatedShops(req, res) {
        const { limit = 50, skip = 0 } = req.query;
        const select = ["name", "image", "category", "address", "avg_rating"];
        let shopTopRated = await shopModel
            .find({})
            .populate("category")
            .sort({ avg_rating: 1 })
            .select(select)
            .skip(skip)
            .limit(limit);

        if (!shopTopRated)
            throw new InternalServerError(
                "Error occurred when get all top rated shop "
            );

        shopTopRated = JSON.parse(JSON.stringify(shopTopRated));
        shopTopRated.forEach((shop) => {
            if (shop.category) {
                const temp = shop.category.map((cate) => {
                    return {
                        name: cate.category_name || "",
                        image: cate.category_image || "",
                    };
                });
                shop.category = temp;
            } else shop.category = [];
        });

        res.status(200).json({
            message: "Successfully",
            metadata: shopTopRated,
        });
    },

    async getShopInfo(req, res) {
        const { shopId } = req.query;
        console.log(shopId);
        if (!shopId) throw new BadRequest("Missing required argument");

        if (!Types.ObjectId.isValid(shopId))
            throw new BadRequest("Shop Id is not in valid type");

        const unSelect = ["roles", "verify", "status", "owner", "__v"];

        const shopDetailInfo = await shopService.getDetailOfShop(
            shopId,
            unSelect
        );
        if (!shopDetailInfo) throw new Api404Error("Shop Not Found");

        res.status(200).json({ message: "Success", metadata: shopDetailInfo });
    },
};
