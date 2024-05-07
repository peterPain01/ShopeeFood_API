const { createClient } = require("redis");

const client = createClient();

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
