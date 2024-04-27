const shopModel = require("../model/shop.model");
const { InternalServerError, BadRequest } = require("../modules/CustomError");
const commentService = require("../services/comment.service");

module.exports = {
    async createCommentForUser(req, res) {
        const { userId } = req.user;
        const commentData = { ...req.body, userId };

        const createdComment = commentService.createCommentForUser(commentData);
        if (!createdComment)
            throw new InternalServerError(
                "Some error ocurred when create comment"
            );
        res.status(200).json({ message: "Success" });
    },

    async getAllCommentOfUser(req, res) {
        const { userId } = req.user;
        const comments = await commentService.getAllCommentByUserId({ userId });
        res.status(200).json({ message: "Success", metadata: comments || [] });
    },

    // xac dinh xem cua user nao
    async deleteComment(req, res) {
        const { userId } = req.user;
        const { commentId } = req.query;
        if (!commentId)
            throw new BadRequest("Missing commentId in query params");

        const temp = await commentService.deleteComment(commentId, userId);
        if (!temp)
            throw new InternalServerError(
                "Error occurred when deleting comment"
            );
        res.status(200).json({ message: "Successful" });
    },
};
