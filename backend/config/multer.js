const multer = require("multer");

const storage = (destinationFolder) =>
    multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationFolder);
        },
        filename: function (req, file, cb) {
            const part_filename = file.originalname.split(".");
            const ext = part_filename.at(-1);
            const random = Math.floor(Math.random() * 90 + 10);

            cb(
                null,
                file.originalname.replaceAll(`.${ext}`, `${random}.${ext}`)
            );
        },
    });

const upload = multer({ storage: storage("uploads") });
const uploadFileForShipper = multer({ storage: storage("uploads/shippers") });
const uploadComment = multer({ storage: storage("uploads/comments") });
const uploadShop =  multer({ storage: storage("uploads/shops") });

const convert_formData = multer();
module.exports = { upload, uploadFileForShipper, uploadComment,convert_formData,uploadShop };
