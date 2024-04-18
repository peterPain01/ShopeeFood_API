const User = require("../model/user.model.js");
const { BadRequest, Api404Error } = require("../modules/CustomError.js");
const { getInfoData } = require("../utils/index.js");

module.exports = {
    // only admin role
    async getAllUser(req, res) {
        const users = await User.find();
        if (!users) throw new Error("Users Not Found");
        return res.status(200).json(users);
    },

    async getUserById(req, res) {
        const { userId } = req.user;
        if (!userId) throw new BadRequest("Missing some information");
        const user = await User.findById({ _id: userId });
        if (!user) throw new Api404Error("User Not Found");
        res.status(200).json(
            getInfoData({
                fields: ["_id", "email", "created_at"],
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
