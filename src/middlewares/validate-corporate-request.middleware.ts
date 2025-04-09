// Import Common express functions
import { Request, Response, NextFunction } from "express";

/* // Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import Ulidx package
import { uuidToULID } from "ulidx";

// Import Constants
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import { corporateUserDaoObj } from "../daos/CorporateUser.dao";

// Import models
import { DbCorporateUserDto } from "../db/models/CorporateUser.model";

// Import schemas
import { validateCompanyIdFields } from "../schemas/CorporateUser.schema";

// import utils
import { BaseError, RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util"; */

/**
 * validateCorporateUserRequest
 * 
 * This method is used to validate the request for the corporate user.
 * 1. Match the userCompany with the companyId present in request. If Doesnt match throw an error.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * 
 * @var {string} CompanyId - The company Id in the request .
 * @var {string} userId - The userId of the user.
 **/
export async function validateCorporateUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * We are facing `RangeError` in this middleware.
       * So Temporarily we are commenting this middleware. And
       * Not validating whether the corporate user who is making the request is belonging to the particular company or not.
       *
       * Error Details
       *  "errorMessage": "Maximum call stack size exceeded",
       *  "errorName": "RangeError",
       *  "errorStack": "RangeError: Maximum call stack size exceeded\n
       *      at JSON.stringify (<anonymous>)\n    at t.itemToJSON [as toJSON] (/var/task/dist/src/app.js:2:1551588)",
       */
      return next();

      /* // Extract the companyId if it exist in either body or params or query
        const companyId = req.body.companyId || req.params.companyId || req.query.companyId;

         // Extract the cognito User Group from the response
        const cognitoUserGroups: string[] = global.requestLocalContext.cognitoUserGroups;

        // Extract the cognito User ID from the request
        const cognitoUserId: string = global.requestLocalContext.userId;

        // Convert the cognitoUserId to ULID
        const cognitoUserIdInUlid: string = uuidToULID(cognitoUserId);

        global.logger.info("Validating the request for the corporate user [MIDDLEWARE]", {
            filePath: __filename,
            methodName: validateCorporateUserRequest.name,
            requestLocalContext: global.requestLocalContext,
            endpoint: req.originalUrl,
            cognitoUserIdInUlid: cognitoUserIdInUlid
        });
        
        // Check the userGroup and If the user is Admin then call next() else continue with validation
        if (cognitoUserGroups.includes(APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.ADMIN)) {
            return next();
        }

        // Validate the email field using Joi schema and throw error if not valid
        const { error } = validateCompanyIdFields(companyId);
        if (error) {
            throw new RequestValidationError(error);
        }

        // Get the user details by userId and if it does not exist throw an error
        let userDetails: QueryResponse<DbCorporateUserDto> = await corporateUserDaoObj.getById(cognitoUserIdInUlid);
        if (!userDetails.count) {
            // Throw an error if the user details are not found
            throw new BaseError(`User Details not found`, HttpStatusCode.NOT_FOUND_404);
        }

        // Check if the CompanyId is same as the company name of the user
        if (userDetails[0].companyId !== companyId) {
            // Throw an error if the company name does not match
            throw new BaseError(`User does not belong to the company`, HttpStatusCode.UNAUTHORIZED_401);
        }

        // Everything is good, you can proceed ahead!
        next(); */
    }
    catch (error) {
        // Let global error handler handle the exception (app.ts)
        next(error);
    }
}