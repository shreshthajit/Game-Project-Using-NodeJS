const Joi = require('joi');

const createChallengeValidation = ({ topic, opponentId }) => {
    const joiSchema = Joi.object().keys({
        topic: Joi.string().required().messages({
            "string.base": `topic should be a type of String`,
            "string.empty": `topic cannot be an empty field`,
            "any.required": `topic is required.`,
        }),
        opponentId: Joi.string().required().messages({
            "string.base": `opponentId should be a type of String`,
            "string.empty": `opponentId cannot be an empty field`,
            "any.required": `opponentId is required.`,
        })
    })
    const { value, error } = joiSchema.validate({ topic, opponentId }, { escapeHtml: true })
    return { value, error }
}

module.exports = { createChallengeValidation }


