const express = require("express");
const AuthController = require("../controller/auth.C");
const authRouter = express.Router();
const errorHandler = require("../utils/errorHandler");
const { verifyToken, handleRefreshToken } = require("../utils/auth");

authRouter.post("/verify-otp", errorHandler(AuthController.verifyOTP));
authRouter.post("/signup", errorHandler(AuthController.signup));
authRouter.post("/login", errorHandler(AuthController.login));
authRouter.get("/refresh-token", errorHandler(handleRefreshToken));

authRouter.post("/logout", verifyToken, errorHandler(AuthController.logout));

module.exports = authRouter;
