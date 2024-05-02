const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const { default: helmet } = require("helmet");
require("./services/initMongoDatabase");
const cookieParser = require("cookie-parser");

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message:
        "We have received too many requests from this IP. Please try after one hour",
});

const {
    Api404Error,
    logErrorMiddleware,
    returnError,
} = require("./modules/CustomError");
const { max } = require("lodash");

const PORT = process.env.PORT || 8000;
const app = express();

app.use("/uploads/", express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(morgan("common"));
app.use(helmet());
app.use(
    compression({
        level: 5,
        threshold: 100 * 1000, // 100kB
    })
);
app.use(cookieParser());

app.use(limiter);
app.use(require("./routes/index"));

app.use((req, res, next) => {
    next(new Api404Error("Page Not Found"));
});
app.use(logErrorMiddleware);
app.use(returnError);

module.exports = app;
