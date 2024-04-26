const shipperModel = require("../model/shipper.model");
const { Types } = require("mongoose");
const {
    BadRequest,
    InternalServerError,
    ConflictRequest,
} = require("../modules/CustomError");
const userModel = require("../model/user.model");
const shipperService = require("../services/shipper.service");
const cloudinary = require("../config/cloudinary");
const STATIC_FILE_PATH = `http://localhost:${process.env.PORT}/`;
const {
    uploadFileFromLocal,
    uploadFileFromLocalWithMulter,
} = require("../services/upload.service");
const { removeExtInFileName, deleteFileByRelativePath } = require("../utils");

module.exports = {
    async createShipper(req, res) {
        const { userId } = req.user;
        const { license_plate_number, balance } = req.body;

        const foundShipper = await shipperService.findShipperById(userId);
        if (foundShipper)
            throw new ConflictRequest("Phone was used to register Driver");

        const { image_url: avatar_uploaded_path } = await uploadFileFromLocal(
            req.files["avatar"][0].path,
            removeExtInFileName(req.files["avatar"][0].filename),
            process.env.CLOUDINARY_SHIPPER_AVATAR_PATH
        );

        const { image_url: vehicle_image_uploaded_path } =
            await uploadFileFromLocal(
                req.files["vehicle_image"][0].path,
                removeExtInFileName(req.files["vehicle_image"][0].filename),
                process.env.CLOUDINARY_SHIPPER_VEHICLE_PATH
            );

        if (!avatar_uploaded_path || !vehicle_image_uploaded_path) {
            deleteFileByRelativePath(req.files["avatar"][0].path);
            deleteFileByRelativePath(req.files["vehicle_image"][0].path);
            throw new InternalServerError(
                "Server Failed network error !!!Cant upload avatar or vehicle. "
            );
        }
        const newShipper = await shipperModel.create({
            _id: new Types.ObjectId(userId),
            license_plate_number,
            vehicle_image: vehicle_image_uploaded_path,
            avatar: avatar_uploaded_path,
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

    async updateCurrentLocation() {
        const { userId } = req.user;
        const { address } = req.body;
        const updatedAddress = await shipperModel.findByIdAndUpdate(userId, {
            $set: { currentPosition: address },
        });
        console.log("updatedAddress:::", updatedAddress);
        res.status(200).json({ message: "Success" });
    },

    async updateShipper(req, res, next) {
        const { userId } = req.user;
        const updateBody = req.body;
        const updatedShipper = await shipperModel.findByIdAndUpdate(userId, {
            $set: { ...updateBody },
        });
        if (!updatedShipper)
            throw new InternalServerError("Cant not update shipper info");

        res.status(200).json({ message: "Success" });
    },

    async updateAvatar(req, res, next) {
        const { userId } = req.user;
        if (!req?.file) throw new BadRequest("Missing avatar image");

        try {
            const image_url = await uploadFileFromLocalWithMulter(req.file);
            await shipperModel.findByIdAndUpdate(userId, {
                $set: { avatar: image_url },
            });
        } catch (err) {
            return next(err);
        }
        res.status(200).json({ message: "Success" });
    },

    async updateVehicleImage(req, res, next) {
        const { userId } = req.user;
        if (!req?.file) throw new BadRequest("Missing vehicle image");
        try {
            const image_url = await uploadFileFromLocalWithMulter(req.file);
            await shipperModel.findByIdAndUpdate(userId, {
                vehicle_image: image_url,
            });
        } catch (err) {
            return next(err);
        }

        res.status(200).json({ message: "Success" });
    },
};
