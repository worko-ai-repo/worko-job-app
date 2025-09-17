// Import the NPM packages
import { createLogger, format, transports } from 'winston';

// Import Helpers
import { FileHelper } from '../helpers/file.helper';

/**
 * customLogLevels
 * 
 * Log levels and their colors
 * 
 * @links https://github.com/winstonjs/winston#logging-levels
 */
const customLogLevels = {
    // The below log levels are from winston (winston by default follows `npm` levels log)
    // It is copied here and used just for documentation purpose.
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    colors: {

    },
};

/**
 * format.printf
 * 
 * Our custom formatter to log in the simple line instead of the JSON or anything else.
 * 
 * We are expecting some of the details to be provided while logging the messages.
 * In some cases some of the details may not be present then "undefined" would be printed.
 * 
 * Consider passing some contectutal data, that give backgroud or more information about the user, resource, activity, situation, etc.
 * 
 * Donot log any PII of the user in the log message.
 * 
 * @link https://betterstack.com/community/guides/logging/logging-best-practices/ -- Follow this link for best practices of logging
 */
const customFormatter = format.printf((info: any) => {
    // Extract details from the info
    const { level, message, timestamp, filePath, methodName, ...meta } = info;

    // Expect the "filePath" in the info, we will extract the "fileName" from here, and print it in the error message.
    // From this we will guess the class name while debugging or navigation, etc.
    const fileName = filePath ? FileHelper.getFileName(filePath) : undefined;

    // Final error message
    return `${timestamp} [${level}] [${fileName}] [${methodName}]: ${message}; ${meta ? JSON.stringify(meta, null, 4) : ''}`;
});

// Create and export the Logger instance
const logger = createLogger({
    level: process.env.APP_LOGGER_LOG_MESSAGE_TILL_LOG_LEVEL ?? "silly",
    levels: customLogLevels.levels,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        customFormatter,
        format.colorize({ all: true }),
    ),
    transports: [new transports.Console({})],
    handleExceptions: true,
    // handleRejections: true,
});

// set log format to json
if (process.env.APP_LOGGER_LOG_FORMAT === 'json') {
    console.log('Log format is set to JSON');
    logger.format = format.json();
}
// Set the global logger to make it accessible everywhere
// Make sure to import this file in the "app.ts"
if(global.logger === undefined)
    global.logger = logger;

// Export
export { logger };