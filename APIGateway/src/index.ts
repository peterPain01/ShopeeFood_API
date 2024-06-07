import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by"); // Hide Express server information

// Define rate limit constants
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

const requestCounts: { [key: string]: number } = {};

// Reset request count
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0;
    });
}, interval);

function rateLimitAndTimeout(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    if (!ip) {
        return res.status(400).json({
            code: 400,
            status: "Error",
            message: "Invalid IP address.",
            data: null,
        });
    }

    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    if (requestCounts[ip] > rateLimit) {
        return res.status(429).json({
            code: 429,
            status: "Error",
            message: "Rate limit exceeded.",
            data: null,
        });
    }

    // Set timeout for each request (example: 10 seconds)
    req.setTimeout(15000, () => {
        res.status(504).json({
            code: 504,
            status: "Error",
            message: "Gateway timeout.",
            data: null,
        });
        req.aborted = true; // Abort the request
    });

    next();
}

app.use(rateLimitAndTimeout);

import services from "./services";

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
    // Proxy options
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

app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});
