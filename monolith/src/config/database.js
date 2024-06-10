module.exports = {
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    MONGO_IP: process.env.MONGO_IP || "mongodb",
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    // REDIS_URL: process.env.REDIS_URL || "redis",
    REDIS_URL: "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT || 6379,
};
