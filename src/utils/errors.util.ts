// Import npm packages
import { ValidationError, ValidationErrorItem } from "joi";

// Import the Utils
import HttpStatusCode from "./http-codes.util";

/**
 * BaseError
 * 
 * The custom "BaseError" class that extends "Error" built-in class, to provides standards for error. And must be used application wide.
 */
export class BaseError extends Error {
    /**
     * errorCode
     * 
     * The relevant Http Status Code that describes the error.
     */
    public readonly errorCode: number;

    /**
     * errorMsg
     * 
     * The "errorMsg" that provides more information about the error
     */
    public readonly errorMsg: string;

    /**
     * timeStamp
     * 
     * The "timeStamp" of moment when error occured/thrown
     */
    public readonly timeStamp: string = (new Date()).toISOString();

    /**
     * constructor
     * 
     * The properties are defined here.
     * 
     * @param errorMsg string 
     * @param errorCode number
     */
    constructor(errorMsg: string, errorCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR_500) {
        super(errorMsg);

        Object.setPrototypeOf(this, new.target.prototype);

        this.errorCode = errorCode;
        this.errorMsg = errorMsg;

        Error.captureStackTrace(this);
    }
}

/**
 * RequestValidationError
 * 
 * The custom "RequestValidationError" class that extends "Error" built-in class, to provide request validation errors.
 * 
 * Note: For throwing request validation error, this class must be used.
 */
export class RequestValidationError extends Error {
    /**
     * errorCode
     * 
     * The relevant Http Status Code that describes the error.
     */
    public readonly errorCode: number;

    /**
     * errors
     * 
     * The "errors" that would hold the validation errors occured while handling the request.
     * and returned back to the user/frontend
     */
    public readonly errors: any;

    /**
     * timeStamp
     * 
     * The "timeStamp" of moment when error occured/thrown
     */
    public readonly timeStamp: string = (new Date()).toISOString();;

    /**
     * constructor
     * 
     * The properties are defined here.
     * 
     * @param {ValidationError} validationError
     * @param {number} errorCode [Default: 400]
     */
    constructor(validationError: ValidationError, errorCode: number = HttpStatusCode.BAD_REQUEST_400) {
        // Set the constructure value for the parent class "Error"
        super("One or more validation failed while handling the request.");

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);

        // Set the error code
        this.errorCode = errorCode;

        // Formate the validation error messages as we want to return to the user/frontend
        this.errors = validationError.details.map((item: ValidationErrorItem) => {
            return {
                message: item.message,
                path: item.path,
                type: item.type,
            }
        });
    }
}