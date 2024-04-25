const multer = require("multer");

const storage = (destinationFolder) =>
    multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationFolder);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname); // Keep the original filename
        },
    });

// upload private file
const upload = multer({ storage: storage("uploads") });

// upload public file
const uploadPrivateFile = multer({ storage: storage });

// SHIPPER
const uploadFileForShipper = multer({ storage: storage("uploads/shippers") });

module.exports = { upload, uploadPrivateFile, uploadFileForShipper };
