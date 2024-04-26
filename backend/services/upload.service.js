"use strict";
const cloudinary = require("../config/cloudinary");
const { removeExtInFileName, deleteFileByRelativePath } = require("../utils");
const { InternalServerError } = require("../modules/CustomError");

module.exports = {
    async uploadFileFromLocal(path, filename, folderName) {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
            public_id: filename,
        });

        return {
            image_url: result.secure_url,
        };
    },

    async uploadFileFromLocalWithMulter(file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: process.env.CLOUDINARY_SHIPPER_AVATAR_PATH,
                public_id: removeExtInFileName(file.filename),
            });

            if (!result.secure_url) {
                deleteFileByRelativePath(file.path);
                throw new InternalServerError("Cant update image to cloud");
            }
            return result.secure_url;
        } catch (err) {
            deleteFileByRelativePath(file.path);
            throw new InternalServerError(err.message);
        }
    },
    async uploadFileFromUrl() {},
};
