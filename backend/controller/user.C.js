const User = require("../model/user.model.js");
const { BadRequest, Api404Error } = require("../modules/CustomError.js");
const { getInfoData, unSelectData } = require("../utils/index.js");

const STATIC_FILE_PATH = `http://localhost:${process.env.PORT}/`;

module.exports = {
    async getUserById(req, res) {
        const { userId } = req.user;
        const user = await User.findById(userId).select(
            unSelectData(["state", "addresses", "role", "__v", "password"])
        );
        if (!user) throw new Api404Error("User Not Found");

        user.avatar = STATIC_FILE_PATH + user.avatar;

        res.status(200).json({
            message: "Successful",
            metadata: user,
        });
    },

    async update(req, res) {
        const { userId } = req.user;
        const updatedUser = req.body;

        if (!userId || !updatedUser)
            throw new BadRequest("Missing some information in body");

        const result = await User.updateOne(
            { _id: userId },
            { $set: updatedUser }
        );

        if (result.modifiedCount === 0) throw new Api404Error("User not found");

        res.status(200).json("User successfully updated");
    },

    async uploadAvt(req, res) {
        const { userId } = req.user;
        const path = req.file.path;
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { avatar: path },
            },
            { upsert: true }
        );
        console.log(updateUser);
        res.status(200).json({ message: "Success Upload Avt" });
    },
};
