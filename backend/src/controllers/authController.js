const { signup, login, requestPasswordReset, resetPassword } = require('../services/authService');
const { validateSignup, validateLogin } = require('../validators/authValidator');
const { sendResponse } = require('../utils/response');
const constants = require('../config/constants');

const signupController = async (req, res, next) => {
    try {
        // Validate request
        const { error, value } = validateSignup(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        // Call signup service
        const result = await signup(value.name, value.email, value.password);

        return sendResponse(res, 201, true, constants.SUCCESS.SIGNUP, result);
    } catch (err) {
        next(err);
    }
};

const loginController = async (req, res, next) => {
    try {
        // Validate request
        const { error, value } = validateLogin(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        // Call login service
        const result = await login(value.email, value.password);

        return sendResponse(res, 200, true, constants.SUCCESS.LOGIN, result);
    } catch (err) {
        next(err);
    }
};

// reset password
const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendResponse(res, 400, false, 'Email is required');
        }

        const result = await requestPasswordReset(email);
        return sendResponse(res, 200, true, result.message, { resetToken: result.resetToken });
    } catch (err) {
        next(err);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        if (!resetToken || !newPassword || !confirmPassword) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        if (newPassword !== confirmPassword) {
            return sendResponse(res, 400, false, 'Passwords do not match');
        }

        if (newPassword.length < 6) {
            return sendResponse(res, 400, false, 'Password must be at least 6 characters');
        }

        const result = await resetPassword(resetToken, newPassword);
        return sendResponse(res, 200, true, result.message);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signupController,
    loginController,
    forgotPasswordController,
    resetPasswordController
};
