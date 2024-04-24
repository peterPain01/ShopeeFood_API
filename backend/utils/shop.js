const fs = require("fs");


module.exports = {
    isValidHourMin(time) {
        let [hour, min] = time.split(":");
        if (hour < 0 || hour > 24 || min < 0 || min > 60) return false;
        return true;
    },

    isValidOpenCloseHour(open, close) {
        if (!this.isValidHourMin(open) || !this.isValidHourMin(close)) {
            return false;
        }
        let [hourOpen, minOpen] = open.split(":");
        let [hourClose, minClose] = close.split(":");

        if (hourOpen > hourClose) return false;
        if (hourOpen === hourClose && minOpen > minClose) return false;

        return true;
    },

    uploadImageToLocal(directoryName = "", imageData) {
        const buffer = Buffer.from(imageData, "base64");

        const fileName = `image_${Date.now()}.jpg`;

        fs.writeFile(fileName, buffer, (err) => {
            if (err) {
                console.error("Error saving image:", err);
                return res.status(500).send("Error saving image");
            }
            console.log("Image saved successfully");
            res.status(200).send("Image uploaded successfully");
        });
    },
};
