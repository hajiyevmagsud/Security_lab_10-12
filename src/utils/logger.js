class Logger {
    static getTimestamp() {
        return new Date().toISOString();
    }

    static info(message, ...args) {
        console.log(`[${this.getTimestamp()}] [INFO] ${message}`, ...args);
    }

    static warn(message, ...args) {
        console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, ...args);
    }

    static error(message, ...args) {
        console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, ...args);
    }

    static debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[${this.getTimestamp()}] [DEBUG] ${message}`, ...args);
        }
    }
}

module.exports = Logger;
