import { Request, Response, NextFunction } from "express";
import KeyStoreService from "../services/auth.service";
import { Types } from "mongoose";
import { AuthFailureError } from "../modules/CustomError";

async function getAuthenticateInfo(
    clientId: Types.ObjectId,
    accessToken: string
) {
    if (!clientId || !accessToken) {
        throw new AuthFailureError("Invalid client id or access token");
    }

    try {
        const { payload, keyStore } = await KeyStoreService.verifyToken(
            accessToken,
            clientId
        );

        return { payload, keyStore };
    } catch (err) {
        throw err;
    }
}

export { getAuthenticateInfo };
