const User = require("../model/user.model.js");
const { BadRequest, Api404Error } = require("../modules/CustomError.js");
const { getInfoData } = require("../utils/index.js");

module.exports = {
    async getUserById(req, res) {
        const { userId } = req.user;
        const user = await User.findById(userId);
        if (!user) throw new Api404Error("User Not Found");

        res.status(200).json(
            getInfoData({
                fields: ["phone", "created_at", "avatar", "bio", "fullname"],
                object: user,
            })
        );
    },

    async update(req, res) {
        const userId = req.headers["x-client-id"];
        const updatedUser = req.body;

        if (!userId || !updatedUser)
            throw new BadRequest("Missing some information");

        const result = await User.updateOne(
            { _id: userId },
            { $set: updatedUser }
        );

        if (result.modifiedCount === 0) throw new Api404Error("User not found");

        res.status(200).json("User successfully updated");
    },
};
