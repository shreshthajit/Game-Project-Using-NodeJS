// Import Joi for validation
const Joi = require('joi');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

// Validation function for user sign-up
const userSignUpValidation = ({ email, name, phone, role, password, fcmToken }) => {
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),
        name: Joi.string().required().messages({
            "string.base": `name should be a type of String`,
            "string.empty": `name cannot be an empty field`,
            "any.required": `name is required.`,
        }),
        fcmToken: Joi.required().messages({
            "string.base": `fcmToken should be a type of String`,
            "string.empty": `fcmToken cannot be an empty field`,
        }),
        phone: Joi.string().required().messages({
            "string.base": `phone should be a type of String`,
            "string.empty": `phone cannot be an empty field`,
            "any.required": `phone is required.`,
        }),
        role: Joi.string().valid('user', 'interviewer').required().messages({
            "string.base": `role should be a type of String`,
            "string.empty": `role cannot be an empty field`,
            "any.only": `role must be either 'user' or 'interviewer'.`,
            "any.required": `role is required.`,
        }),
        password: Joi.string().pattern(passwordRegex).required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.empty": `password cannot be an empty field`,
                "string.pattern.base": `password must contain at least 6 characters, one lowercase letter, one uppercase letter, one number, and one special character.`,
                "any.required": `password is required.`,
            })
    });
    const { value, error } = joiSchema.validate({ email, name, phone, role, password, fcmToken }, { escapeHtml: true });
    return { value, error };
};

const userSignUpOTPValidation = ({ email, name, phone, role, password, fcmToken, otp }) => {
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),
        name: Joi.string().required().messages({
            "string.base": `name should be a type of String`,
            "string.empty": `name cannot be an empty field`,
            "any.required": `name is required.`,
        }),
        fcmToken: Joi.required().messages({
            "string.base": `fcmToken should be a type of String`,
            "string.empty": `fcmToken cannot be an empty field`,
        }),
        phone: Joi.string().required().messages({
            "string.base": `phone should be a type of String`,
            "string.empty": `phone cannot be an empty field`,
            "any.required": `phone is required.`,
        }),
        role: Joi.string().valid('user', 'interviewer').required().messages({
            "string.base": `role should be a type of String`,
            "string.empty": `role cannot be an empty field`,
            "any.only": `role must be either 'user' or 'interviewer'.`,
            "any.required": `role is required.`,
        }),
        otp: Joi.string().required().messages({
            "string.base": `otp should be a type of String`,
            "string.empty": `otp cannot be an empty field`,
            "any.required": `otp is required.`,
        }),
        password: Joi.string().pattern(passwordRegex).required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.empty": `password cannot be an empty field`,
                "string.pattern.base": `password must contain at least 6 characters, one lowercase letter, one uppercase letter, one number, and one special character.`,
                "any.required": `password is required.`,
            })
    });
    const { value, error } = joiSchema.validate({ email, name, phone, role, password, fcmToken, otp }, { escapeHtml: true });
    return { value, error };
};

// Validation function for google sign-up/sign-in
const googleValidation = ({ email, name, uid }) => {
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),
        name: Joi.string().required().messages({
            "string.base": `name should be a type of String`,
            "string.empty": `name cannot be an empty field`,
            "any.required": `name is required.`,
        }),
        uid: Joi.required().messages({
            "string.base": `uid should be a type of String`,
            "string.empty": `uid cannot be an empty field`,
        }),
    });
    const { value, error } = joiSchema.validate({ email, name, uid }, { escapeHtml: true });
    return { value, error };
};

// Validation function for admin sign-up
const adminSignUpValidation = ({ email, name, password }) => {
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),
        name: Joi.string().required().messages({
            "string.base": `name should be a type of String`,
            "string.empty": `name cannot be an empty field`,
            "any.required": `name is required.`,
        }),
        password: Joi.string().pattern(passwordRegex).required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.empty": `password cannot be an empty field`,
                "string.pattern.base": `password must contain at least 6 characters, one lowercase letter, one uppercase letter, one number, and one special character.`,
                "any.required": `password is required.`,
            })
    });
    const { value, error } = joiSchema.validate({ email, name, password }, { escapeHtml: true });
    return { value, error };
};

// Validation function for login
const loginValidation = ({ email, password, role, fcmToken }) => {
    // Define Joi schema for login
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),

        fcmToken: Joi.required().messages({
            "string.base": `fcmToken should be a type of String`,
            "string.empty": `fcmToken cannot be an empty field`,
        }),
        role: Joi.string().valid('user', 'interviewer').required().messages({
            "string.base": `role should be a type of String`,
            "string.empty": `role cannot be an empty field`,
            "any.only": `role must be either 'user' or 'interviewer'.`,
            "any.required": `role is required.`,
        }),
        password: Joi.string().required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.empty": `password cannot be an empty field`,
                "any.required": `password is required.`,
            })
    })

    // Validate the input against the defined schema
    const { value, error } = joiSchema.validate({ email, password, role, fcmToken }, { escapeHtml: true })

    // Return the validated value and any validation errors
    return { value, error }
}

// Validation function for login
const adminLoginValidation = ({ email, password }) => {
    // Define Joi schema for login
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),
        password: Joi.string().required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.empty": `password cannot be an empty field`,
                "any.required": `password is required.`,
            })
    })

    // Validate the input against the defined schema
    const { value, error } = joiSchema.validate({ email, password }, { escapeHtml: true })

    // Return the validated value and any validation errors
    return { value, error }
}

// Validation function for forgot password
const forgotPasswordValidation = ({ email }) => {
    // Define Joi schema for login
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email`,
                "any.required": `email is required.`,
            }),
    })

    // Validate the input against the defined schema
    const { value, error } = joiSchema.validate({ email }, { escapeHtml: true })

    // Return the validated value and any validation errors
    return { value, error }
}

// Validation function for reset password
const resetPasswordValidation = ({ token, password }) => {
    // Define Joi schema for login
    const joiSchema = Joi.object().keys({
        token: Joi.string().lowercase().required()
            .messages({
                "string.base": `token should be a type of String`,
                "string.empty": `token cannot be an empty field`,
                "any.required": `token is required.`,
            }),
        password: Joi.string().required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.empty": `password cannot be an empty field`,
                "any.required": `password is required.`,
            })
    })

    // Validate the input against the defined schema
    const { value, error } = joiSchema.validate({ token, password }, { escapeHtml: true })

    // Return the validated value and any validation errors
    return { value, error }
}

// Export the validation functions
module.exports = { userSignUpValidation, adminLoginValidation, loginValidation, forgotPasswordValidation, adminSignUpValidation, resetPasswordValidation, googleValidation, userSignUpOTPValidation };
