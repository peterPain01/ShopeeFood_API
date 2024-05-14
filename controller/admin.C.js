const shipperService = require("../services/shipper.service");
const User = require("../model/user.model");

module.exports = {
    async getAllShippers(req, res) {
        const shippers = await shipperService.getAllShippers();
        if (!shippers) throw new Api404Error("Shipper Not Found");

        res.status(200).send({ message: "Success", metadata: { shippers } });
    },

    async getAllUser(req, res) {
        const users = await User.find();
        if (!users) throw new Error("Users Not Found");
        return res.status(200).json(users);
    },
    // create Admin 
};
