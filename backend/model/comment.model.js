const { model, Schema, Types } = require("mongoose");
const config = require("../config/common");
const { required } = require("joi");

const commentSchema = new Schema(
    {
        comment_userId: { type: Types.ObjectId, required: true, ref: "User" },
        comment_userAvatar: {
            type: String,
            default:
                "https://res.cloudinary.com/shoppefood/image/upload/v1714384176/avatar/etgihepxtpq43tzaxhid.jpg",
        },
        comment_productId: {
            type: Types.ObjectId,
            ref: "Product",
        },
        comment_shopId: { type: Types.ObjectId, ref: "Shop" },
        comment_shipperId: { type: Types.ObjectId, ref: "Shipper" },
        comment_orderId: { type: Types.ObjectId, ref: "Order", required: true },
        comment_childId: { type: Types.ObjectId, ref: "Comment" },
        comment_type: {
            type: Number,
            required: true,
            enum: [
                config.USER_COMMENT_SHOP,
                config.SHOP_REPLY_USER,
                config.USER_COMMENT_SHIPPER,
            ],
        },

        comment_content_text: { type: String, required: true },
        comment_content_image: String,
        comment_star: Number,
        comment_title: String,
        comment_date: { type: Date, default: Date.now() },
        isDelete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = model("Comment", commentSchema);
