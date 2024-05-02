const shopModel = require("../model/shop.model");
const userModel = require("../model/user.model");
const cartModel = require("../model/cart.model");
const { getSelectData } = require("../utils");

module.exports = {
    async handleUserShopLike(shopId, userId) {
        const updateUser = {
            $addToSet: { shop_liked: shopId },
        };
        const updateShop = {
            $addToSet: { user_liked: userId },
        };

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateUser,
            { new: true }
        );
        const updatedShop = await shopModel.findByIdAndUpdate(
            shopId,
            updateShop,
            { new: true }
        );
        return updatedUser, updatedShop;
    },

    async handleUserShopUnlike(shopId, userId) {
        const updateUser = {
            $pull: { shop_liked: shopId },
        };
        const updateShop = {
            $pull: { user_liked: userId },
        };
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateUser,
            { new: true }
        );
        const updatedShop = await shopModel.findByIdAndUpdate(
            shopId,
            updateShop,
            { new: true }
        );

        return { updatedUser, updatedShop };
    },

    async getAllShopUserLiked(userId) {
        const user = await userModel.findById(userId);
        const select = [
            "_id",
            "name",
            "image",
            "avatar",
            "description",
            "open_hour",
            "close_hour",
            "avg_rating",
        ];
        return (
            await userModel.populate(user, {
                path: "shop_liked",
                select: getSelectData(select),
            })
        ).shop_liked;
    },

    async getAddressUser(userId) {
        const user = await userModel.findById(userId);
        return user.addresses[0] || null;
    },
    async getTotalItemInCart(userId) {
        const filter = {
            cart_user: userId,
        };
        const cart = await cartModel.findOne(filter);
        return cart.cart_count_product;
    },
};
