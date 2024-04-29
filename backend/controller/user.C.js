const userModel = require("../model/user.model.js");
const User = require("../model/user.model.js");
const {
    BadRequest,
    Api404Error,
    InternalServerError,
} = require("../modules/CustomError.js");
const { uploadFileFromLocal } = require("../services/upload.service.js");
const {
    getInfoData,
    unSelectData,
    removeExtInFileName,
    deleteFileByRelativePath,
} = require("../utils/index.js");

module.exports = {
    async getUserById(req, res) {
        const { userId } = req.user;

        const user = await User.findById(userId).select({
            ...unSelectData(["state", "role", "__v", "password"]),
            password: 1,
        });
        if (!user) throw new Api404Error("User Not Found");

        res.status(200).json({
            message: "Successful",
            metadata: user,
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
        const updatedUser = req.body;
        console.log(updatedUser);

        if (!userId || !updatedUser)
            throw new BadRequest("Missing some information in body");

        const result = await User.updateOne(
            { _id: userId },
            { $set: { addresses: updatedUser.addresses } }
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
};
