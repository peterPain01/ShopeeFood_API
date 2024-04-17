const { Types } = require("mongoose");
const cartModel = require("../model/cart.model");
const { update } = require("lodash");

module.exports = {
    async checKExistCart(cardId) {
        return await cartModel.findById(cardId).lean();
    },

    async createCart(userId, productToAdd) {
        return await cartModel.create({
            cart_products: [productToAdd],
            cart_userId: new Types.ObjectId(userId),
            cart_count_product: 1,
        });
    },

    async addProductToCart(userId, productToAdd) {
        const { productId, quantity } = productToAdd;
        const filter = {
            cart_userId: new Types.ObjectId(userId),
            "cart_products.productId": productId,
        };
        const update = {
            $inc: {
                "cart_products.$.quantity": quantity,
            },
        };
        const options = { new: true };
        const foundProduct = await cartModel.findOne(filter);
        if (foundProduct) {
            return await cartModel.findOneAndUpdate(filter, update, options);
        } else {
            return await cartModel.findOneAndUpdate(
                { cart_userId: new Types.ObjectId(userId) },
                { $push: { cart_products: productToAdd } },
                options
            );
        }
    },
};
