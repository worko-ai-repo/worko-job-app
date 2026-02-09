// Import the npm packages
import { Request, Response, NextFunction } from "express";
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import APP_CONSTANTS from "../configs/constants.config";

export function getAuthorizerContextForLocal() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const mockUserId: string | undefined = process.env.APP_AWS_AUTH_MOCK_USER_ID;
        const mockUserEmail: string | undefined = process.env.APP_AWS_AUTH_MOCK_USER_EMAIL;
        if(!mockUserId || !mockUserEmail) {
          global.logger.error("APP_AWS_AUTH_MOCK_USER_ID or APP_AWS_AUTH_MOCK_USER_EMAIL is not set in the .env file");
          throw new BaseError("APP_AWS_AUTH_MOCK_USER_ID or APP_AWS_AUTH_MOCK_USER_EMAIL is not set in the .env file", HttpStatusCode.INTERNAL_SERVER_ERROR_500);
        }
        global.requestLocalContext = {
          userId: mockUserId,
          userEmail: mockUserEmail,
          cognitoUserGroups: [
            APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.ADMIN,
          ],
        };
        next();
      } catch (error) {
        global.logger.error(`Get Authorizer Context For Local [Middleware]`, {
          methodName: "getAuthorizerContextForLocal",
          error,
        })
        next(error);
      }
    };
  }
  
/**
 * getAuthorizerContext
 * 
 * This middleware function is responsible for setting the "userId" and "userEmail" in the response locals,
 * which can be accessed by subsequent middleware functions or route handlers to use them as needed.
 */
export function getAuthorizerContext() {
    /**
     * Function to get the authorizer context and set userId and userEmail in response locals.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function in the middleware chain.
     * @returns {Promise<void>}
     */
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            // Get the "authorizer" from the "requestContext" that was set by the "Cognito Authorizer" lambda function
            // And "lambdaEvent" was set in handler "callback" in the "app.ts" file by reading it from the the lambda event.
            const eventReqContextAuthorizer = (req as any)?.lambdaEvent?.requestContext?.authorizer;

            // Set "res.locals" variables, set the "userId" , "userEmail" and "cognitoUserGroups" in the response object, 
            // So that it is accessible throught this request cycle,
            // These values will be used as "createdByUserId", "updatedByUserId", etc in the database.
            res.locals.userId = eventReqContextAuthorizer?.userId ?? null;
            res.locals.userEmail = eventReqContextAuthorizer?.userEmail ?? null;
            res.locals.cognitoUserGroups = JSON.parse(
              eventReqContextAuthorizer?.groups ?? []
            );

            /**
             * The userId, userEmail and cognitoUserGroups will be send from the authorizer lambda function(i.e. `worko-auth` lambda function in aws) to the backend.
             * Store the "userId", "userEmail" and "cognitoUserGroups" in the "global" object.
             * This will be used in the "global.requestLocalContext" object to store the values in the "res.locals" object.
             */
            global.requestLocalContext = {
                userId: res.locals.userId,
                userEmail: res.locals.userEmail,
                cognitoUserGroups: res.locals.cognitoUserGroups
            };

            // Logger message
            global.logger.info("getAuthorizerContext details: ", {
                filePath: __filename,
                methodName: "getAuthorizerContext",
                eventReqContextAuthorizer,
                locals: res.locals,
                requestLocalContext: global.requestLocalContext
            });

            // Everything is good, you can proceed ahead!
            next();
        } catch (error) {
            // Let global error handler handle the exception (app.ts)
            next(error);
        }
    }
}