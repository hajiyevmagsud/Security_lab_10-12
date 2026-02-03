const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateToken, generateRefreshToken, jwtConfig, verifyRefreshToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class AuthService {
    async register(userData) {
        const { email, username, password } = userData;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw ApiError.conflict('Email already registered');
            }
            if (existingUser.username === username) {
                throw ApiError.conflict('Username already taken');
            }
        }

        const user = await User.create({
            email,
            username,
            password,
            role: 'USER',
        });

        const tokens = await this._generateAuthTokens(user);

        return {
            user: user.toPublicJSON(),
            ...tokens,
        };
    }

    async login(email, password) {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            logger.warn(`Failed login attempt for email: ${email}`);
            throw ApiError.unauthorized('Invalid email or password');
        }

        if (!user.isActive) {
            logger.warn(`Login attempt for deactivated user: ${user.email}`);
            throw ApiError.forbidden('Your account has been deactivated');
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            logger.warn(`Failed login attempt (wrong password) for email: ${email}`);
            throw ApiError.unauthorized('Invalid email or password');
        }

        const tokens = await this._generateAuthTokens(user);

        return {
            user: user.toPublicJSON(),
            ...tokens,
        };
    }

    async refreshAccessToken(token) {
        try {
            const decoded = verifyRefreshToken(token);
            const savedToken = await RefreshToken.findOne({ token, user: decoded.userId });

            if (!savedToken) {
                logger.warn(`Suspicous activity: Refresh token not found in DB but valid JWT. Potential reuse or theft. User: ${decoded.userId}`);
                throw ApiError.unauthorized('Invalid refresh token');
            }

            const user = await User.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw ApiError.unauthorized('User not found or inactive');
            }

            // Rotate tokens: Delete old, create new
            await RefreshToken.deleteOne({ _id: savedToken._id });

            const tokens = await this._generateAuthTokens(user);

            return {
                user: user.toPublicJSON(),
                ...tokens,
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.unauthorized('Refresh token expired. Please log in again.');
            }
            throw error;
        }
    }

    async logout(refreshToken) {
        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }
    }

    async _generateAuthTokens(user) {
        const accessToken = generateToken({ userId: user._id, role: user.role });
        const refreshTokenStr = generateRefreshToken({ userId: user._id });

        // Calculate expiry for DB
        const expiresInMs = parseInt(jwtConfig.refreshExpiresIn, 10) * 24 * 60 * 60 * 1000 || 7 * 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + expiresInMs);

        await RefreshToken.create({
            token: refreshTokenStr,
            user: user._id,
            expiresAt,
        });

        return {
            accessToken,
            refreshToken: refreshTokenStr,
        };
    }

    async getUserById(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user.toPublicJSON();
    }

    async verifyToken(token) {
        const { verifyToken } = require('../config/jwt');

        try {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.userId);

            if (!user || !user.isActive) {
                throw ApiError.unauthorized('Invalid token');
            }

            return user.toPublicJSON();
        } catch (error) {
            throw ApiError.unauthorized('Invalid or expired token');
        }
    }
}

module.exports = new AuthService();

