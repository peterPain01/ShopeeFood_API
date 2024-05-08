const redisClient = require("./initRedis");

// Format: cart:user:{userId} product:{productId} {productQuantity},
//                            shop shopId
const CART_KEY = "cart:user:";

// only accept 1 shop per cart
// 1. user have no cart
// 2. product in same shop
// 3. product in diff shop
async function addProductToCart(userId, productId, shopId, quantity) {
    try {
        const shopInCart = await getShopInCart(userId);
        // 1.
        if (shopInCart === null) {
            await redisClient.hSet(
                `${CART_KEY}${userId}`,
                `product:${productId}`,
                quantity
            );
            await redisClient.hSet(`${CART_KEY}${userId}`, `shop`, shopId);
        }
        // 2.
        else if (shopInCart === shopId) {
            return await redisClient.hIncrBy(
                `${CART_KEY}${userId}`,
                `product:${productId}`,
                quantity
            );
        }
        // 3.
        else if (shopInCart !== shopId) {
            await redisClient.del(`${CART_KEY}${userId}`);
            return await redisClient.hSet(
                `${CART_KEY}${userId}`,
                `product:${productId}`,
                quantity
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getShopInCart(userId) {
    try {
        const shopInCart = await redisClient.hGet(
            `${CART_KEY}${userId}`,
            "shop"
        );
        return shopInCart;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function removeProductFromCart(userId, productId) {
    try {
        return await redisClient.hDel(
            `${CART_KEY}${userId}`,
            `product:${productId}`
        );
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteCart(userId) {
    try {
        return await redisClient.del(`${CART_KEY}${userId}`);
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getCart(userId) {
    try {
        return await redisClient.hGetAll(`${CART_KEY}${userId}`);
    } catch (err) {
        throw new Error(err.message);
    }
}

// strategy
// 1. access 1 time get all
// 2. access mul times get one
// which better ???
async function getProductInfoFromMongo() {
    try {
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getProductKeys(userId) {
    try {
        return await redisClient.hKeys(`${CART_KEY}${userId}`);
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    addProductToCart,
    removeProductFromCart,
    deleteCart,
    getCart,
    getProductInfoFromMongo,
    getProductKeys,
};
