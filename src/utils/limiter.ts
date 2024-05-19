const { getIpUser, incr, expire } = require("../services/redis.service");

const { Request, Response, NextFunction } = require("express");
export {};

const expireTime = 60 * 60; // seconds
const maxRequest = 1000;

module.exports = {
    async limiter(
        req: typeof Request,
        res: typeof Response,
        next: typeof NextFunction
    ) {
        try {
            const ipUser = getIpUser(req);
            const numRequest = await incr(ipUser);
            if (numRequest === 1) {
                await expire(ipUser, expireTime);
            }
            if (numRequest > maxRequest) {
                return res.status(409).json({ message: "Too many request" });
            }
            return next();
        } catch (err) {
            next(err);
        }
    },
};
