import { Request, Response, NextFunction } from "express";
import Constant from "../config/Constant";

const requestCounts: { [key: string]: number } = {};

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const clientId = req.header("x-client-id");
    const accessToken = req.header("x-authorization");

    if (!clientId || !accessToken) {
        return res.status(401).json({
            code: 401,
            status: "Error",
            message: "Unauthorized.",
            data: null,
        });
    }

    req.user = {
        accessToken,
        clientId,
    };

    next();
}

// Rate Limiting
export function rateLimitAndTimeout(
    req: Request,
    res: Response,
    next: NextFunction
) {
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

    if (requestCounts[ip] > Constant.rateLimit) {
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

export function resetRateLimit() {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0;
    });
}
