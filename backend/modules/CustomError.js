const httpStatusCodes = require("./httpStatusCodes");

class CustomError extends Error {
    constructor(description, statusCode) {
        super(description);
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

// CUSTOMIZE ERROR
class InternalServerError extends CustomError {
    constructor(
        description = "INTERNAL SERVER ERROR",
        statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(description, statusCode);
    }
}

class Api404Error extends CustomError {
    constructor(
        description = "Not found.",
        statusCode = httpStatusCodes.NOT_FOUND
    ) {
        super(description, statusCode);
    }
}

class BadRequest extends CustomError {
    constructor(
        description = "Bad Request",
        statusCode = httpStatusCodes.BAD_REQUEST
    ) {
        super(description, statusCode);
    }
}

class ConflictRequest extends CustomError {
    constructor(
        description = "CONFLICT",
        statusCode = httpStatusCodes.CONFLICT
    ) {
        super(description, statusCode);
    }
}

class ForbiddenRequest extends CustomError {
    constructor(
        description = "FORBIDDEN",
        statusCode = httpStatusCodes.FORBIDDEN
    ) {
        super(description, statusCode);
    }
}

class AuthFailureError extends CustomError {
    constructor(
        description = "UNAUTHORIZED",
        statusCode = httpStatusCodes.UNAUTHORIZED
    ) {
        super(description, statusCode);
    }
}

function logError(err) {
    console.error(err);
}

function logErrorMiddleware(err, req, res, next) {
    logError(err);
    next(err);
}

function returnError(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        message: err?.message || "Internal Server Error",
        metadata: {},
    });
}

module.exports = {
    CustomError,
    Api404Error,
    BadRequest,
    AuthFailureError,
    ConflictRequest,
    InternalServerError,
    ForbiddenRequest,
    logErrorMiddleware,
    returnError,
};
