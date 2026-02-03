require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const {
    getHelmetConfig,
    getRateLimiter,
    getAuthRateLimiter,
    getCorsConfig,
    getMongoSanitize,
} = require('./config/security');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const noteRoutes = require('./routes/note.routes');
const demoRoutes = require('./routes/demo.routes');

const app = express();

// Security Middleware
app.use(getHelmetConfig());
app.use(getCorsConfig());
app.use(getRateLimiter());
app.use(getMongoSanitize());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Force HTTPS redirect middleware (will be active if we start HTTPS server)
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.path}`);
        next();
    });
}

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', getAuthRateLimiter(), authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/demo', demoRoutes);


app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Security Labs Backend API',
        version: '1.0.0',
        documentation: '/api/docs',
    });
});

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
