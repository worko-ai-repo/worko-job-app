// Import the installed packages
import { Response } from "express";

// Import the local packages
import APP_CONSTANTS from "../configs/constants.config";
import HttpStatusCode from "./http-codes.util";
import { BaseError, RequestValidationError } from "./errors.util";

/**
 * ErrorHandler
 * 
 * This class handles the error and does required activities like logging, informing developer (if required), etc.
 */
class ErrorHandler {
    /**
     * logError
     * 
     * Log the error (original) on server with appropriate level based on the different error classes.
     * 
     * @param err any
     */
    public logError(err: any) {
        // Error level
        const level = "error";

        // @todo
        // Define the level based on the different error classes
        // ---------
        // ---------
        // ---------

        // Log the error
        global.logger.log(level, "%s", err);
    }

    /**
     * handleError
     * 
     * This method basically logs the error as of now.
     * 
     * Note: If "res" is passed then make sure that at the end the "BaseError" class should be passed in the response
     * 
     * @param err any
     * @param res Response [Optional] It is to respond back to the user's request with appropriate error/exception details.
     */
    public handleError(err: any, res?: Response) {
        // Log the actual error that was thrown 
        // and return the customised error to the user in the response later in the code
        this.logError(err);

        // Check if "res" param is set, if then then respond to the user's request
        if (res) {
            // An object to hold the new/custom error object if required.
            // Note: The value should be object of our own custom error class, that has "errorCode", "errorMsg", and "timeStamp" properties
            let newErrorObj = null;

            // When object is instance of the provided classes then no changes/parsing required
            if (
                err instanceof BaseError ||
                err instanceof RequestValidationError
            ) {
                newErrorObj = err;
            }

            // Check if "newErrorObj" is not set then set it with our base error class to have standard response
            if (!newErrorObj) {
                // Prepare the necessary details to respond to the user's request
                let responseStatus = err.status ?? HttpStatusCode.INTERNAL_SERVER_ERROR_500;
                let responseMessage = err.message ?? APP_CONSTANTS.ERROR_MESSAGE_UNKNOWN_EXCEPTION;
                newErrorObj = new BaseError(responseMessage, responseStatus);
            }

            // Respond to the user's request with generic error class that has standard response
            return res
                .status(newErrorObj.errorCode)
                .send(newErrorObj);
        }
    }

    /**
     * isTrustedError (isKnownError))
     * 
     * This method checks if the error object is from the know classes then it indicates the error should mmanually handled.
     * If not then error nees to be handled by the express server default error mechanism.
     * 
     * Note: As of now all errors/exceptions are considered trusted/know and handled manually.
     * Later we may improve this as needed.
     * 
     * @param error any
     * @returns boolean
     */
    public isTrustedError(error: any) {
        return true;
    }
}

export const errorHandler = new ErrorHandler();