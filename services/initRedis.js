const { createClient } = require("redis");

const client = createClient({
    socket: {
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
