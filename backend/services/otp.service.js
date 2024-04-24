var config = require("../config/twilio");
const twilioClient = require("twilio")(config.ACCOUNT_SID, config.AUTH_TOKEN);

module.exports = {
    // send OTP via Call
    async sendOTPViaCall(to) {
        const verification = await twilioClient.verify.v2
            .services(config.SERVICE_ID)
            .verifications.create({ to, channel: "call" });
        return verification;
    },

    async checkOTP(to, otp) {
        const verification_check = await twilioClient.verify.v2
            .services(config.SERVICE_ID)
            .verificationChecks.create({ to, code: otp });

        if (verification_check.status == "approved") return true;
        return false;
    },
};
