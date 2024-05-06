const express = require("express");
const UserController = require("../controller/user.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyUser } = require("../utils/auth");
const { validateUpdateUser } = require("../validation/userValidation");
const { uploadUserAvatar, upload } = require("../config/multer");

router.use(verifyToken, verifyUser);
// get user address and count cart items
router.get("/overview", errorHandler(UserController.getOverviewInfo));
router.get("/liked/shop", errorHandler(UserController.getAllShopUserLiked));
router.post("/like/shop", errorHandler(UserController.userShopLike));
router.post("/unlike/shop", errorHandler(UserController.userShopUnlike));
router.get("/", errorHandler(UserController.getUserById));
router.get("/addresses", errorHandler(UserController.getAddressUser));


router.get('/shippingFee', errorHandler(UserController.findShippingFee))

// update entire (contain avatar)
router.patch(
    "/",
    [uploadUserAvatar.single("avatar"), validateUpdateUser],
    errorHandler(UserController.update)
);

// upload only avatar
router.patch(
    "/avatar",
    upload.single("image"),
    errorHandler(UserController.uploadAvt)
);

module.exports = router;
