const shipperModel = require("../model/shipper.model");
const { Types } = require("mongoose");
const { BadRequest, InternalServerError } = require("../modules/CustomError");
const userModel = require("../model/user.model");


module.exports = {
    async createShipper(req, res) {
        const { userId, roles } = req.user;
        const isAdmin = roles.indexOf("admin") !== -1;
        const isShop = roles.indexOf("shop") !== -1;
        const isShipper = roles.indexOf("shipper") !== -1;
      
        if (isAdmin || isShop || isShipper)
            throw new BadRequest("Shop | Admin | Shipper cannot be Shipper");

        const {
            license_plate_number,
            vehicle_image,
            avatar,
            currentPosition = {},
        } = req.body;

        const newShipper = await shipperModel.create({
            _id: new Types.ObjectId(userId),
            currentPosition: {
                address: "227 Nguyen Van Cu, Q5, TP.HCM",
                latlng: {
                    lat: "01012003",
                    lng: "13123",
                },
            },
            license_plate_number,
            vehicle_image,
            avatar,
            shipper_user: userId,
        });

        if (!newShipper) throw new BadRequest("Error for create new shipper");

        const user = await userModel.findByIdAndUpdate(userId, {
            $push: { roles: "shipper" },
        });

        //ROLLBACK
        if (!user) throw new InternalServerError("Error when assign roles");
        res.status(201).json({ message: "Success", metadata: newShipper });
    },

    async updateCurrentLocation() {},
};
