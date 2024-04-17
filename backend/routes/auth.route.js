const express = require("express");
const AuthController = require("../controller/auth.C");
const authRouter = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, handleRefreshToken } = require("../utils/auth");

authRouter.post("/auth/signup", errorHandler(AuthController.signup));
authRouter.post("/auth/login", errorHandler(AuthController.login));
authRouter.get("/auth/refresh-token", errorHandler(handleRefreshToken));

authRouter.post(
    "/auth/logout",
    verifyToken,
    errorHandler(AuthController.logout)
);

module.exports = authRouter;
