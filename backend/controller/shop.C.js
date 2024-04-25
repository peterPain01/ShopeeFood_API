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
const shopUtils = require("../utils/shop");
const { uploadFileFromLocal } = require("../services/upload.service");

const STATIC_FILE_PATH = `http://localhost:${process.env.PORT}/`;

module.exports = {
    async createShop(req, res) {
        const { userId } = req.user;
        const shop_data = req.body;

        const { image_url } = await uploadFileFromLocal(req.file.path);
        if (!image_url)
            throw new BadRequest(
                "Cant upload the file to cloud please try again"
            );

        if (!shop_data || !shop_data.open_hour || !shop_data.close_hour)
            throw new BadRequest("Missing some information");

        const foundShop = await shopService.findShopById(userId);
        if (foundShop)
            throw new ConflictRequest("UserId was used to register shop");

        if (
            !shopUtils.isValidOpenCloseHour(
                shop_data.open_hour,
                shop_data.close_hour
            )
        )
            throw new BadRequest("Open or Close Hour invalid format HH:mm");

        console.log(req.file);
        const new_shop = await shopModel.create({
            ...shop_data,
            _id: userId,
            owner: userId,
            image: image_url,
        });

        if (!new_shop) throw new InternalServerError("Shop Failure Create");

        const user = await userModel.findByIdAndUpdate(userId, {
            $set: { role: "shop" },
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
        res.status(200).json({ message: "Success", metadata: products });
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
        res.status(200).json({ message: "Success", metadata: products });
    },

    async publishProductByShop(req, res) {
        const { userId: shopId } = req.user;
        const { productId } = req.query;
        if (!productId) throw new BadRequest("Missing required arguments ");

        const updatedProduct = await shopService.publishProductByShop(
            shopId,
            productId
        );

        if (!updatedProduct)
            throw new InternalServerError(
                "Error occurred when publish product || Product Not Found"
            );

        res.status(200).json({
            message: "Product Successfully Published",
            metadata: {},
        });
    },

    async unPublishProductsByShop(req, res) {
        const { userId: shopId } = req.user;
        const { productId } = req.query;
        if (!productId) throw new BadRequest("Missing required arguments ");

        const updatedProduct = await shopService.unPublishProductByShop(
            shopId,
            productId
        );

        if (!updatedProduct)
            throw new InternalServerError(
                "Error occurred when publish product || Product Not Found"
            );

        res.status(200).json({
            message: "Product Successfully UN_Published",
            metadata: {},
        });
    },

    async createProduct(req, res) {
        const product_data = req.body;
        const { userId: shopId } = req.user;
        if (!product_data) throw new BadRequest("Missing data of product");

        const foundShop = await shopService.findShopById(shopId);
        if (!foundShop) throw new Api404Error("ShopId Not Found");

        const createdProduct = await productService.createProduct(
            {
                ...product_data,
                product_thumb: STATIC_FILE_PATH + req.file.path,
            },
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
        const { productId } = req.query;
        const bodyUpdate = req.body;

        let product_thumb = "";
        if (req.file) {
            product_thumb = STATIC_FILE_PATH + req.file.path;
        }
        if (!shopId || !productId || !bodyUpdate)
            throw new BadRequest("Missing required arguments");

        const updatedProduct = await productService.updateProduct({
            productId,
            shopId,
            bodyUpdate,
            product_thumb,
        });

        if (!updatedProduct)
            throw new InternalServerError("Product Not Found Or Server Error");
        res.status(200).json({ message: "Product Successfully Updated" });
    },

    async deleteProduct(req, res, next) {
        try {
            const { userId: shopId } = req.user;
            const { id: productId } = req.query;

            if (!productId) throw new BadRequest("Missing required arguments");
            const deleted_product = await productService.deleteProductById({
                _id: new Types.ObjectId(productId),
                product_shop: new Types.ObjectId(shopId),
            });
            if (deleted_product.deletedCount !== 1)
                next(new InternalServerError("Err when deleting product"));
            return res.status(200).json("product successfully deleted");
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },

    async searchProductInShop(req, res) {
        const { keySearch, shopId } = req.query;
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
        const { limit = 10, skip = 0, category } = req.query;
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
                        _id: cate._id,
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
        if (!shopId) throw new BadRequest("Missing required argument");

        if (!Types.ObjectId.isValid(shopId))
            throw new BadRequest("Shop Id is not in valid type");

        const unSelect = ["roles", "status", "owner", "__v"];

        const shopDetailInfo = await shopService.getDetailOfShop(
            shopId,
            unSelect
        );
        if (!shopDetailInfo) throw new Api404Error("Shop Not Found");

        res.status(200).json({ message: "Success", metadata: shopDetailInfo });
    },
};
