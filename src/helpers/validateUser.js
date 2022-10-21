const Joi = require('joi');
const validationRegister = (data) => {
    const userSchema = Joi.object({
        username: Joi.string().min(5).max(20).required(),
        email: Joi.string()
            .pattern(new RegExp('@gmail.com$'))
            .email()
            .required(),
        password: Joi.string()
            .pattern(
                new RegExp(
                    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
                ),
            )
            .required(),
    });
    return userSchema.validate(data);
};
const validationLogin = (data) => {
    const userSchema = Joi.object({
        email: Joi.string()
            .pattern(new RegExp('@gmail.com$'))
            .email()
            .required(),
        password: Joi.string()
            .pattern(
                new RegExp(
                    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
                ),
            )
            .required(),
    });
    return userSchema.validate(data);
};
module.exports = { validationRegister, validationLogin };
