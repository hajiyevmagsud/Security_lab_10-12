const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');

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

        const token = generateToken({ userId: user._id, role: user.role });

        return {
            user: user.toPublicJSON(),
            token,
        };
    }

    async login(email, password) {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        if (!user.isActive) {
            throw ApiError.forbidden('Your account has been deactivated');
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        const token = generateToken({ userId: user._id, role: user.role });

        return {
            user: user.toPublicJSON(),
            token,
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
