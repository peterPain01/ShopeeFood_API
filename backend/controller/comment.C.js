const { InternalServerError, BadRequest } = require("../modules/CustomError");
const commentService = require("../services/comment.service");
const productService = require("../services/product.service");
const { uploadFileFromLocalWithMulter } = require("../services/upload.service");
const { deleteFileByRelativePath } = require("../utils");
const userModel = require("../model/user.model");
const config = require("../config/common");

module.exports = {
    // user comment shop
    async createCommentForUser(req, res) {
        const { userId } = req.user;
        let commentData = { ...req.body };

        const foundProduct = await productService.getProductById({
            productId: commentData.productId,
        });

        const foundUser = await userModel.findById(userId);
        if (!foundProduct) throw new BadRequest("Product Not Found");

        if (req.file) {
            let image_uploaded_url = await uploadFileFromLocalWithMulter(
                req.file,
                process.env.CLOUDINARY_USER_COMMENT
            );
            if (!image_uploaded_url) deleteFileByRelativePath(req.file.path);
            commentData = {
                ...commentData,
                content_text: commentData.content_text,
                content_image: image_uploaded_url || "",
            };
        }

        commentData = {
            ...commentData,
            type: config.USER_COMMENT_SHOP,
            userId,
            userAvatar: foundUser.avatar,
            shopId: foundProduct.product_shop,
        };
        const createdComment = await commentService.createCommentForUser(
            commentData
        );
        if (!createdComment)
            throw new InternalServerError(
                "Some error ocurred when create comment"
            );
        res.status(200).json({ message: "Comment Successful Created" });
    },

    // user comment shipper
    async createCommentUserToShipper(req, res) {
        const { userId } = req.user;
        let commentData = {
            ...req.body,
            userId,
            type: config.USER_COMMENT_SHIPPER,
        };
        const newComment = await commentService.createCommentUserToShipper(
            commentData
        );
        if (!newComment)
            throw InternalServerError(
                "Error occurred when create comment for user to shipper "
            );

        res.status(200).json({ message: "Comment Successfully Created" });
    },

    // get all comment of user
    async getAllCommentOfUser(req, res) {
        const { userId } = req.user;
        const comments = await commentService.getAllCommentByUserId({ userId });
        res.status(200).json({ message: "Success", metadata: comments || {} });
    },

    // user delete comment
    async deleteComment(req, res) {
        const { userId } = req.user;
        const { commentId } = req.query;
        if (!commentId)
            throw new BadRequest("Missing commentId in query params");

        const deletedComment = await commentService.deleteComment(
            commentId,
            userId
        );
        if (!deletedComment)
            throw new InternalServerError(
                "Error occurred when deleting comment"
            );
        res.status(200).json({ message: "Successful" });
    },

    // SHOP
    // shop create comment
    async createCommentForShop(req, res) {
        const { userId: shopId } = req.user;
        const { commentId } = req.query;
        const { content } = req.body;
        const repliedComment = await commentService.getCommentById(commentId);
        const isCommentOfShop = repliedComment?.comment_shopId
            ?.toString()
            .includes(shopId);
        if (!repliedComment || !isCommentOfShop)
            throw new BadRequest(
                "You don't have permission to reply to this comment."
            );

        if (repliedComment.comment_childId)
            throw new InternalServerError(
                "This comment has already been replied to by the shop"
            );

        const newComment = await commentService.createCommentForShop(
            repliedComment.comment_userId,
            shopId,
            content
        );
        if (!newComment) throw InternalServerError();

        repliedComment.comment_childId = result._id;
        await repliedComment.save();

        res.status(200).json({ message: "Reply successfully submitted" });
    },

    // shop delete comment
    async deleteCommentByShop(req, res) {
        const { userId: shopId } = req.user;
        const commentId = req.query;

        const deletedComment = await commentService.deleteCommentByShop(
            commentId,
            shopId
        );
        if (!deletedComment)
            throw new InternalServerError(
                "Some error occurred when deleting comment of Shop"
            );
        res.status(200).json({ message: "Comment Successfully Deleted" });
    },

    async getAllCommentOfShop(req, res) {
        const { shopId } = req.query;
        const unSelect = [
            "__v",
            "isDelete",
            "comment_type",
            "createdAt",
            "updatedAt",
            "comment_productId",
            "comment_orderId"
        ];
        const comments = await commentService.getAllCommentOfShop(
            shopId,
            unSelect
        );
        res.status(200).json({
            message: "Successful",
            metadata: comments || {},
        });
    },
    // SHIPPER
    // shipper get all comment
    async getAllCommentOfShipper(req, res) {
        const { userId: shipperId } = req.user;
        const unselect = [
            "__v",
            "comment_content_image",
            "comment_type",
            "comment_childId",
            "comment_orderId",
        ];
        const comments = await commentService.getAllCommentOfShipper(
            shipperId,
            unselect
        );
        res.status(200).json({
            message: "Successful",
            metadata: comments || {},
        });
    },

    // PRODUCT
    async getAllCommentOfProduct(req, res) {
        const { productId, page = 1, limit = 10 } = req.query;
        if (!productId)
            throw new BadRequest("Missing productId on query param");
        const comments = await commentService.getCommentByProductId({
            productId,
            page,
            limit,
        });
        res.status(200).json({
            message: "Get all Comments of products successful",
            metadata: comments || {},
        });
    },
};
