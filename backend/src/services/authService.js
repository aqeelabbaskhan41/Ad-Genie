const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('./jwtService');
const AppError = require('../utils/error');
const constants = require('../config/constants');
const crypto = require('crypto');

const signup = async (name, email, password) => {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError(constants.ERRORS.USER_EXISTS, 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

const login = async (email, password) => {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(constants.ERRORS.INVALID_CREDENTIALS, 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new AppError(constants.ERRORS.INVALID_CREDENTIALS, 401);
    }

    // Generate token
    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

// reset password 
const generateResetToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
};

const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(constants.ERRORS.USER_NOT_FOUND, 404);
    }

    const resetToken = generateResetToken();
    const resetTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    // In real app, send email with reset link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log('Reset link:', resetLink);

    return {
        message: 'Password reset link sent to email',
        resetToken // For testing only - remove in production
    };
};

const resetPassword = async (resetToken, newPassword) => {
    const user = await User.findOne({
        resetToken,
        resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = await hashPassword(newPassword);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    return { message: 'Password reset successful' };
};

module.exports = {
    signup,
    login,
    requestPasswordReset,
    resetPassword
};