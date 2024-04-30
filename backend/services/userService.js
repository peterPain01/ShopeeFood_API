const shopModel = require("../model/shop.model");
const userModel = require("../model/user.model");
const { getSelectData } = require("../utils");

module.exports = {
    async handleUserShopLike(shopId, userId) {
        const updateUser = {
            $addToSet: { shop_liked: shopId },
        };
        const updateShop = {
            $addToSet : { user_liked: userId },
        };

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateUser, { new: true });
        const updatedShop = await shopModel.findByIdAndUpdate(shopId, updateShop, { new: true });
        return (updatedUser, updatedShop)
    },

    async getAllShopUserLiked(userId)
    { 
        const user = await userModel.findById(userId)
        const select = ["_id", "name", "image", "description", "open_hour", "close_hour"]
        return (await userModel.populate(user, {path: 'shop_liked', select: getSelectData(select)})).shop_liked
    }
};
