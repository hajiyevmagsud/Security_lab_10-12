const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

const getHelmetConfig = () => {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        xContentTypeOptions: true, // X-Content-Type-Options: nosniff
        xFrameOptions: { action: 'deny' }, // X-Frame-Options: DENY
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    });
};

const getRateLimiter = () => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

const getAuthRateLimiter = () => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 failed login attempts per windowMs
        skipSuccessfulRequests: true,
        message: {
            success: false,
            message: 'Too many failed login attempts, please try again after 15 minutes.',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

const getCorsConfig = () => {
    return cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200,
    });
};

const getMongoSanitize = () => {
    return mongoSanitize({
        replaceWith: '_',
        onSanitize: ({ req, key }) => {
            console.warn(`Sanitized key: ${key} in request`);
        },
    });
};

module.exports = {
    getHelmetConfig,
    getRateLimiter,
    getAuthRateLimiter,
    getCorsConfig,
    getMongoSanitize,
};


