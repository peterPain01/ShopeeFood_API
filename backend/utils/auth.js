const crypto = require("crypto");
const KeyTokenService = require("../services/keyToken.service");
const jwt = require("jsonwebtoken");
const {
    BadRequest,
    InternalServerError,
    Api404Error,
    AuthFailureError,
} = require("../modules/CustomError.js");
const { getInfoData } = require("../utils/index.js");
const keytokenModel = require("../model/keytoken.model.js");

module.exports = {
    async verifyToken(req, res, next) {
        try {
            const userId = req.headers["x-client-id"];
            if (!userId)
                throw new BadRequest(
                    "Missing required arguments in header section"
                );

            const accessToken = req.headers["x-authorization"];
            if (!accessToken) throw new BadRequest("No token provided");

            const keyStore = await KeyTokenService.findByUserId(userId);
            if (!keyStore) throw new Api404Error("KeyStore not found");

            jwt.verify(accessToken, keyStore.publicKey, (err, decodedUser) => {
                if (err)
                    throw new AuthFailureError(
                        "Access Token is invalid or expired"
                    );
                else {
                    req.keyStore = keyStore;
                    req.user = decodedUser;
                }
            });
            return next();
        } catch (err) {
            next(err);
        }
    },

    async getAuthTokenAndStore(req, res) {
        const user = req.user;

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const tokens = await KeyTokenService.createTokenPairs(
            {
                userId: user._id,
                phone: user.phone,
                role: user.role,
            },
            publicKey,
            privateKey
        );

        const publicKeyStored = await KeyTokenService.createToken({
            userId: user._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!publicKeyStored)
            throw new InternalServerError("publicKeyStored error");

        return res.status(201).json({
            message: "Success",
            metadata: {
                tokens,
                user: getInfoData({
                    fields: ["_id", "phone", "role"],
                    object: user,
                }),
            },
        });
    },

    async handleRefreshToken(req, res) {
        const refreshToken = req.headers["x-refresh-token"];
        const userId = req.headers["x-client-id"];

        if (!refreshToken || !userId)
            throw new AuthFailureError("RefreshToken is invalid");

        const keyStore = await KeyTokenService.findByUserId(userId);
        if (!keyStore) throw new Api404Error("KeyStore not found");

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeTokenById(keyStore._id);
            throw new AuthFailureError(
                "RefreshToken is invalid, pls login again"
            );
        }

        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("Invalid refresh token");

        let phone;
        jwt.verify(refreshToken, keyStore.privateKey, (err, decodedUser) => {
            if (err)
                throw new AuthFailureError(
                    "RefreshToken is invalid or expired"
                );
            else {
                phone = decodedUser.phone;
            }
        });

        const newTokens = await KeyTokenService.createTokenPairs(
            { userId, phone },
            keyStore.publicKey,
            keyStore.privateKey
        );
        // sua refresh token
        // them refresh token vao used
        const updatedKey = await keytokenModel.findByIdAndUpdate(
            keyStore._id,
            {
                refreshToken: newTokens.refreshToken,
                $push: { refreshTokensUsed: keyStore.refreshToken },
            },
            { new: true }
        );

        res.status(200).json(newTokens);
    },

    async verifyAdmin(req, res, next) {
        try {
            if (req.user.role === "admin") return next();
            next(new AuthFailureError("Authenticate Failure"));
        } catch (err) {
            next(err);
        }
    },

    async verifyShop(req, res, next) {
        try {
            console.log(req.user);
            if (req.user.role === "shop") return next();
            next(new AuthFailureError("Authenticate Failure"));
        } catch (err) {
            next(err);
        }
    },
};
