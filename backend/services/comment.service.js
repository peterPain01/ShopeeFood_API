const commentModel = require("../model/comment.model");
const { InternalServerError } = require("../modules/CustomError");
const { removeNestedNullUndefined, unSelectData } = require("../utils");

// add comment
// delete comment
// get all comment of user
// get all comment of product
// Modify comment for shop owner

// phan quyen khi comment

class Comment {
    constructor(commentData) {
        this.comment_userId = commentData.userId;
        this.comment_productId = commentData.productId;
        this.comment_childId = commentData.childId;
        this.comment_content = commentData.content;
        this.comment_star = commentData.star;
        this.comment_title = commentData.title;
        this.comment_date = commentData.date;
    }
}
module.exports = {
    async createCommentForUser(commentData) {
        // check exist product Id
        const comment = new Comment(commentData);
        delete comment.comment_childId;
        removeNestedNullUndefined(comment);
        console.log("Create comment:::", comment);
        const createdComment = await commentModel.create(comment);
        return createdComment;
    },

    async getAllCommentByUserId({ userId, limit = 10, sort, page = 1 }) {
        const sortBy = sort ? sort : { createdAt: 1 };
        const filter = {
            comment_userId: userId,
        };
        return await commentModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("Product", "name image")
            .select(unSelectData(["__v", "isDelete"]));
    },

    async deleteComment(commentId, userId) {
        const filter = {
            _id: commentId,
            comment_userId: userId,
        };
        return await commentModel.findOneAndDelete(filter);
    },

    async createCommentForShop() {},
};
