const { BadRequest } = require("../modules/CustomError");
const cartRedisService = require("../services/cartRedis.service");
const productService = require("../services/product.service");

async function addProductToCart(req, res, next) {
    const { userId } = req.user;
    const { productId, quantity = 1 } = req.query;
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

// 1. sync with mongo to get cart and checkout
async function getCart(req, res, next) {
    const { userId } = req.user;
    const cartUser = await cartRedisService.getCart(userId);
    const productKeys = await cartRedisService.getProductKeys(userId);

    const productValues = Object.values(productKeys).filter((value) =>
        value.startsWith("product:")
    );

    console.log("ObjectValue:::", Object.values(productKeys));
    console.log("ProductValues:::", productValues);
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

module.exports = {
    addProductToCart,
    removeProductFromCart,
    deleteCart,
    getCart,
};
