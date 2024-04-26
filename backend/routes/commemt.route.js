const express = require("express");
const router = express.Router();
const errorHandler = require("../utils/errorHandler");
const commentController = require("../controller/comment.C");

router.post("", errorHandler(commentController.postCommentToShop));

module.exports = router;
