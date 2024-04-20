const { Api404Error } = require("../modules/CustomError");
const cartService = require("../services/cart.service");
const productService = require("../services/product.service");
module.exports = {
    /* 
        originalPrice // gia chua giam 
        totalPrice  // gia da giam 
        discountPrice // gia tien giam duoc 
        // get user address and count fee 
        feeShip 
    */
    async checkoutReview(req, res) {
        const { userId } = req.user;

        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products)
            throw new Api404Error("Cart Not Found");

        let sum = 0;
        // await Promise.all(foundCart.cart_products?.forEach(async (product) => {
        //     const foundProduct = await productService.getProductById({
        //         product_id: product.productId,
        //         unSelect: ["__v"],  
        //     });
        //     sum += foundProduct.product_original_price;
        // }))
           
        res.status(200).send(sum);
    },
};
