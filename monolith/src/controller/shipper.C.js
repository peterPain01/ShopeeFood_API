const shipperModel = require("../model/shipper.model");
const { Types } = require("mongoose");
const {
    BadRequest,
    InternalServerError,
    ConflictRequest,
    Api404Error,
} = require("../modules/CustomError");
const userModel = require("../model/user.model");
const shipperService = require("../services/shipper.service");
const {
    uploadFileFromLocal,
    uploadFileFromLocalWithMulter,
} = require("../services/upload.service");
const { removeExtInFileName, deleteFileByRelativePath } = require("../utils");
const temporaryOrderModel = require("../model/temporaryOrder.model");
const orderService = require("../services/order.service");
const paymentService = require("../services/payment.service");

const { update } = require("lodash");
const transactionModel = require("../model/transaction.model");

module.exports = {
    async createShipper(req, res) {
        const { userId } = req.user;
        const { license_plate_number, fullname, phone } = req.body;

        const foundShipper = await shipperService.findShipperById(userId);
        if (foundShipper)
            throw new ConflictRequest("Phone was used to register Driver");

        const { image_url: avatar_uploaded_path } = await uploadFileFromLocal(
            req.files["avatar"][0].path,
            removeExtInFileName(req.files["avatar"][0].filename),
            process.env.CLOUDINARY_SHIPPER_AVATAR_PATH
        );

        const { image_url: vehicle_image_uploaded_path } =
            await uploadFileFromLocal(
                req.files["vehicle_image"][0].path,
                removeExtInFileName(req.files["vehicle_image"][0].filename),
                process.env.CLOUDINARY_SHIPPER_VEHICLE_PATH
            );

        if (!avatar_uploaded_path || !vehicle_image_uploaded_path) {
            deleteFileByRelativePath(req.files["avatar"][0].path);
            deleteFileByRelativePath(req.files["vehicle_image"][0].path);
            throw new InternalServerError(
                "Server Failed network error !!!Cant upload avatar or vehicle. "
            );
        }
        const newShipper = await shipperModel.create({
            _id: new Types.ObjectId(userId),
            license_plate_number,
            vehicle_image: vehicle_image_uploaded_path,
            avatar: avatar_uploaded_path,
            shipper_user: userId,
            fullname,
            phone,
        });

        if (!newShipper) throw new BadRequest("Error for create new shipper");

        const user = await userModel.findByIdAndUpdate(userId, {
            $set: { role: "shipper" },
        });

        //ROLLBACK
        if (!user) throw new InternalServerError("Error when assign roles");
        res.status(401).json({
            message: "Success Create Shipper Record! Need re-login",
            metadata: newShipper,
        });
    },

    async updateCurrentLocation(req, res, next) {
        const { userId } = req.user;
        const { lat, lng } = req.body;
        console.log(lat, lng);
        const updatedAddress = await shipperModel.findByIdAndUpdate(userId, {
            $set: { currentPosition: { lat, lng } },
        });
        console.log("updatedAddress:::", updatedAddress);
        res.status(200).json({ message: "Success" });
    },

    async updateShipper(req, res, next) {
        const { userId } = req.user;
        const updateBody = req.body;
        const updatedShipper = await shipperModel.findByIdAndUpdate(userId, {
            $set: { ...updateBody },
        });
        if (!updatedShipper)
            throw new InternalServerError("Cant not update shipper info");

        res.status(200).json({ message: "Success" });
    },

    async updateAvatar(req, res, next) {
        const { userId } = req.user;
        if (!req?.file) throw new BadRequest("Missing avatar image");

        try {
            const image_url = await uploadFileFromLocalWithMulter(req.file);
            await shipperModel.findByIdAndUpdate(userId, {
                $set: { avatar: image_url },
            });
        } catch (err) {
            return next(err);
        }
        res.status(200).json({ message: "Success" });
    },

    async updateVehicleImage(req, res, next) {
        const { userId } = req.user;
        if (!req?.file) throw new BadRequest("Missing vehicle image");
        try {
            const image_url = await uploadFileFromLocalWithMulter(req.file);
            await shipperModel.findByIdAndUpdate(userId, {
                vehicle_image: image_url,
            });
        } catch (err) {
            return next(err);
        }

        res.status(200).json({ message: "Success" });
    },

    async saveDeviceToken(req, res, next) {
        const { userId: shipperId } = req.user;
        const { token } = req.query;
        if (!token)
            throw new BadRequest("Missing token in your request params");
        console.log("shipper device token:::", token);
        await shipperService.saveDeviceToken(token, shipperId);
        res.status(200).json({
            message: "Token received and saved successfully",
        });
    },

    // GET HISTORY ORDER
    async getHistoryOrder(req, res, next) {
        const { userId: shipperId } = req.user;
        const unSelect = ["order_shippingFee"];
        const orders = await orderService.findOrderByShipperId(
            shipperId,
            unSelect
        );
        return res.status(200).json({ message: "Success", metadata: orders });
    },

    // 1. check xem shipper nay co duoc giao cho order nay hay khong
    // 2. Kiem tra xem so du Shipper con du de nhan don hay khong va tru tien
    // (chi check voi order thanh toan bang cash)
    // 3. Pass (1,2) => Gan shipper vao order voi order id
    async shipperConfirmOrder(req, res, next) {
        const { userId: shipperId } = req.user;
        const { orderId } = req.query;
        if (!orderId) throw new BadRequest("Missing order id on req.query");

        const orderInfo = await orderService.findOrderById(orderId, [
            "order_totalPrice",
            "order_paymentMethod",
        ]);
        if (!orderInfo) throw new InternalServerError("Order not Found");

        console.log("orderInfo::", orderInfo);

        // 1.
        const filter = {
            shipper_id: shipperId,
            order_id: orderId,
        };
        const isShipperOrderValid = await temporaryOrderModel.findOne(filter);
        if (!isShipperOrderValid) throw new BadRequest("Expired Time");

        if (orderInfo.order_paymentMethod === "cash") {
            const balanceNeedToConfirm = orderInfo.order_totalPrice;
            // 2.
            const isShipperEnoughBalance =
                await shipperService.checkBalanceShipperWithOrder(
                    shipperId,
                    balanceNeedToConfirm
                );
            if (!isShipperEnoughBalance)
                throw new BadRequest(
                    `You don't have enough balance to receive this order [Price: ${orderInfo.order_totalPrice}]`
                );
            // tru tien shipper
            await shipperService.subtractBalanceOfShipper(
                shipperId,
                balanceNeedToConfirm
            );
        }

        //3. 
        const order = await orderService.assignShipperForOrder(
            shipperId,
            orderId
        );

        if (!order.order_shipper.toString().includes(shipperId))
            throw new InternalServerError("Cant not update order shipper");
        
        // Create Socket between shipper and user  
        // socket name event: user_id + shipper_id
        // Kiem tra de khong the tao trung 
        //

        res.status(200).json({ message: "Success Confirmation Order" });
    },

    async shipperFinishOrder(req, res, next) {
        const { userId: shipperId } = req.user;
        const { orderId } = req.query;

        const order = await orderService.findOrderById(orderId);
        if (!order) throw new BadRequest("Order Not Found");

        const shipperCanFinishOrder = order.order_shipper
            .toString()
            .includes(shipperId)
            ? true
            : false;
        if (!shipperCanFinishOrder)
            throw new BadRequest("shipper cant finish this order");

        const finishedOrder = await orderService.finishOrder(
            shipperId,
            order.order_shipperReceive,
            orderId
        );

        if (!finishedOrder)
            throw new BadRequest("Cant finish order check again");
        res.status(200).json({ message: "Success Finish Order" });
    },

    async getRevenueAndBalance(req, res, next) {
        const { userId: shipperId } = req.user;
        const shipper = await shipperService.findShipperById(shipperId);
        res.status(200).json({
            message: "Successful",
            metadata: { revenue: shipper.revenue, balance: shipper.balance },
        });
    },

    // nap tien vao balance
    async recharge(req, res) {
        const { userId: shipperId } = req.user;
        const { amount } = req.query;
        if (!amount) throw new BadRequest("Missing amount on req.query");

        const result = await paymentService.getZalopayUrl(
            {},
            amount,
            `Recharge ${amount}`,
            true
        );

        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 15);

        await transactionModel.create({
            shipperId,
            app_trans_id: result.app_trans_id,
        });

        res.status(200).json({
            message: "Success",
            metadata: result.order_url,
        });
    },

    // xem doanh thu theo ngay
    async getRevenueByTime(req, res, next) {
        const { userId: shipperId } = req.user;
    },

    async handleZaloPayRecharge(req, res) {
        const config = {
            key2: process.env.ZALOPAY_KEY2,
        };

        let result = {};

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            console.log("mac =", mac);

            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            } else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, config.key2);
                console.log(
                    "update order's status = success where app_trans_id =",
                    dataJson["app_trans_id"]
                );
                console.log("dataJson Shipper:::", dataJson);

                const transaction = await transactionModel.findOneAndDelete({
                    app_trans_id: dataJson.app_trans_id,
                });

                if (!transaction)
                    throw new BadRequest("Recharge Expired, Please try again");

                const shipper = await shipperModel.findOneAndUpdate(
                    {
                        _id: transaction.shipperId,
                    },
                    {
                        $inc: { balance: dataJson.amount },
                    }
                );

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }

        // thông báo kết quả cho ZaloPay server
        res.json(result);
    },

    async getShipperInfo(req, res) {
        const { userId: shipperId } = req.user;
        const unSelect = ["__v", "createdAt", "updatedAt"];
        const shipper = await shipperService.findShipperById(
            shipperId,
            [],
            unSelect
        );
        if (!shipper) throw Api404Error("Shipper Not Found");
        console.log("Shipper info:::", shipper);
        return res.status(200).json({ message: "Success", metadata: shipper });
    },
};
