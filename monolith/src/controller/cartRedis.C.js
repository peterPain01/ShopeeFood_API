const { BadRequest, NoContent } = require("../modules/CustomError");
const cartRedisService = require("../services/cartRedis.service");
const productService = require("../services/product.service");
const { isEmptyObject } = require("../utils");

async function addProductToCart(req, res, next) {
    const { userId } = req.user;
    let { productId, quantity = 1 } = req.query;
    quantity = parseInt(quantity);
    if (quantity < 0) throw new BadRequest("Quantity should be greater than 0");
    if (!productId) throw new BadRequest("Missing productId");

    const select = ["product_shop"];
    const product = await productService.checKExistProduct(productId, select);
    if (!product) throw new BadRequest("Product Not Found");

    const shopId = product.product_shop.toString();
    console.log(shopId);
    let result;
    try {
        result = await cartRedisService.addProductToCart(
            userId,
            productId,
            shopId,
            quantity
        );
    } catch (err) {
        return next(new Error(err));
    }

    res.status(200).json({ message: "Successful", metadata: result });
}

// todo: using redis like primary db to store cart
// must update this /ˈterəb(ə)l/ function 🔥
async function getCart(req, res, next) {
    const { userId } = req.user;

    const cart = await cartRedisService.getCart(userId);
    const cartKeys = await cartRedisService.getCartKeys(userId);
    console.log("cart::", cart);
    console.log("cartKeys::", cartKeys);
    if (!cartKeys) return res.status(204);

    const products = Object.entries(cart).flatMap((entry) => {
        if (entry[0].toString().startsWith("product:"))
            return {
                _id: entry[0].split(":").at(-1),
                quantity: entry[1],
            };
        else return [];
    });

    const productKeys = Object.values(cartKeys).filter((value) =>
        value.startsWith("product:")
    );

    const productIds = productKeys.map((key) => {
        return key.split(":").at(-1);
    });

    console.log("products:", products);

    const cartUser = {};

    const select = [
        "_id",
        "product_name",
        "product_thumb",
        "product_discounted_price",
    ];
    let productInfo = await productService.getProductByIds(productIds, select);

    productInfo = productInfo.map((product_info) => {
        product_info = product_info.toObject();
        const quantity = products.find(
            (product) => product._id === product_info._id.toString()
        ).quantity;
        return {
            quantity,
            ...product_info,
        };
    });

    console.log("productInfo:::", productInfo);

    cartUser.cart_products = productInfo;
    cartUser.cart_count_products = productInfo.length;
    cartUser.cart_state = cart.state;

    if (isEmptyObject({ ...cartUser })) {
        return res.status(204).json({});
    }
    res.status(200).json({ message: "Successful", metadata: cartUser });
}

async function removeProductFromCart(req, res, next) {
    const { userId } = req.user;
    const { productId } = req.query;

    if (!productId) throw new BadRequest("Missing product id");
    let result;
    try {
        result = await cartRedisService.removeProductFromCart(
            userId,
            productId
        );
    } catch (err) {
        return next(new Error(err));
    }
    const status = result === 1 ? 200 : 204;
    res.status(status).json({ message: "Successful", metadata: result });
}

async function deleteCart(req, res, next) {
    const { userId } = req.user;
    let result;
    try {
        result = await cartRedisService.deleteCart(userId);
    } catch (error) {
        return next(new Error(error));
    }
    const status = result === 1 ? 200 : 204;
    res.status(status).json({ message: "Successful", metadata: result });
}

async function reduceProductQuantity(req, res, next) {
    const { userId } = req.user;
    let { productId, quantity = 1 } = req.query;
    if (!productId) throw new BadRequest("Missing productId");
    if (quantity <= 0)
        throw new BadRequest("Quantity should be greater than 0");
    quantity = parseInt(quantity);
    const result = await cartRedisService.reduceProductQuantity(
        userId,
        productId,
        quantity
    );
    if (!result) return res.sendStatus(204);
    if (result === -1)
        throw new BadRequest(
            "The reduction quantity cannot exceed the available quantity of the product."
        );
    res.status(200).json({
        message: "Successful",
        metadata: { newQuantity: result },
    });
}

async function createNote(req, res, next) {
    const { userId } = req.user;
    const { note } = req.query;

    // To do: Implement
}

module.exports = {
    addProductToCart,
    removeProductFromCart,
    deleteCart,
    getCart,
    reduceProductQuantity,
    createNote,
};
