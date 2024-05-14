const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const commentController = require("../controller/comment.C");
const {
    verifyToken,
    verifyUser,
    verifyShipper,
    verifyShop,
} = require("../utils/auth");
const {
    validateCreateCommentUserToShop,
    validateCreateCommentUserToShipper,
} = require("../validation/commentValidation");
const { uploadComment, convert_formData } = require("../config/multer");

// get all comments by product id
router.get("/all/", errorHandler(commentController.getAllCommentOfProduct));

router.use(verifyToken);

// get all comments of shop 
router.get("/all/shop", errorHandler(commentController.getAllCommentOfShop));

// user comment product of shop
router.post(
    "/user/shop",
    // [verifyUser, uploadComment.single("content_image")],
    validateCreateCommentUserToShop,
    errorHandler(commentController.createCommentForUser)
);

// user comment shipper
router.post(
    "/user/shipper",
    [verifyUser, convert_formData.none()],
    validateCreateCommentUserToShipper,
    errorHandler(commentController.createCommentUserToShipper)
);

router.get(
    "/user",
    verifyUser,
    errorHandler(commentController.getAllCommentOfUser)
);

router.delete(
    "/user",
    verifyUser,
    errorHandler(commentController.deleteComment)
);

// ========== SHOP ==========
router.post(
    "/shop",
    verifyShop,
    errorHandler(commentController.createCommentForShop)
);

// shop delete comment
router.delete(
    "/shop",
    verifyShop,
    errorHandler(commentController.deleteCommentByShop)
);


// ========== SHIPPER ==========
// get all comment of shipper
router.get(
    "/shipper",
    verifyShipper,
    errorHandler(commentController.getAllCommentOfShipper)
);

module.exports = router;
