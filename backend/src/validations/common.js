const Joi = require('joi');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const changePasswordValidation = ({ currentPassword, newPassword, otp }) => {
    const joiSchema = Joi.object().keys({
        currentPassword: Joi.string().required().messages({
            "string.base": `currentPassword should be a type of String`,
            "string.empty": `currentPassword cannot be an empty field`,
            "any.required": `currentPassword is required.`,
        }),
        newPassword: Joi.string().pattern(passwordRegex).required()
        .messages({
            "string.base": `password should be a type of Text`,
            "string.empty": `password cannot be an empty field`,
            "string.pattern.base": `password must contain at least 6 characters, one lowercase letter, one uppercase letter, one number, and one special character.`,
            "any.required": `password is required.`,
        }),
        otp: Joi.string().required().messages({
            "string.base": `otp should be a type of String`,
            "string.empty": `otp cannot be an empty field`,
            "any.required": `otp is required.`,
        }),
    })
    const { value, error } = joiSchema.validate({ currentPassword, newPassword, otp }, { escapeHtml: true })
    return { value, error }
}

const changePasswordOTPValidation = ({ currentPassword, newPassword }) => {
    const joiSchema = Joi.object().keys({
        currentPassword: Joi.string().required().messages({
            "string.base": `currentPassword should be a type of String`,
            "string.empty": `currentPassword cannot be an empty field`,
            "any.required": `currentPassword is required.`,
        }),
        newPassword: Joi.string().pattern(passwordRegex).required()
        .messages({
            "string.base": `password should be a type of Text`,
            "string.empty": `password cannot be an empty field`,
            "string.pattern.base": `password must contain at least 6 characters, one lowercase letter, one uppercase letter, one number, and one special character.`,
            "any.required": `password is required.`,
        })
    })
    const { value, error } = joiSchema.validate({ currentPassword, newPassword }, { escapeHtml: true })
    return { value, error }
}

module.exports = { changePasswordValidation, changePasswordOTPValidation }