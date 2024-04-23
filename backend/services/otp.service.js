var config = require("../config/twilio");
const twilioClient = require("twilio")(config.ACCOUNT_SID, config.AUTH_TOKEN);
const from = config.PHONE_SERVER;
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const otpModel = require("../model/otp.model");
const { Api404Error } = require("../modules/CustomError");

module.exports = {
    // sen OTP via Call
    async sendOTPViaCall(to) {
        const msg = await twilioClient.calls.create({
            // Config for SMS
            // body: "Success:: Verify 098123",
            // messagingServiceSid: "MG67ad948be9f0671c6fb57a6b1779590f",

            // convert text to voice make it to file and send to user
            url: "http://demo.twilio.com/docs/voice.xml",
            from,
            to,
        });
        return msg;
    },

    // generate OTP
    async generateOTP(digits) {
        return otpGenerator.generate(digits, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
    },

    // convert it to voice
    async convertOTPToVoice(otp) {},

    async storeOTP(phone, otp) {
        const hashedOTP = await bcrypt.hash(String(otp), 6);
        return await otpModel.create({ otp_code: hashedOTP, otp_phone: phone });
    },

    async validateOTP(phone, otp) {
        const storedOTPS = await otpModel
            .find({
                otp_phone: phone,
            })
            .lean();

        if (!storedOTPS.length) throw new Api404Error("OTP Not Found");
        const storedOTP = storedOTPS[storedOTPS.length - 1];
        return bcrypt.compareSync(otp, storedOTP.otp_code);
    },

    async deleteOTPByPhone(phone) {
        return await otpModel.deleteMany({ otp_phone: phone });
    },
};
