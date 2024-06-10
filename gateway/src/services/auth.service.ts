import { KeyStoreModel } from "../database/model/keytoken.model";
import { BadRequest, AuthFailureError } from "../modules/CustomError";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface Payload {
    clientId: Types.ObjectId;
    phone: string;
    role: string;
}

type PayloadWithRequired = Required<Payload>;

class KeyStoreService {
    async verifyToken(accessToken: string, clientId: Types.ObjectId) {
        if (!clientId || !accessToken) {
            throw new BadRequest("Invalid client id or access token");
        }

        const keyStore = await KeyStoreModel.findOne({ user: clientId });
        if (!keyStore) throw new AuthFailureError("KeyStore not found");

        try {
            const payload = jwt.verify(
                accessToken,
                keyStore.publicKey
            ) as Payload;
            return { payload, keyStore };
        } catch (error) {
            throw new AuthFailureError("Failed to verify access token");
        }
    }

    /**
     * Creates a pair of access token and refresh token.
     * @param payload - The payload to be signed in the tokens.
     * @param publicKey - The public key used to sign the access token.
     * @param privateKey - The private key used to sign the refresh token.
     * @returns An object containing the access token and refresh token.
     */
    async createTokenPairs(
        payload: PayloadWithRequired,
        publicKey: string,
        privateKey: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = jwt.sign(payload, publicKey, {
            expiresIn: "2 days",
        });

        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        return { accessToken, refreshToken };
    }

    async initialKeyDocuments(
        clientId: string,
        publicKey: string,
        privateKey: string,
        refreshToken: string
    ): Promise<string | null> {
        const filter = { user: clientId };
        const update = {
            publicKey,
            privateKey,
            refreshTokensUsed: [],
            refreshToken,
        };
        const options = { upsert: true, new: true };

        const token = await KeyStoreModel.findOneAndUpdate(
            filter,
            update,
            options
        );
        return token?.publicKey || null;
    }

    async handleRefreshToken(refreshToken: string, clientId: Types.ObjectId) {
        if (!refreshToken || !clientId)
            throw new BadRequest("Missing required arguments");

        const keyStore = await KeyStoreModel.findOne({ user: clientId });
        if (!keyStore) throw new AuthFailureError("KeyStore not found");
        ``;

        const isRefreshTokenUsed = keyStore.refreshToken.includes(refreshToken);
        if (isRefreshTokenUsed) {
            await KeyStoreModel.findByIdAndDelete(keyStore._id);
            throw new AuthFailureError(
                "RefreshToken is invalid, please login again"
            );
        }

        try {
            const payload = jwt.verify(
                refreshToken,
                keyStore.privateKey
            ) as Payload;

            const newTokens = await this.createTokenPairs(
                payload,
                keyStore.publicKey,
                keyStore.privateKey
            );

            // Update refresh token and add it to used tokens
            await KeyStoreModel.findByIdAndUpdate(
                keyStore._id,
                {
                    refreshToken: newTokens.refreshToken,
                    $push: { refreshTokensUsed: keyStore.refreshToken },
                },
                { new: true }
            );

            return newTokens;
        } catch (err) {
            throw new AuthFailureError("RefreshToken is invalid or expired");
        }
    }

    async removeToken(clientId: string) {
        await KeyStoreModel.findOneAndDelete({ user: clientId });
    }
}

export default new KeyStoreService();
