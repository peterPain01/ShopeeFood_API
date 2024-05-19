const { getIpUser, incr, expire, ttl } = require("../services/redis.service");

const expireTime = 60 * 60; // seconds
const maxRequest = 1000;

module.exports = {
    async limiter(req, res, next) {
        const ipUser = getIpUser(req);
        const numRequest = await incr(ipUser);
        let _ttl;
        if (numRequest === 1) {
            await expire(ipUser, expireTime);
            _ttl = 60;
        } else {
            _ttl = await ttl(ipUser);
        }
        if (numRequest > maxRequest) {
            return res.status(409).json({ message: "Too many request" });
        }
        next();
    },
};
