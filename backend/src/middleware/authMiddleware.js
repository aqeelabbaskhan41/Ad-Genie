const { verifyToken } = require('../services/jwtService');
const { sendResponse } = require('../utils/response');
const constants = require('../config/constants');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return sendResponse(res, 401, false, constants.ERRORS.UNAUTHORIZED);
        }

        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        sendResponse(res, 401, false, constants.ERRORS.INVALID_TOKEN);
    }
};

const optionalAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token && token !== 'null' && token !== 'undefined') {
            const decoded = verifyToken(token);
            req.userId = decoded.userId;
        }
        next();
    } catch (err) {
        // If token is invalid, just proceed without userId
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };