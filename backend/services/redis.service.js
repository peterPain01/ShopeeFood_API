const redis = require("../services/initRedis");
const express = require("express");
const app = express();

const getIpUser = (req) => {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
};

const incr = async (key) => {
    try {
        return await redis.incr(key);
    } catch (err) {
        throw new Error(err.message);
    }
};

const expire = async (key, ttl) => {
    try {
        return await redis.expire(key, ttl);
    } catch (err) {
        throw new Error(err.message);
    }
};

const ttl = async (key) => {
    try {
        return await redis.ttl(key);
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { incr, getIpUser, expire, ttl };
