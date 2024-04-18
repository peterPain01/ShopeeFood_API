const Joi = require("joi");

module.exports = { 
    async createUser(req, res)
    { 
        const userValid = Joi.object({ 
            phone: Joi.string().required().trim().strict(), 
            password: Joi.string().required().trim().strict(), 
        })
    }
}
