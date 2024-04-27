const { model, Schema, Types } = require("mongoose");

const commentSchema = new Schema(
    {
        comment_userId: { type: Types.ObjectId, required: true, ref: "User" },
        comment_productId: {
            type: Types.ObjectId,
            required: true,
            ref: "Product",
        },
        comment_childId: { type: Types.ObjectId, ref: "Comment" },
        comment_content: { type: String, required: true },
        comment_star: { type: Number, required: true },
        comment_title: { type: String, required: true },
        comment_date: { type: Date, required: true },
        isDelete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = model("Comment", commentSchema);
