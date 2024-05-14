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

// this route used for zalo pay call
router.post(
    "/callback/zalopay",
    errorHandler(shipperController.handleZaloPayRecharge)
);

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

router.get("/", errorHandler(shipperController.getShipperInfo))

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

// get balance and revenue
// get revenue by day
// update balance
// balance duoc nap vao, rut ra (- tien vao balance khi hoan thanh don cash )
// revenue tien ship nhan duoc tu moi don hang

router.get(
    "/revenue/overview",
    errorHandler(shipperController.getRevenueAndBalance)
);
router.get("/history/orders", errorHandler(shipperController.getHistoryOrder))


router.post("/recharge", errorHandler(shipperController.recharge));

router.post(
    "/location/update",
    errorHandler(shipperController.updateCurrentLocation)
);

router.post("/token/save", errorHandler(shipperController.saveDeviceToken));

// ORDER
router.post(
    "/order/confirm",
    errorHandler(shipperController.shipperConfirmOrder)
);

router.post(
    "/order/finish",
    errorHandler(shipperController.shipperFinishOrder)
);


module.exports = router;
