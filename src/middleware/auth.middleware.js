const { verifyToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            logger.warn(`Unauthorized access attempt: No token provided. Path: ${req.path}, IP: ${req.ip}`);
            throw ApiError.unauthorized('Authentication required. Please log in.');
        }

        const decoded = verifyToken(token);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            logger.warn(`Unauthorized access attempt: User not found for token. ID: ${decoded.userId}, IP: ${req.ip}`);
            throw ApiError.unauthorized('User not found. Please log in again.');
        }

        if (!user.isActive) {
            logger.warn(`Forbidden access attempt: Inactive user. ID: ${user._id}, IP: ${req.ip}`);
            throw ApiError.forbidden('Your account has been deactivated.');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            logger.warn(`Unauthorized access attempt: Invalid token. Error: ${error.message}, IP: ${req.ip}`);
            return next(ApiError.unauthorized('Invalid token. Please log in again.'));
        }

        if (error.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized('Token expired. Please log in again.'));
        }

        next(error);
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.userId).select('-password');

            if (user && user.isActive) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuth,
};

