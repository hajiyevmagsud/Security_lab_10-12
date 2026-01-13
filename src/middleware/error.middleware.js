const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    let error = err;

    logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
    });

    if (!(error instanceof ApiError)) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => ({
                field: e.path,
                message: e.message,
            }));
            error = ApiError.badRequest('Validation failed');
            error.errors = errors;
        }
        else if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            error = ApiError.conflict(
                `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            );
        }
        else if (error.name === 'CastError') {
            error = ApiError.badRequest(`Invalid ${error.path}: ${error.value}`);
        }
        else if (error.name === 'JsonWebTokenError') {
            error = ApiError.unauthorized('Invalid token');
        }
        else if (error.name === 'TokenExpiredError') {
            error = ApiError.unauthorized('Token expired');
        }
        else if (error.name === 'MulterError') {
            if (error.code === 'LIMIT_FILE_SIZE') {
                error = ApiError.badRequest('File too large');
            } else if (error.code === 'LIMIT_FILE_COUNT') {
                error = ApiError.badRequest('Too many files');
            } else {
                error = ApiError.badRequest(`File upload error: ${error.message}`);
            }
        }
        else {
            error = ApiError.internal(
                process.env.NODE_ENV === 'production'
                    ? 'Internal server error'
                    : error.message
            );
        }
    }

    const response = ApiResponse.error(
        error.statusCode,
        error.message,
        error.errors
    );

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(error.statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
    const error = ApiError.notFound(
        `Route ${req.method} ${req.originalUrl} not found`
    );
    next(error);
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
};
