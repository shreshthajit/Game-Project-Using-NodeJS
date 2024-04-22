const Joi = require('joi');

const adminInfoValidation = ({ name, phone, region }) => {
    const joiSchema = Joi.object().keys({
        name: Joi.string()
            .messages({
                'string.base': `Name should be a type of String`,
            }),
        phone: Joi.string().messages({
            "string.base": `phone should be a type of String`,
        }),
        region: Joi.string().messages({
            "string.base": `region should be a type of String`,
        }),
    })
    phone = phone?.toString();
    const { value, error } = joiSchema.validate({ name, phone, region }, { escapeHtml: true })
    return { value, error }
}

module.exports = { adminInfoValidation }