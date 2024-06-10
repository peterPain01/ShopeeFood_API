const { BadRequest } = require("../modules/CustomError");
// Source from: https://gist.github.com/tungvn/2460c5ba947e5cbe6606c5e85249cf04
function isVietnamesePhoneNumber(number) {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

module.exports = {
    signUpValidate(req, res, next) {
        const { phone, password } = req.body;
        if (!isVietnamesePhoneNumber(phone))
            next(new BadRequest("Invalid phone number"));
        else if (password.length < 6)
            next(new BadRequest("Password must have at least 6 characters"));
        else next();
    },
};
