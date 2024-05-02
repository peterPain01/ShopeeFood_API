const commentModel = require("../model/comment.model");
const { InternalServerError } = require("../modules/CustomError");
const {
    removeNestedNullUndefined,
    unSelectData,
    getSelectData,
} = require("../utils");
const config = require("../config/common");
const userModel = require("../model/user.model");

// add comment
// delete comment
// get all comment of user
// get all comment of product
// Modify comment for shop owner

// phan quyen khi comment

/*
    user comment shop
    user id, product id, comment_type, content, text, image, star, title ,date  

    user comment shipper 
    user id, shipper id , comment_type, content, text , image, start ,date

    shop reply comment 
    user id 
*/
class Comment {
    constructor(commentData) {
        this.comment_userId = commentData.userId;
        this.comment_shopId = commentData.shopId;
        this.comment_shipperId = commentData.shipperId;
        this.comment_orderId = commentData.orderId;
        this.comment_productId = commentData.productId;
        this.comment_content_text = commentData.content_text;
        this.comment_content_image = commentData.content_image;
        this.comment_star = commentData.star;
        this.comment_title = commentData.title;
        this.comment_date = commentData.date;
        this.comment_type = commentData.type;
    }
}
module.exports = {
    // create comment user to shop
    async createCommentForUser(commentData) {
        const comment = new Comment(commentData);
        removeNestedNullUndefined(comment);
        console.log("Create comment:::", comment);
        return await commentModel.create(comment);
    },

    // create comment user to shipper
    async createCommentUserToShipper(commentData) {
        const comment = new Comment(commentData);
        removeNestedNullUndefined(comment);
        return await commentModel.create(comment);
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
        const commentToDelete = await commentModel.findOne({
            _id: commentId,
            comment_userId: userId,
        });
        if (!commentToDelete) return null;

        // delete current comment and its child
        await commentModel.deleteMany({
            $or: [{ _id: commentId }, { _id: commentToDelete.comment_childId }],
        });
        return commentModel;
    },

    async deleteCommentByShop(commentId, shopId) {
        const filter = {
            comment_shopId: shopId,
            _id: commentId,
        };

        return await commentModel.findOneAndDelete(filter);
    },

    async getCommentById(commentId) {
        return await commentModel.findById(commentId);
    },

    // reply the comment that have commentId
    async createCommentForShop(userId, shopId, content) {
        const bodyCreate = {
            comment_userId: userId,
            comment_shopId: shopId,
            comment_type: config.SHOP_REPLY_USER,
            comment_content: {
                content_text: content,
            },
        };
        return await commentModel.create(bodyCreate);
    },

    async getAllCommentOfShipper(shipperId, unSelect = []) {
        const filter = {
            comment_shipperId: shipperId,
        };
        return await commentModel.find(filter).select(unSelectData(unSelect));
    },

    async getCommentByProductId({ productId, limit = 10, page = 1 }) {
        const comments = await commentModel
            .find({
                comment_productId: productId,
            })
            .skip((page - 1) * limit)
            .populate("comment_userId", "avatar")
            .limit(limit);
        console.log("comments", comments);
        const populatedComments = comments.map((comment) => {
            const { avatar } = comment.comment_userId;
            return {
                ...comment.toObject(),
                comment_userId: comment.comment_userId._id,
                comment_userAvatar: avatar,
            };
        });
        console.log("populatedComments", populatedComments);

        return populatedComments;
    },

    async getAllCommentOfShop(shopId, unSelect) {
        const filter = {
            comment_shopId: shopId,
        };
        let comments = await commentModel
            .find(filter)
            .select(unSelectData(unSelect))
            .populate("comment_userId", "avatar")
            .exec();
        return comments;
    },
};

// create function to compare object id get from client with get from database
// restrict the comment
