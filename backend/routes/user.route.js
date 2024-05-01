const express = require("express");
const UserController = require("../controller/user.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyUser } = require("../utils/auth");
const { validateUpdateUser } = require("../validation/userValidation");
const { upload } = require("../config/multer");


router.use(verifyToken, verifyUser);
router.get("/liked/shop", errorHandler(UserController.getAllShopUserLiked));
router.post("/like/shop", errorHandler(UserController.userShopLike));
router.post("/unlike/shop", errorHandler(UserController.userShopUnlike));
router.get("/", errorHandler(UserController.getUserById));
router.get("/addresses", errorHandler(UserController.getAddressUser));

router.patch("/", validateUpdateUser, errorHandler(UserController.update));
router.patch(
    "/avatar",
    upload.single("image"),
    errorHandler(UserController.uploadAvt)
);

router.post("/address", errorHandler(UserController.addUserAddress));

module.exports = router;
