"use strict";

const keytokenModel = require("../model/keytoken.model");
const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");

class KeyTokenService {
    static createToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true };

            const token = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static createTokenPairs = async (payload, publicKey, privateKey) => {
        try {
            const accessToken = jwt.sign(payload, publicKey, {
                expiresIn: "2 days",
            });

            const refreshToken = jwt.sign(payload, privateKey, {
                expiresIn: "7 days",
            });

            jwt.verify(accessToken, publicKey, (err, decoded) => {
                if (err) {
                    console.error("error verify" + err);
                } else {
                    console.log("verify success", decoded);
                }
            });
            return { accessToken, refreshToken };
        } catch (error) {
            return error;
        }
    };

    static async findByUserId(userId) {
        return await keytokenModel
            .findOne({ user: new Types.ObjectId(userId) })
            .lean();
    }

    static async removeTokenById(id) {
        return await keytokenModel.findByIdAndDelete(id);
    }

    static async getTokensById(id) {
        return await keytokenModel.findById(id);
    }

    static async findTokensByRefreshTokenUsed(refreshToken) {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken });
    }

    static async findTokensByRefreshToken(refreshToken) {}
}

module.exports = KeyTokenService;
