const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        }

        const formattedErrors = errors.array().map((error) => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value,
        }));

        const error = ApiError.badRequest('Validation failed');
        error.errors = formattedErrors;

        next(error);
    };
};

const sanitizeBody = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    next();
};

const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    const sanitized = {};

    for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
            continue;
        }

        sanitized[key] = sanitizeObject(obj[key]);
    }

    return sanitized;
};

module.exports = {
    validate,
    sanitizeBody,
};
