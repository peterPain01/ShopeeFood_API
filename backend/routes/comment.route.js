const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const commentController = require("../controller/comment.C");
const { verifyToken, verifyUser } = require("../utils/auth");
const { validateCreateComment } = require("../validation/commentValidation");

router.use([verifyToken, verifyUser]);
router.post(
    "",
    validateCreateComment,
    errorHandler(commentController.createCommentForUser)
);
router.get("", errorHandler(commentController.getAllCommentOfUser));

router.delete("", errorHandler(commentController.deleteComment));
module.exports = router;
