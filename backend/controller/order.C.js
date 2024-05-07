const shopModel = require("../model/shop.model");
const temporaryOrderModel = require("../model/temporaryOrder.model");
const {
    Api404Error,
    InternalServerError,
    BadRequest,
} = require("../modules/CustomError");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
const paymentService = require("../services/payment.service");
const shipperService = require("../services/shipper.service");
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const shopService = require("../services/shop.service");
const { distanceBetweenTwoPoints, findShippingFee } = require("../utils");

module.exports = {
    /* 
        originalPrice // gia chua giam 
        totalPrice  // gia da giam 
        discountPrice // originalPrice - totalPrice
        // get user address and count fee 
        feeShip 
    */
    async checkoutReview(req, res) {
        const { userId } = req.user;

        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products)
            throw new Api404Error("Cart Not Found");

        const orderInfo = await orderService.getSubOrderInfo(
            userId,
            foundCart.cart_products,
            foundCart.cart_note
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");
        res.status(200).json({
            message: "Review Order Info",
            metadata: orderInfo,
        });
    },

    // Middleware serve data for cash | zalo | vnpay checkout
    async checkoutPreProcess(req, res, next) {
        const { userId } = req.user;
        const { type, latlng, street } = req.body;
        if (!type || !latlng || !street)
            next(new BadRequest(`Missing type | latlng | street in req.body`));

        const address = {
            type,
            latlng,
            street,
        };
        const foundCart = await cartService.findCartByUserId(userId);
        if (
            !foundCart ||
            !foundCart.cart_products ||
            !foundCart?.cart_products.length
        )
            next(new Api404Error("Cart Not Found Or Empty"));
        console.log("foundCart.cart_products:::", foundCart.cart_products);
        const shopId = foundCart.cart_shop;
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop)
            throw new InternalServerError("Shop does not have addresses");

        const shopAddress = foundShop.addresses[0];

        console.log("==========");
        console.log(latlng.lat);
        console.log(latlng.lng);
        console.log(shopAddress.latlng.lat);
        console.log(shopAddress.latlng.lng);
        console.log("==========");

        const distanceShopUser = distanceBetweenTwoPoints(
            latlng.lat,
            latlng.lng,
            shopAddress.latlng.lat,
            shopAddress.latlng.lng
        );

        const shippingFee = findShippingFee(distanceShopUser);
        if (shippingFee == null)
            next(new BadRequest(`So far to ship ${distanceShopUser}km`));

        console.log("shippingFee::", shippingFee);
        console.log("distanceShopUser::", distanceShopUser);

        const orderInfo = await orderService.getOrderInfo(
            userId,
            shopId,
            address,
            foundCart.cart_count_product,
            foundCart.cart_products,
            foundCart.cart_note,
            shippingFee
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");
        req.orderInfo = orderInfo;
        next();
    },

    // Middleware send notify to shop and shipper
    // ROLL BACK: Khong tim thay shipper xoa order 
    async checkoutCash(req, res) {
        const orderInfo = req.orderInfo;
        orderInfo.paymentMethod = "cash";

        const createdOrder = await orderService.createOrder(orderInfo);
        if (!createdOrder)
            throw new InternalServerError("Error when create order info");
        const bodyMSG = `${createdOrder._id}`;

        try {
            await notifyShopShipper(bodyMSG, createdOrder, orderInfo.shopId);
        } catch (err) {
            throw err;
        }
        console.log("createdOrder with cash", createdOrder);
        res.status(201).json({
            message: "Order Successful Created",
        });
    },

    // Zalo
    //1. tao order o bang tam tu dong huy sau 15 phut
    //2. order vao router thanh cong do zalo pay goi
    //3. -> kiem tra data co khop voi data o bang tam khong
    async checkoutZalo(req, res) {
        const orderInfo = req.orderInfo;
        orderInfo.paymentMethod = "zalopay";
        console.log("orderInfo.totalPrice:::", orderInfo.totalPrice);

        try {
            const result = await paymentService.getZalopayUrl(
                orderInfo.list_products,
                orderInfo.totalPrice
            );

            //1. tao ra 1 don hang tam trong 15 phut
            // check result thanh cong hay chua
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 15);

            await temporaryOrderModel.create({
                order_info: orderInfo,
                app_trans_id: result.app_trans_id,
                time: expiryTime,
            });
            console.log("result order::", result);
            res.status(200).json({
                message: "Success",
                metadata: result.order_url || "",
            });
        } catch (err) {
            throw new BadRequest("Error occurred when access payment gateway");
        }
    },

    async handleZalopayCallback(req, res) {
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
                console.log("dataJson:::", dataJson);

                const tempOrder = await temporaryOrderModel.findOneAndDelete({
                    app_trans_id: dataJson.app_trans_id,
                });
                if (!tempOrder || !tempOrder.order_info)
                    throw new BadRequest("Order Expired, Please try again");

                const createdOrder = await orderService.createOrder(
                    tempOrder.order_info
                );

                try {
                    const bodyMSG = `${createdOrder._id}`;
                    await notifyShopShipper(
                        bodyMSG,
                        createdOrder,
                        createdOrder.order_shop._id
                    );

                    // notify for shop
                } catch (err) {
                    next(err);
                }

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

    async handleVnpResult(req, res) {
        const result = paymentService.getVnPayResult(req);
        res.status(200).send(result);
    },

    async getVnpUrl(req, res) {
        const VnpUrl = paymentService.getVnpUrl(req);
        res.status(200).send(VnpUrl);
    },

    async getOnGoingOrder(req, res) {
        const { userId } = req.user;
        const select = [
            "_id",
            "order_shop",
            "order_totalPrice",
            "order_totalItems",
            "order_listProducts",
        ];
        const orders = await orderService.getAllOnGoingOrder(userId, select);

        res.status(200).json({ message: "Success", metadata: orders || {} });
    },

    async getSuccessOrder(req, res) {
        const { userId } = req.user;
        const select = [
            "_id",
            "order_shop",
            "order_totalPrice",
            "order_totalItems",
            "order_listProducts",
        ];
        const orders = await orderService.getAllSuccessOrderOverview(
            userId,
            select
        );
        res.status(200).json({ message: "Success", metadata: orders || {} });
    },

    async checkoutWithVnPay(req, res) {},

    async getOrderDetail(req, res) {
        const { userId } = req.user;
        const role = req.user.role;
        const { orderId } = req.query;
        let filter = {};
        let order = null;
        if (role !== "shipper") {
            if (role === "user")
                filter = {
                    "order_user._id": userId,
                    _id: orderId,
                };
            else if (role === "shop")
                filter = {
                    order_shop: userId,
                    _id: orderId,
                };
            order = await orderService.findOrder(filter);
            const order_shipperInfo = order.order_shipper;
            order.order_shipper = order.order_shipper._id;
            console.log("orderShop or user:::", order);
            return res.status(200).json({
                message: "Success",
                metadata: { ...order.toObject(), order_shipperInfo },
            });
        } else {
            order = await orderService.findOrderDetailForShipper(
                userId,
                orderId
            );
            console.log("orderShipper:::", order);
        }

        if (!order) throw new Api404Error("Order Not Found");
        res.status(200).json({ message: "Success", metadata: order });
    },
};

async function notifyShopShipper(bodyMSG, createdOrder, shopId) {
    let result = null;
    let shipper = null;

    do {
        shipper = await shipperService.findShipperNearest(123, 123);
        console.log("shipper received order notification:: ", shipper);
        result = await shipperService.sendNotificationToShipper(
            shipper._id,
            bodyMSG
        );
    } while (result === null);

    const tempOrder = await temporaryOrderModel.create({
        shipper_id: shipper._id,
        order_id: createdOrder._id,
    });

    console.log("tempOrder::", tempOrder);

    // send notification for shop
    const response = await shopService.sendNotificationToShop(shopId, bodyMSG);
    // if (!response)
    //     throw new InternalServerError("Can not send notify to shop");
}
