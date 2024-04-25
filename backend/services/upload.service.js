"use strict";
const { result } = require("lodash");
const cloudinary = require("../config/cloudinary");

module.exports = {
    async uploadFileFromLocal(path, folderName = "shop/image") {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
        });

        return {
            image_url: result.secure_url,
        };
    },
};
