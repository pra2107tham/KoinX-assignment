import winston from 'winston';

// Create the Winston logger instance
const logger = winston.createLogger({
    level: 'info', // Log levels: error, warn, info, http, verbose, debug, silly
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Write all logs to the console
        new winston.transports.Console(),
        // Optionally, write logs to a file in production environments
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

export default logger;
