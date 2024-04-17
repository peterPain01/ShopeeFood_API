const { Types } = require("mongoose");
const cartModel = require("../model/cart.model");
const { Api404Error, InternalServerError } = require("../modules/CustomError");
const cartService = require("../services/cart.service");
const productService = require("../services/product.service");

module.exports = {
    // ============== access db [4 TIMES] in bad case
    async addProductToCart(req, res) {
        const { userId } = req.user;
        const { id: productId } = req.params;

        const foundProduct = await productService.checKExistProduct(productId);
        if (!foundProduct) throw new Api404Error("Product Not Found");

        const foundCart = await cartModel.findOne({
            cart_userId: new Types.ObjectId(userId),
        });

        const productToAdd = {
            productId: foundProduct._id,
            name: foundProduct.product_name,
            price: foundProduct.product_price,
            quantity: 1,
        };

        if (!foundCart) {
            const newCart = await cartService.createCart(userId, productToAdd);
            if (!newCart)
                throw new InternalServerError("Error while creating cart");
            return res.status(200).json("Product Successfully Added to Cart");
        } else {
            if (!foundCart?.cart_products?.length) {
                foundCart.cart_products = [productToAdd];
                foundCart.cart_count_product = 1;
                await foundCart.save();
            } else {
                const result = await cartService.addProductToCart(
                    userId,
                    productToAdd
                );
                if (!result)
                    throw InternalServerError(
                        "Error while adding product to cart"
                    );
            }
        }
        res.status(200).json("Product Successfully Added to Cart");
    },

    // get list to cart
    async getCart(req, res) {
        const { userId } = req.user;
        const cart = await cartModel.findOne({
            cart_userId: new Types.ObjectId(userId),
        });

        if (!cart) throw new Api404Error("Cart Not Found");
        return res.status(200).json(cart);
    },
    // delete cart Item
    async removeProductFromCart(req, res) {},
    // delete cart
    async deleteCart(req, res) {},

    // reduce product quantity
    // inc  product quantity
};
