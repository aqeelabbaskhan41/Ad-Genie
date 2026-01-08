const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'string.empty': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.empty': 'Password is required'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'string.empty': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required'
        })
});

const validateSignup = (data) => signupSchema.validate(data);
const validateLogin = (data) => loginSchema.validate(data);

module.exports = {
    validateSignup,
    validateLogin
};