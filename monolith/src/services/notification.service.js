var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");
const { BadRequest } = require("../modules/CustomError");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function sendNotifyToDevice(title, body, tokenDevice) {
    const message = {
        notification: {
            title,
            body,
        },
        token: tokenDevice,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
    } catch (error) {
        throw new BadRequest("Error sending message:", error);
    }
    return;
}

module.exports = {
    sendNotifyToDevice,
};
