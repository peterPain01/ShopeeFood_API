const shipperModel = require("../model/shipper.model");
const { Types } = require("mongoose");
const {
    BadRequest,
    InternalServerError,
    ConflictRequest,
} = require("../modules/CustomError");
const userModel = require("../model/user.model");
const shipperService = require("../services/shipper.service");

module.exports = {
    async createShipper(req, res) {
        const { userId, roles } = req.user;
        const isAdmin = roles.indexOf("admin") !== -1;
        const isShop = roles.indexOf("shop") !== -1;
        const isShipper = roles.indexOf("shipper") !== -1;

        if (isAdmin || isShop || isShipper)
            throw new BadRequest("Shop | Admin | Shipper cannot be Shipper");
        const foundShipper = await shipperService.findShipperById(userId);
        if (foundShipper)
            throw new ConflictRequest("Phone was used to register Driver");

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
            $set: { roles: "shipper" },
        });

        //ROLLBACK
        if (!user) throw new InternalServerError("Error when assign roles");
        res.status(401).json({
            message: "Success Create Shipper Record! Need re-login",
            metadata: newShipper,
        });
    },

    // update shipper information
    async updateCurrentLocation() {},
};
