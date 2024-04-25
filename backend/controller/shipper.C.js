const shipperModel = require("../model/shipper.model");
const { Types } = require("mongoose");
const {
    BadRequest,
    InternalServerError,
    ConflictRequest,
} = require("../modules/CustomError");
const userModel = require("../model/user.model");
const shipperService = require("../services/shipper.service");

const STATIC_FILE_PATH = `http://localhost:${process.env.PORT}/`;

module.exports = {
    async createShipper(req, res) {
        const { userId } = req.user;

        const foundShipper = await shipperService.findShipperById(userId);
        if (foundShipper)
            throw new ConflictRequest("Phone was used to register Driver");

        const { license_plate_number, balance } = req.body;

        const avatar = STATIC_FILE_PATH + req.files["avatar"][0].path;
        const vehicle_image =
            STATIC_FILE_PATH + req.files["vehicle_image"][0].path;

        const newShipper = await shipperModel.create({
            _id: new Types.ObjectId(userId),
            license_plate_number,
            vehicle_image,
            avatar,
            shipper_user: userId,
        });

        if (!newShipper) throw new BadRequest("Error for create new shipper");

        const user = await userModel.findByIdAndUpdate(userId, {
            $set: { role: "shipper" },
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
