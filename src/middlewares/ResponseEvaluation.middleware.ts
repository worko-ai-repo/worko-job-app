
// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import Constants
import APP_CONSTANTS from "../configs/constants.config";

// Import Utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError } from "../utils/errors.util";

/**
 * ResponseEvaluationMiddleware
 */
class ResponseEvaluationMiddleware {
  /**
   * validateCreateResponseEvaluation
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  validateCreateResponseEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
   try {
      global.logger.info(`Validate Create Response Evaluation [Middleware]`, {
        methodName: this.validateCreateResponseEvaluation.name,
      });

      // Read the "cognitoUserGroups" of the user from the global object
      const cognitoUserGroups: string[] = global.requestLocalContext.cognitoUserGroups;

      if (
        !cognitoUserGroups.includes(
          APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.EVALUATOR
        )
      ) {
        global.logger.error(
          `Unauthorized to create response evaluation. [Middleware]`,
          {
            methodName: this.validateCreateResponseEvaluation.name,
            cognitoUserGroups,
          }
        )

        throw new BaseError(
          "Unauthorized",
          HttpStatusCode.UNAUTHORIZED_401
        );
      }

      next();
   } catch (error) {
      global.logger.error(`Error in validateCreateResponseEvaluation Middleware:`, {
        methodName: this.validateCreateResponseEvaluation.name,
        error,
      });

      next(error);
   }
  };
}

const responseEvaluationMiddlewareObj: ResponseEvaluationMiddleware = new ResponseEvaluationMiddleware();
export { responseEvaluationMiddlewareObj, ResponseEvaluationMiddleware };