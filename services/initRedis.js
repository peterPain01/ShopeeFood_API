const { createClient } = require("redis");
const { REDIS_URL, REDIS_PORT } = require("../config/database");

const client = createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT,
        reconnectStrategy: function (retries) {
            if (retries > 20) {
                console.log(
                    "Too many attempts to reconnect. Redis connection was terminated"
                );
                return new Error("Too many retries.");
            } else {
                return retries * 500; // delay time reconnect in ms
            }
        },
    },
});

client.on("error", (err) => console.error(err));

(async () => {
    try {
        await client.connect();
        console.log("Connected to Redis");
    } catch (err) {
        console.error(err);
    }
})();

module.exports = client;
