const cartModel = require("../model/cart.model");
const {
    Api404Error,
    InternalServerError,
    BadRequest,
} = require("../modules/CustomError");
const cartService = require("../services/cart.service");
const productService = require("../services/product.service");

module.exports = {
    // ============== access db [4 TIMES] in bad case
    // call 1 add product to cart function
    async addProductToCart(req, res) {
        const { userId } = req.user;
        const { productId } = req.query;

        const foundProduct = await productService.checKExistProduct(productId);
        if (!foundProduct) throw new Api404Error("Product Not Found");

        const foundCart = await cartModel.findOne({
            cart_user: userId,
        });

        const productToAdd = {
            productId: foundProduct._id,
            name: foundProduct.product_name,
            price: foundProduct.product_discounted_price,
            quantity: 1,
        };

        const shopId = foundProduct.product_shop;
        if (!foundCart) {
            const newCart = await cartService.createCart(
                userId,
                shopId,
                productToAdd
            );
            if (!newCart)
                throw new InternalServerError("Error while creating cart");
            return res
                .status(200)
                .json({
                    message: "Product Successfully Added to Cart",
                    metadata: newCart,
                });
        } else {
            if (!foundCart?.cart_products?.length) {
                foundCart.cart_products = [productToAdd];
                foundCart.cart_count_product = 1;
                foundCart.cart_shop = shopId;
                await foundCart.save();
            } else {
                console.log(foundProduct.product_shop, foundCart.cart_shop);

                if (
                    !foundProduct.product_shop
                        .toString()
                        .includes(foundCart.cart_shop)
                )
                    throw new BadRequest(
                        "Only 1 shop per cart, We wil update later"
                    );
                const result = await cartService.addProductToCart(
                    userId,
                    shopId,
                    productToAdd
                );
                if (!result)
                    throw InternalServerError(
                        "Error while adding product to cart"
                    );
            }
        }
        res.status(200).json({
            message: "Product Successfully Added to Cart",
            metadata: [],
        });
    },

    async getCart(req, res) {
        const { userId } = req.user;
        const cart = await cartService.findCartByUserId(userId);

        if (!cart) throw new Api404Error("Cart Not Found");
        return res
            .status(200)
            .json({ message: "Successfully", metadata: cart });
    },

    async removeProductFromCart(req, res) {
        const { userId } = req.user;
        const { product_id } = req.params;
        if (!product_id) throw new BadRequest("Missing required arguments");

        const modifiedCart = await cartService.removeProductFormCart(
            product_id,
            userId
        );
        res.status(200).json({
            message: "Product successfully deleted",
            metadata: modifiedCart,
        });
    },

    async deleteCart(req, res) {
        const { userId } = req.user;
        const { deletedCount } = await cartService.deleteCartByUserId(userId);
        if (!deletedCount) throw new Api404Error("Cart not found");
        res.status(200).json({ message: "Cart Successfully Deleted" });
    },

    async reduceProductQuantity(req, res) {
        const { userId } = req.user;
        const { product_id } = req.params;
        if (!product_id) throw new BadRequest("Missing required arguments");

        let updatedCart = await cartService.reduceProductQuantity(
            product_id,
            userId
        );
        if (!updatedCart)
            updatedCart = await cartService.removeProductFormCart(
                product_id,
                userId
            );
        res.status(200).json({
            message: "Cart Successfully Updated",
            metadata: updatedCart,
        });
    },

    async incProductQuantity(req, res) {
        const { userId } = req.user;
        const { product_id } = req.params;
        if (!product_id) throw new BadRequest("Missing required argument");
        console.log(product_id);
        const updatedCart = await cartService.incProductQuantity(
            product_id,
            userId
        );

        if (!updatedCart) throw new BadRequest("Product not exist in cart");
        res.status(200).json(updatedCart);
    },

    async createNote(req, res) {
        const { userId } = req.user;
        const { note } = req.body;
        if (!note) throw new BadRequest("Missing order note in body request");

        const update = {
            $set: {
                cart_note: note,
            },
        };
        const cart = await cartService.findCartByUserIdAndUpdate(
            userId,
            update
        );
        if (!cart) throw Api404Error("Cart not found");

        res.status(200).json({ message: "Successfully" });
    },
};
