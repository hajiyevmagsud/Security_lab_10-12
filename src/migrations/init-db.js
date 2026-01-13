require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

const initDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const adminUser = await User.create({
                email: adminEmail,
                username: 'admin',
                password: 'Admin@123456',
                role: 'ADMIN',
            });

            logger.info(`Admin user created: ${adminUser.email}`);
        } else {
            logger.info('Admin user already exists');
        }

        const userEmail = 'user@example.com';
        const existingUser = await User.findOne({ email: userEmail });

        if (!existingUser) {
            const regularUser = await User.create({
                email: userEmail,
                username: 'testuser',
                password: 'User@123456',
                role: 'USER',
            });

            logger.info(`Regular user created: ${regularUser.email}`);
        } else {
            logger.info('Regular user already exists');
        }

        logger.info('Database initialization completed');
        process.exit(0);
    } catch (error) {
        logger.error(`Database initialization failed: ${error.message}`);
        process.exit(1);
    }
};

initDatabase();
