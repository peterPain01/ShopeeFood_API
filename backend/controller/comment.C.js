const shopModel = require("../model/shop.model");

module.exports = {
    async postCommentToShop(req, res, next) {
        const { userId } = req.user;
        const { shopId, star, title, content, date } = req.body;

        const storedComment = await shopModel.findByIdAndUpdate(shopId, {
            $push: {
                comment: {
                    star,
                    title,
                    comment_user: userId,
                    content,
                    date,
                },
            },
        });

        console.log("storedComment:::", storedComment);

        res.status(200).json({ message: "Success" });
    },

    async getAllCommentOfUser() {
        const { userId } = req.user;

        
    },
};
