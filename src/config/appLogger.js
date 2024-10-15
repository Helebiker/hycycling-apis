const winston = require("winston");
const fs = require("fs");
const { join } = require("path");
const { systemConfig } = require("./systemConfig");
const { colorize, combine, timestamp, printf } = winston.format;

// Create logs directory if not exists
const logsDir = "./logs";
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Define log format
const myFormat = printf(({ level, message, timestamp }) => {
    return `[${systemConfig.appName} - ${timestamp}] ${level}: ${message}`;
});

// Define logger instance
const appLogger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), colorize(), myFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: join(logsDir, `log_${new Date().toISOString().slice(0, 10)}.log`) })
    ],
});

module.exports = { appLogger };