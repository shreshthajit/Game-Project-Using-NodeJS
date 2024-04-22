const Joi = require('joi');

const accountInfoValidation = ({ name, phone, city, college, isProfileCompleted }) => {
    const joiSchema = Joi.object().keys({
        name: Joi.string()
            .messages({
                'string.base': `Name should be a type of String`,
            }),
        phone: Joi.string().messages({
            "string.base": `phone should be a type of String`,
        }),
        city: Joi.string().messages({
            "string.base": `city should be a type of String`,
        }),
        college: Joi.string().messages({
            "string.base": `college should be a type of String`,
        }),
        isProfileCompleted: Joi.boolean().messages({
            "boolean.base": `isProfileCompleted should be a type of Boolean`,
        }),
    })
    phone = phone?.toString();
    const { value, error } = joiSchema.validate({ name, phone, city, college, isProfileCompleted }, { escapeHtml: true })
    return { value, error }
}

module.exports = { accountInfoValidation }