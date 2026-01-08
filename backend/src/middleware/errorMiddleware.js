const { sendResponse } = require('../utils/response');
const AppError = require('../utils/error');

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError) {
        return sendResponse(res, err.statusCode, false, err.message);
    }

    console.error('Unexpected error:', err);
    return sendResponse(res, 500, false, 'Internal server error');
};

module.exports = errorMiddleware;
