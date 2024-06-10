const bcrypt = require("bcrypt");
const SALTROUND = 8;
const User = require("../model/user.model.js");
const KeyTokenService = require("../services/keyToken.service.js");
const {
    BadRequest,
    ConflictRequest,
    InternalServerError,
    Api404Error,
} = require("../modules/CustomError.js");
const { getAuthTokenAndStore } = require("../utils/auth.js");
const otpService = require("../services/otp.service.js");
const shipperModel = require("../model/shipper.model.js");
const shipperService = require("../services/shipper.service.js");

module.exports = {
    async verifyOTP(req, res) {
        const { otp, phone, password } = req.body;
        if (!otp || !phone || !password)
            throw new BadRequest("Missing required arguments");

        // const isValidOTP = await otpService.checkOTP(phone, otp);
        // if (!isValidOTP) throw new BadRequest("Invalid OTP");

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
        });
    },

    async signup(req, res) {
        const { phone, password } = req.body;
        if (!phone || !password)
            throw new BadRequest("Missing required arguments");

        console.log(phone);
        const existingUser = await User.findOne({ phone }).lean();
        if (existingUser) {
            console.log(existingUser);
            throw new ConflictRequest("Phone was registered");
        }

        // try {
        //     const verification = await otpService.sendOTPViaCall(phone);
        // } catch (err) {
        //     console.log(err);
        // }

        const encrypted_pass = await bcrypt.hash(String(password), SALTROUND);
        const newUser = await User.create({
            phone,
            password: encrypted_pass,
        });

        console.log(newUser);
        if (!newUser) throw new InternalServerError("User failure created");

        res.status(201).json({
            message: "Created User Success",
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
        const { userId, role } = req.user;
        if (role === "shipper") {
            const shipper = await shipperService.setState(userId, false);
            if (!shipper) throw Api404Error("Shipper Not Found");
        }
        if (!keyStore) throw new InternalServerError("Some error on Server");
        await KeyTokenService.removeTokenById(keyStore._id);

        res.status(200).json({ message: "User Successfully Logout" });
    },
};
