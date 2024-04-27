const { Types } = require("mongoose");
const cartModel = require("../model/cart.model");
const {
    BadRequest,
    InternalServerError,
    Api404Error,
} = require("../modules/CustomError");

module.exports = {
    async checKExistCart(cardId) {
        return await cartModel.findById(cardId).lean();
    },

    async findCartByUserId(userId) {
        return await cartModel.findOne({
            cart_user: new Types.ObjectId(userId),
        });
    },

    async findCartByUserIdAndUpdate(userId, update) {
        return await cartModel.findOneAndUpdate(
            {
                cart_user: new Types.ObjectId(userId),
            },
            update
        );
    },

    async createCart(userId, shopId, productToAdd) {
        return await cartModel.create({
            cart_products: [productToAdd],
            cart_user: userId,
            cart_count_product: productToAdd.quantity,
            cart_shop: shopId,
        });
    },

    async addProductToCart(userId, shopId, productToAdd) {
        const { productId, quantity } = productToAdd;
        const filter = {
            cart_user: new Types.ObjectId(userId),
            "cart_products.productId": productId,
        };

        const foundProductInCart = await cartModel.findOne(filter);

        if (foundProductInCart) {
            const update = {
                $inc: {
                    "cart_products.$.quantity": +quantity,
                    cart_count_product: +quantity,
                },
            };
            return await cartModel.findOneAndUpdate(filter, update, {
                new: true,
            });
        } else {
            return await cartModel.findOneAndUpdate(
                { cart_user: new Types.ObjectId(userId) },
                {
                    $push: { cart_products: productToAdd },
                    $inc: { cart_count_product: +quantity },
                },
                { new: true }
            );
        }
    },

    async deleteCartByUserId(userId) {
        const filter = {
            cart_user: new Types.ObjectId(userId),
        };
        return await cartModel.deleteOne(filter);
    },

    async removeProductFormCart(productId, userId) {
        const foundProduct = await cartModel.findOne(
            {
                cart_user: userId,
                "cart_products.productId": new Types.ObjectId(productId),
            },
            {
                cart_products: {
                    $elemMatch: { productId: new Types.ObjectId(productId) },
                },
            }
        );

        const quantity = foundProduct?.cart_products[0]?.quantity;
        if (!quantity) throw new BadRequest("Product may be not exist in cart");

        const filter = { cart_user: userId };
        const update = {
            $pull: {
                cart_products: { productId: new Types.ObjectId(productId) },
            },
            $inc: {
                cart_count_product: quantity * -1,
            },
        };
        return await cartModel.findOneAndUpdate(filter, update, { new: true });
    },

    async reduceProductQuantity(product_id, userId) {
        const filter = {
            cart_user: userId,
            "cart_products.productId": new Types.ObjectId(product_id),
            "cart_products.quantity": { $gt: 1 },
        };
        const update = {
            $inc: {
                "cart_products.$.quantity": -1,
                cart_count_product: -1,
            },
        };
        return await cartModel.findOneAndUpdate(filter, update, { new: true });
    },

    async incProductQuantity(product_id, userId) {
        const filter = {
            cart_user: userId,
            "cart_products.productId": new Types.ObjectId(product_id),
        };
        const update = {
            $inc: {
                "cart_products.$.quantity": 1,
                cart_count_product: 1,
            },
        };
        return await cartModel.findOneAndUpdate(filter, update, { new: true });
    },
};
