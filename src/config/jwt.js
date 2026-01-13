const jwt = require('jsonwebtoken');

const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '1', 10),
};

const generateToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtConfig.secret);
};

const getCookieOptions = () => {
    return {
        expires: new Date(
            Date.now() + jwtConfig.cookieExpiresIn * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
};

module.exports = {
    jwtConfig,
    generateToken,
    verifyToken,
    getCookieOptions,
};
