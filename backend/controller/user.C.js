const userModel = require("../model/user.model.js");
const User = require("../model/user.model.js");
const {
    BadRequest,
    Api404Error,
    InternalServerError,
} = require("../modules/CustomError.js");
const {
    uploadFileFromLocal,
    uploadFileFromLocalWithMulter,
} = require("../services/upload.service.js");
const {
    getInfoData,
    unSelectData,
    removeExtInFileName,
    deleteFileByRelativePath,
    findShippingFee: findShippingFeeByDistance,
    distanceBetweenTwoPoints,
} = require("../utils/index.js");
const userService = require("../services/userService.js");
const cartService = require("../services/cart.service.js");
const shopService = require("../services/shop.service.js");

module.exports = {
    async getUserById(req, res) {
        const { userId } = req.user;

        const user = await User.findById(userId).select({
            ...unSelectData(["state", "role", "__v", "password"]),
        });
        if (!user) throw new Api404Error("User Not Found");

        res.status(200).json({
            message: "Successful",
            metadata: user,
        });
    },

    async getOverviewInfo(req, res) {
        const { userId } = req.user;
        const address = await userService.getAddressUser(userId);
        const totalItem = await userService.getTotalItemInCart(userId);
        res.status(200).json({
            message: "Success",
            metadata: { address, totalItem },
        });
    },

    async getAddressUser(req, res) {
        const { userId } = req.user;

        const userAddr = await User.findById(userId).select({
            addresses: 1,
            _id: 0,
        });

        if (!userAddr) throw new Api404Error("User Not Found");

        res.status(200).json({
            message: "Successful",
            metadata: userAddr.addresses,
        });
    },

    async update(req, res) {
        const { userId } = req.user;
        let updatedUser = req.body;
        console.log(updatedUser);

        if (!userId || !updatedUser)
            throw new BadRequest("Missing some information in body");

        const file = req?.file;
        let file_path = "";
        if (file) {
            const { image_url } = await uploadFileFromLocal(
                req.file.path,
                removeExtInFileName(req.file.filename),
                process.env.CLOUDINARY_AVATAR_PATH
            );
            if (!image_url) {
                deleteFileByRelativePath(req.file.path);
                throw new InternalServerError(
                    "Network server Error, Please Try Again"
                );
            }
            file_path = image_url;
        }
        if (file_path) {
            updatedUser = { ...updatedUser, avatar: file_path };
        }
        const result = await User.updateOne(
            { _id: userId },
            { $set: { ...updatedUser } }
        );

        if (result.modifiedCount === 0) throw new Api404Error("User not found");

        res.status(200).json({
            message: "User successfully updated",
        });
    },

    async uploadAvt(req, res) {
        const { userId } = req.user;
        const path = req?.file?.path || "";
        if (!path) throw new BadRequest("Missing avatar image");
        const { image_url } = await uploadFileFromLocal(
            req.file.path,
            removeExtInFileName(req.file.filename),
            process.env.CLOUDINARY_AVATAR_PATH
        );
        if (!image_url) {
            deleteFileByRelativePath(req.file.path);
            throw new InternalServerError("Cant put avatar to cloud");
        }
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { avatar: image_url },
            },
            { upsert: true }
        );
        console.log(updateUser);
        res.status(200).json({ message: "Success Upload Avt" });
    },

    async userShopLike(req, res) {
        const { shopId } = req.query;
        const { userId } = req.user;
        if (!shopId) throw new BadRequest("Missing required arguments");

        const { updatedUser, updatedShop } =
            await userService.handleUserShopLike(shopId, userId);
        res.status(200).json({ message: "Successful" });
    },

    async userShopUnlike(req, res) {
        const { shopId } = req.query;
        const { userId } = req.user;

        if (!shopId) throw new BadRequest("Missing required arguments");

        const { updatedUser, updatedShop } =
            await userService.handleUserShopUnlike(shopId, userId);
        res.status(200).json({ message: "Successful" });
    },

    async getAllShopUserLiked(req, res) {
        const { userId } = req.user;
        const { sortBy = "latest" } = req.query;

        const shops = await userService.getAllShopUserLiked(userId);
        // cause push in mongo ==== push back
        if (sortBy.toLocaleLowerCase() === "latest".toLocaleLowerCase()) {
            shops?.reverse();
        }
        res.status(200).json({ message: "Successful", metadata: shops || [] });
    },

    async findShippingFee(req, res) {
        const { userId } = req.user;
        const { lat, lng } = req.query;
        if (!lat || !lng) throw new BadRequest("Missing lat lng in req.query");
        const cartOfUser = await cartService.findCartByUserId(userId);
        console.log("cartOfUser:::", cartOfUser);
        const shop = await shopService.findShopById(cartOfUser.cart_shop);
        console.log("shop:::", shop);

        const distanceShopUser = distanceBetweenTwoPoints(
            lat,
            lng,
            shop.addresses[0].latlng.lat,
            shop.addresses[0].latlng.lng
        );

        console.log(distanceShopUser);
        const shippingFee = findShippingFeeByDistance(distanceShopUser);
        console.log("shippingFee::", shippingFee);
        res.status(200).json({ message: "Success", metadata: shippingFee });
    },
};
