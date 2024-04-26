const express = require("express");
const UserController = require("../controller/user.C");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, verifyUser } = require("../utils/auth");
const { validateUpdateUser } = require("../validation/userValidation");
const { upload } = require("../config/multer");

router.use(verifyToken, verifyUser);

router.get("/", errorHandler(UserController.getUserById));
router.patch("/", validateUpdateUser, errorHandler(UserController.update));
router.patch(
    "/avatar",
    upload.single("image"),
    errorHandler(UserController.uploadAvt)
);

router.post("/address",  errorHandler(UserController.addUserAddress));

module.exports = router;
