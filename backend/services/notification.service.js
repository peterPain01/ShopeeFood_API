var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function sendConfirmNotifyToShipper(req, res, next) {
    const message = {
        notification: {
            title: "New Order",
            body: "You have a new order to confirm.",
        },
        token: "eH89GMBgTuuT5iU2Uyexyz:APA91bGAgoDSu8F9XmhwRdWsGGhSo8AsCFpGVhg5xr3ynR9QTq4sZHXaPy3cl1B1N2VOO9ycZY4CGi5mENg0tOUiFhljpwAvIRgY9FyH3wytAZHg6wRE1EPHtBTDQOL-7jSUpzpPJsHS",
    };

    admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            console.log("Error sending message:", error);
        });
        res.status(200).json({message: "Successfully sent message"})
}

module.exports = {
    sendConfirmNotifyToShipper,
};
