const Joi = require('joi');

const createQuestionValidation = (requestBody) => {
    const joiSchema = Joi.object().keys({
        question: Joi.string().required().messages({
            "string.base": `question should be a type of String`,
            "string.empty": `question cannot be an empty field`,
            "any.required": `question is required.`,
        }),
        level: Joi.string().valid('easy1', 'easy2', 'easy3', 'mid1', 'mid2', 'mid3', 'hard1', 'hard2', 'hard3').required()
            .messages({
                "string.base": `level should be a type of String`,
                "string.empty": `level cannot be an empty field`,
                "any.only": `level must be one of: 'easy1', 'easy2', 'easy3', 'mid1', 'mid2', 'mid3', 'hard1', 'hard2', 'hard3'.`,
                "any.required": `level is required.`,
            }),
        topic: Joi.string().required().messages({
            "string.base": `topic should be a type of String`,
            "string.empty": `topic cannot be an empty field`,
            "any.required": `topic is required.`,
        }),
        skill: Joi.array().items(Joi.string()).required().messages({
            "array.base": `skill should be an array of strings`,
            "any.required": `skill is required.`,
        }),
        options: Joi.array().items(Joi.object({
            option: Joi.string().required().messages({
                "string.base": `option should be a type of String`,
                "string.empty": `option cannot be an empty field`,
                "any.required": `option is required.`,
            }),
            isCorrect: Joi.boolean().required().messages({
                "boolean.base": `isCorrect should be a type of Boolean`,
                "any.required": `isCorrect is required.`,
            }),
        })).required().messages({
            "array.base": `options should be an array of object`,
            "any.required": `options is required.`,
        }),
        points: Joi.number().required().messages({
            "number.base": `points should be a type of Number`,
            "any.required": `points is required.`,
        }),
        timer: Joi.number().required().messages({
            "number.base": `timer should be a type of Number`,
            "any.required": `timer is required.`,
        }),
    });

    const { value, error } = joiSchema.validate(requestBody, { escapeHtml: true });
    return { value, error };
}

const updateQuestionValidation = (requestBody) => {
    const joiSchema = Joi.object().keys({
        question: Joi.string().messages({
            "string.base": `question should be a type of String`,
            "string.empty": `question cannot be an empty field`,
        }),
        level: Joi.string().valid('easy1', 'easy2', 'easy3', 'mid1', 'mid2', 'mid3', 'hard1', 'hard2', 'hard3')
            .messages({
                "string.base": `level should be a type of String`,
                "string.empty": `level cannot be an empty field`,
                "any.only": `level must be one of: 'easy1', 'easy2', 'easy3', 'mid1', 'mid2', 'mid3', 'hard1', 'hard2', 'hard3'.`,
            }),
        topic: Joi.string().messages({
            "string.base": `topic should be a type of String`,
            "string.empty": `topic cannot be an empty field`,
        }),
        skill: Joi.array().items(Joi.string()).messages({
            "array.base": `skill should be an array of strings`,
        }),
        options: Joi.array().items(Joi.object({
            option: Joi.string().messages({
                "string.base": `option should be a type of String`,
                "string.empty": `option cannot be an empty field`,
            }),
            isCorrect: Joi.boolean().messages({
                "boolean.base": `isCorrect should be a type of Boolean`,
            }),
        })).messages({
            "array.base": `options should be an array of object`,
        }),
        points: Joi.number().messages({
            "number.base": `points should be a type of Number`,
        }),
    });

    const { value, error } = joiSchema.validate(requestBody, { escapeHtml: true });
    return { value, error };
}

const answerValidation = ({ challengeId, topic, answers }) => {
    const joiSchema = Joi.object({
        challengeId: Joi.string().required().messages({
            "string.base": `challengeId should be a type of String`,
            "string.empty": `challengeId cannot be an empty field`,
            "any.required": `challengeId is required.`,
        }),
        topic: Joi.string().required().messages({
            "string.base": `topic should be a type of String`,
            "string.empty": `topic cannot be an empty field`,
            "any.required": `topic is required.`,
        }),
        answers: Joi.array().items(Joi.object({
            questionId: Joi.string().required().messages({
                "string.base": `questionId should be a type of String`,
                "string.empty": `questionId cannot be an empty field`,
                "any.required": `questionId is required.`,
            }),
            answer: Joi.string().required().messages({
                "string.base": `answer should be a type of String`,
                "string.empty": `questionId cannot be an empty field`,
                "any.required": `answer is required.`,
            }),
        })).required().messages({
            "array.base": `answers should be an array of object`,
            "any.required": `answers is required.`,
        }),
    });

    const { value, error } = joiSchema.validate({ challengeId, topic, answers }, { escapeHtml: true });
    return { value, error };
}

const checkAnswerValidation = ({ challengeId, questionId, answer }) => {
    const joiSchema = Joi.object({
        challengeId: Joi.string().required().messages({
            "string.base": `challengeId should be a type of String`,
            "string.empty": `challengeId cannot be an empty field`,
            "any.required": `challengeId is required.`,
        }),
        answer: Joi.string().required().messages({
            "string.base": `answer should be a type of String`,
            "string.empty": `answer cannot be an empty field`,
            "any.required": `answer is required.`,
        }),
        questionId: Joi.string().required().messages({
            "string.base": `questionId should be a type of String`,
            "string.empty": `questionId cannot be an empty field`,
            "any.required": `questionId is required.`,
        }),
    });

    const { value, error } = joiSchema.validate({ challengeId, questionId, answer }, { escapeHtml: true });
    return { value, error };
}

const selfChallengeAnswerValidation = ({ topic, answers }) => {
    const joiSchema = Joi.object({
        topic: Joi.string().required().messages({
            "string.base": `topic should be a type of String`,
            "string.empty": `topic cannot be an empty field`,
            "any.required": `topic is required.`,
        }),
        answers: Joi.array().items(Joi.object({
            questionId: Joi.string().required().messages({
                "string.base": `questionId should be a type of String`,
                "string.empty": `questionId cannot be an empty field`,
                "any.required": `questionId is required.`,
            }),
            answer: Joi.string().required().messages({
                "string.base": `answer should be a type of String`,
                "string.empty": `answer cannot be an empty field`,
                "any.required": `answer is required.`,
            }),
        })).required().messages({
            "array.base": `answers should be an array of objects`,
            "any.required": `answers is required.`,
        }),
    });

    const { value, error } = joiSchema.validate({ topic, answers }, { escapeHtml: true });
    return { value, error };
}
module.exports = { createQuestionValidation, updateQuestionValidation, answerValidation, selfChallengeAnswerValidation, checkAnswerValidation };
