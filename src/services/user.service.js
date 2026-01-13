const User = require('../models/User');
const ApiError = require('../utils/ApiError');

class UserService {
    async getUserById(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user.toPublicJSON();
    }

    async updateUser(userId, updateData) {
        const allowedUpdates = ['username'];
        const updates = {};

        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                updates[key] = updateData[key];
            }
        }

        if (updates.username) {
            const existingUser = await User.findOne({
                username: updates.username,
                _id: { $ne: userId },
            });

            if (existingUser) {
                throw ApiError.conflict('Username already taken');
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user.toPublicJSON();
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return true;
    }

    async getAllUsers(filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const query = {};

        if (filters.role) {
            query.role = filters.role;
        }

        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);

        return {
            users: users.map((user) => user.toPublicJSON()),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}

module.exports = new UserService();
