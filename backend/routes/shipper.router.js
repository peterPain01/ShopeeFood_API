const express = require("express");
const router = express.Router();
const shipperController = require("../controller/shipper.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShipper, verifyUser } = require("../utils/auth");
const {
    validateCreateShipper,
    validateUpdateShipper,
} = require("../validation/shipperValidation");
const { uploadFileForShipper } = require("../config/multer");

router.use(verifyToken);
router.post(
    "/create",
    verifyUser,
    uploadFileForShipper.fields([
        { name: "avatar", maxCount: 1 },
        { name: "vehicle_image", maxCount: 1 },
    ]),
    validateCreateShipper,
    errorHandler(shipperController.createShipper)
);

router.use(verifyShipper);

router.patch(
    "/update-info",
    validateUpdateShipper,
    errorHandler(shipperController.updateShipper)
);

router.patch(
    "/update/avatar",
    uploadFileForShipper.single("avatar"),
    errorHandler(shipperController.updateAvatar)
);

router.patch(
    "/update/vehicle",
    uploadFileForShipper.single("vehicle_image"),
    errorHandler(shipperController.updateVehicleImage)
);

router.post(
    "/location/update",
    errorHandler(shipperController.updateCurrentLocation)
);

router.post("/token/save", errorHandler(shipperController.saveDeviceToken));

module.exports = router;
