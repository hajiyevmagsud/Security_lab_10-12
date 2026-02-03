require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

const startServer = async () => {
    try {
        await connectDatabase();

        // HTTP Server - mostly for redirection in production
        const httpServer = http.createServer(app);
        httpServer.listen(PORT, () => {
            logger.info(`HTTP Server running on port ${PORT}`);
        });

        // HTTPS Server
        let httpsServer;
        try {
            const certPath = path.join(__dirname, 'certs', 'cert.pem');
            const keyPath = path.join(__dirname, 'certs', 'key.pem');

            if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
                const credentials = {
                    key: fs.readFileSync(keyPath),
                    cert: fs.readFileSync(certPath),
                };
                httpsServer = https.createServer(credentials, app);
                httpsServer.listen(HTTPS_PORT, () => {
                    logger.info(`HTTPS Server running on port ${HTTPS_PORT}`);
                });
            } else {
                logger.warn('HTTPS certificates not found. Running only on HTTP.');
            }
        } catch (httpsError) {
            logger.error(`Failed to start HTTPS server: ${httpsError.message}`);
        }

        const gracefulShutdown = (signal) => {
            logger.info(`${signal} received. Shutting down gracefully...`);
            httpServer.close(() => {
                logger.info('HTTP Server closed');
                if (httpsServer) {
                    httpsServer.close(() => {
                        logger.info('HTTPS Server closed');
                        process.exit(0);
                    });
                } else {
                    process.exit(0);
                }
            });

            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

