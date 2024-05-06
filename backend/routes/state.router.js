const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken } = require("../utils/auth");
const shipperModel = require("../model/shipper.model");

router.use(verifyToken);
router.get(
    "/",
    errorHandler(async (req, res, next) => {
        const { userId, role } = req.user;
        const { state } = req.query;
        if (!state || (state != "inactive" && state != "active")) {
        } else {
            if (role === "shipper") {
                const isActive = state == "active" ? true : false;
                const result = await shipperModel.findByIdAndUpdate(
                    userId,
                    {
                        $set: { isActive },
                    },
                    { new: true }
                );
                console.log("Shipper state:::", result.isActive);
            }
        }
        res.status(200).json({ message: "Success" });
    })
);

module.exports = router;
