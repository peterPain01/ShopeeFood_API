import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import services from "./config/Services";
import {
    rateLimitAndTimeout,
    resetRateLimit,
    authenticate,
} from "./middlewares/index";
import Constant from "./config/Constant";
import { getAuthenticateInfo } from "./middlewares/auth";
import { Types } from "mongoose";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import MongoInstance from "./services/mongo";
MongoInstance.connectWithRetry();

const PORT = Number(process.env.PORT) || 5000;
const HOST = "127.0.0.1";

const app = express();

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            accessToken: string;
            clientId: string;
        };
    }
}

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by");

setInterval(resetRateLimit, Constant.interval);
app.use(rateLimitAndTimeout);

app.use("/chat", async (req, res, next) => {
    const clientId = new Types.ObjectId(req.header("x-client-id"));
    const accessToken = req.header("x-authorization");

    if (!clientId || !accessToken) return;
    const { payload, keyStore } = await getAuthenticateInfo(
        clientId,
        accessToken
    );
    if (payload && keyStore) {
        req.headers["x-authorization"] = accessToken;
        req.headers["x-user-role"] = payload.role;
        req.headers["x-client-id"] = payload.role;
    }
    next();
});

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${route}`]: "",
        },
    };

    // Apply rate limiting and timeout middleware before proxying
    app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions));
});

app.use((_req, res) => {
    res.status(404).json({
        code: 404,
        status: "Error",
        message: "Route not found.",
        data: null,
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Gateway server listening on http://${HOST}:${PORT}`);
});
