const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cors = require("cors");
const compression = require("compression");
const { default: helmet } = require("helmet");
require("./services/initMongoDatabase");
const cookieParser = require('cookie-parser');

const {
    Api404Error,
    logErrorMiddleware,
    returnError,
} = require("./modules/CustomError");

const PORT = process.env.PORT || 8000;
const app = express();

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

app.use(require("./routes/index"));

app.use((req, res, next) => {
    next(new Api404Error("Page Not Found"));
});
app.use(logErrorMiddleware);
app.use(returnError);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
