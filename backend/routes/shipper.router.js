const express = require("express");
const router = express.Router();
const shipperController = require("../controller/shipper.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop, verifyUser } = require("../utils/auth");
const { validateCreateShipper } = require("../validation/shipperValidation");
const { uploadFileForShipper } = require("../config/multer");

router.use(verifyToken);
router.use(verifyUser);

router.post(
    "/create",
    uploadFileForShipper.fields([
        { name: "avatar", maxCount: 1 },
        { name: "vehicle_image", maxCount: 1 },
    ]),
    validateCreateShipper,
    errorHandler(shipperController.createShipper)
);

router.post(
    "/location/update",
    errorHandler(shipperController.updateCurrentLocation)
);

module.exports = router;
