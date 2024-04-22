const express = require("express");
const router = express.Router();
const shipperController = require("../controller/shipper.C");
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyShop } = require("../utils/auth");

router.post("/create",verifyToken, errorHandler(shipperController.createShipper));

router.post(
    "/location/update",
    errorHandler(shipperController.updateCurrentLocation)
);

module.exports = router;
