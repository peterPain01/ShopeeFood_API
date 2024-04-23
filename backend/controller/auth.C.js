const bcrypt = require("bcrypt");
const SALTROUND = 8;
const User = require("../model/user.model.js");
const KeyTokenService = require("../services/keyToken.service.js");
const {
    BadRequest,
    ConflictRequest,
    InternalServerError,
} = require("../modules/CustomError.js");
const { getAuthTokenAndStore } = require("../utils/auth.js");
const otpService = require("../services/otp.service.js");
const { OTP_DIGITS } = require("../config/common.js");

module.exports = {
    async verifyOTP(req, res) {
        const { otp, phone, password } = req.body;
        if (!otp || !phone || !password)
            throw new BadRequest("Missing required arguments");

        const isValidOTP = await otpService.validateOTP(phone, otp);
        if (!isValidOTP) throw new BadRequest("Invalid OTP");

        await otpService.deleteOTPByPhone(phone);

        // CREATE USER
        const encrypted_pass = await bcrypt.hash(String(password), SALTROUND);
        const newUser = await User.create({
            phone,
            password: encrypted_pass,
        });
        console.log(newUser);
        if (!newUser) throw new InternalServerError("User failure created");

        res.status(200).json({
            message: "Created User Success",
            metadata: {},
        });
    },

    async signup(req, res) {
        const { phone, password } = req.body;
        if (!phone || !password)
            throw new BadRequest("Missing required arguments");

        const existingUser = await User.findOne({ phone }).lean();
        if (existingUser) {
            throw new ConflictRequest("Phone was registered");
        }

        const generatedOTP = await otpService.generateOTP(OTP_DIGITS);
        const storedOTP = await otpService.storeOTP(phone, generatedOTP);

        if (!storedOTP) throw new InternalServerError("Error when stored OTP ");

        res.status(200).json({
            message: `Create OTP Successful ${generatedOTP}`,
        });
    },

    async login(req, res) {
        const { phone, password, refreshToken = null } = req.body;
        if (!phone || !password)
            return new BadRequest("Missing one of information");

        const foundUser = await User.findOne({ phone }).lean();
        if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
            return res.status(401).json("Invalid Credential");
        }
        console.log(foundUser);
        req.user = foundUser;
        try {
            await getAuthTokenAndStore(req, res);
        } catch (err) {
            throw new Error(err.message);
        }
    },

    async logout(req, res) {
        const keyStore = req.keyStore;
        console.log(keyStore);
        if (!keyStore) throw new BadRequest("Missing some information");
        await KeyTokenService.removeTokenById(keyStore.id);
        res.clearCookie("refreshToken");
        res.status(200).json("User Successfully Logout");
    },
};
