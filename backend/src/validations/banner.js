const Joi = require('joi');

const createBannerValidation = ({ url, showOnHomePage, description }) => {
    const joiSchema = Joi.object().keys({
        description: Joi.string().messages({
            "string.base": `description should be a type of String`,
            "string.empty": `description cannot be an empty field`,
        }),
        url: Joi.string().required().messages({
            "string.base": `url should be a type of String`,
            "string.empty": `url cannot be an empty field`,
            "any.required": `url is required.`,
        }),
        showOnHomePage: Joi.boolean().messages({
            "boolean.base": `showOnHomePage should be a type of Boolean`,
        })
    })
    const { value, error } = joiSchema.validate({ url, showOnHomePage, description }, { escapeHtml: true })
    return { value, error }
}

const updateBannerValidation = ({ url, showOnHomePage, description }) => {
    const joiSchema = Joi.object().keys({
        description: Joi.string().messages({
            "string.base": `description should be a type of String`,
            "string.empty": `description cannot be an empty field`,
        }),
        url: Joi.string().messages({
            "string.base": `url should be a type of String`,
            "string.empty": `url cannot be an empty field`,
        }),
        showOnHomePage: Joi.boolean().messages({
            "boolean.base": `showOnHomePage should be a type of Boolean`,
        })
    })
    const { value, error } = joiSchema.validate({ url, showOnHomePage, description }, { escapeHtml: true })
    return { value, error }
}

module.exports = { createBannerValidation, updateBannerValidation }
