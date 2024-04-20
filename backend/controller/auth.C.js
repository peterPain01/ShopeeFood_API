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

module.exports = {
    async signup(req, res) {
        const { phone, password } = req.body;
        if (!phone || !password)
            throw new BadRequest("Missing required arguments");

        const existingUser = await User.findOne({ phone }).lean();
        if (existingUser) {
            throw new ConflictRequest("Phone was registered");
        }

        const encrypted_pass = await bcrypt.hash(String(password), SALTROUND);
        const credential = phone ? phone : email;

        const newUser = await User.create({
            phone,
            password: encrypted_pass,
        });
        console.log(newUser);
        if (!newUser) throw new InternalServerError("User failure created");

        req.user = newUser;
        try {
            await getAuthTokenAndStore(req, res);
        } catch (err) {
            throw new Error(err.message);
        }
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
