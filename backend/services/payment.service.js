const moment = require("moment");
let querystring = require("qs");
let crypto = require("crypto");
module.exports = {
    /*
     Function will create a redirect url for user choose payment method 
     and when enter url it will load this page 👇
     https://vyxdryvijbaisspawkql.supabase.co/storage/v1/object/public/shop_image/Screenshot%202024-04-22%20091801.png
    */

    getVnpUrl(req) {
        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");

        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let config = require("config");

        let tmnCode = config.get("vnp_TmnCode");
        let secretKey = config.get("vnp_HashSecret");
        let vnpUrl = config.get("vnp_Url");
        let returnUrl = config.get("vnp_ReturnUrl");
        let orderId = moment(date).format("DDHHmmss");
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;

        let locale = req.body.language;
        if (locale === null || locale === "") {
            locale = "vn";
        }
        let currCode = "VND";
        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        return vnpUrl;
    },

    getVnPayResult(req) {
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let config = require("config");
        let tmnCode = config.get("vnp_TmnCode");
        let secretKey = config.get("vnp_HashSecret");

        let signData = querystring.stringify(vnp_Params, { encode: false });

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            return {
                message: "successfully",
                code: vnp_Params["vnp_ResponseCode"],
            };
        } else {
            return {
                message: "success",
                code: "97",
            };
        }
    },
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}
