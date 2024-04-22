const accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const authToken = "your_auth_token";
const client = require("twilio")(accountSid, authToken);

module.exports = {
    async sendOTP() {
        const msg = await client.messages.create({
            body: "Hello from twilio-node",
            to: "+840702174580", // Text your number
            from: "+12345678901", // From a valid Twilio number
        });
        return msg;
    },
};
