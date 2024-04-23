var config = require("../config/twilio");
const twilioClient = require("twilio")(config.ACCOUNT_SID, config.AUTH_TOKEN);

module.exports = {
    // send OTP via Call
    async sendOTPViaCall(to) {
        const verification = await twilioClient.verify.v2
            .services("VAa93e23e28ba0c9d12bdc7c841f505ea0")
            .verifications.create({ to, channel: "call" });
        return verification;
    },

    async checkOTP(to, otp) {
        const verification_check = await twilioClient.verify.v2
            .services("VAa93e23e28ba0c9d12bdc7c841f505ea0")
            .verificationChecks.create({ to, code: otp });

        if (verification_check.status == "approved") return true;
        return false;
    },
};
