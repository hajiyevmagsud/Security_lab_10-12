const jwt = require('jsonwebtoken');

const jwtConfig = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Short-lived access token
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Longer-lived refresh token
    cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10), // Days
};

const generateToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshExpiresIn,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtConfig.secret);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, jwtConfig.refreshSecret);
};

const getCookieOptions = (type = 'access') => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    if (type === 'refresh') {
        options.expires = new Date(
            Date.now() + jwtConfig.cookieExpiresIn * 24 * 60 * 60 * 1000
        );
        options.path = '/api/auth/refresh-token'; // Limit refresh cookie to refresh endpoint
    }

    return options;
};

module.exports = {
    jwtConfig,
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    getCookieOptions,
};

