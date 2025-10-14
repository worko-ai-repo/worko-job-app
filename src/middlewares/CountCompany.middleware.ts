
// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import Constants
import APP_CONSTANTS from "../configs/constants.config";

// Import helpers
import { getActionByUserId } from "../helpers/user.helper";

// Import helpers
import { DbCorporateUserDto } from "../db/models/CorporateUser.model";

// Import services
import { corporateUserServiceObj } from "../services/CorporateUser.service";

// Import Utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError } from "../utils/errors.util";

/**
 * CountCompanyMiddleware
 */
class CountCompanyMiddleware {
  /**
   * validateGetCountCompany
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  validateGetCountCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Validate Get Count Company [Middleware]`, {
        methodName: this.validateGetCountCompany.name,
      });

      const cognitoUserGroups: string[] = global.requestLocalContext.cognitoUserGroups;
      if(
        !cognitoUserGroups.includes(APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_RECRUITER) &&
        !cognitoUserGroups.includes(APP_CONSTANTS.COGNITO_IDENTITY_POOL_GROUPS.CORPORATE_ADMIN)
      ) {
         global.logger.error(
            `Cognito user group does not have access to this resource.`,
            {
              methodName: this.validateGetCountCompany.name,
              cognitoUserGroups
            }
         )
        throw new BaseError(
          "Only Corporate Admin and Corporate Recruiter are allowed to access this resource.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      const { actionByUserId, actionByCorporateUserId} = getActionByUserId();
      if(actionByUserId) {
         global.logger.error(
           `No corporate user id found in request`,
           {
             methodName: this.validateGetCountCompany.name,
             actionByCorporateUserId,
             actionByUserId
           }
         )
         throw new BaseError(
           "Only Corporate Admin and Corporate Recruiter are allowed to access this resource.",
           HttpStatusCode.FORBIDDEN_403
         )
      }

      if(!actionByCorporateUserId) {
        global.logger.error(
           `No corporate user id found in request`,
           {
             methodName: this.validateGetCountCompany.name,
             actionByCorporateUserId,
             actionByUserId
           }
        )
        throw new BaseError(
          "Only Corporate Admin and Corporate Recruiter are allowed to access this resource.",
          HttpStatusCode.FORBIDDEN_403
        )
      }

      const corporateDetails: DbCorporateUserDto =
        await corporateUserServiceObj.getCorpUserByIdWithParsing(
          actionByCorporateUserId
        );

      if(corporateDetails.companyId !== req.params.companyId) {
         global.logger.error(
           `Corporate user company id and requested company id do not match.`,
           {
             methodName: this.validateGetCountCompany.name,
             corporateDetails,
             requestedCompanyId: req.params.companyId
           }
        )
        throw new BaseError(
          "You are not allowed to access this resource.",
          HttpStatusCode.FORBIDDEN_403
        );
      }

      next();
    } catch (error) {
      global.logger.error(`Error in Count Company Middleware:`, {
        methodName: this.validateGetCountCompany.name,
        error,
      });

      next(error);
    }
  };
}

const countCompanyMiddlewareObj: CountCompanyMiddleware = new CountCompanyMiddleware();
export { countCompanyMiddlewareObj, CountCompanyMiddleware };