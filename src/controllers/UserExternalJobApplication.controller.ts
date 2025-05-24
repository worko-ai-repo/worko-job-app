// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose packages
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import dtos
import { UserExternalJobApplicationCreateApiDTO } from "../dtos/UserExternalJobApplication.dto";

// Import helpers
import { getEmailFromPK } from "../helpers/user.helper";

// import models
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbUserExternalJobApplicationDto } from "../db/models/UserExternalJobApplication.model";

// import services
import userDetailServiceObj from "../services/UserDetail.service";
import { userExternalJobApplicationServiceObj } from "../services/UserExternalJobApplication.service";

// Import schemas
import { userExternalJobApplicationCreateApiDTOValidation } from "../schemas/UserExternalJobApplication.schema";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";

/**
 * UserExternalJobApplicationController
 *
 * Controller for handling user external job application-related operations
 */
class UserExternalJobApplicationController {
  /**
   * createUserExternalJobApplication
   *
   * Controller for creating a user external job application
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  createUserExternalJobApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Create User External Job Application [Controller]`, {
        filePath: __filename,
        methodName: this.createUserExternalJobApplication.name,
      });

      // Extract the userId from the response locals
      const cognitoUserId: string = global.requestLocalContext.userId;

      // Parse the user details
      const userDetails: DbUserDetailDto = await userDetailServiceObj.getUserByIdOne(cognitoUserId);

      // Extract and validate the user external job application data from request body and throw error if not valid
      const reqBody: UserExternalJobApplicationCreateApiDTO = req.body;
      const {
        error: reqBodyError,
        value: userExternalJobApplicationRequestBody,
      } = userExternalJobApplicationCreateApiDTOValidation.validate(reqBody, {
        abortEarly: false,
      });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Extract the email from the user details
      const email: string = getEmailFromPK(userDetails.PK);

      // Create the external job application using the service
      const userExternalJobApplicationDetails: DbUserExternalJobApplicationDto =
        await userExternalJobApplicationServiceObj.createUserExternalJobApplication(
          cognitoUserId,
          email,
          userExternalJobApplicationRequestBody
        );

      // send the response
      res
        .status(HttpStatusCode.CREATED_201)
        .json(userExternalJobApplicationDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getByJobIdAndApplicantUserEmail
   *
   * Controller for retrieving a user external job application by job id and applicant user email
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getByJobIdAndApplicantUserEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get User External Job Application By Job Id And Applicant User Email [Controller]`,
        {
          filePath: __filename,
          methodName:
            this.getByJobIdAndApplicantUserEmail.name,
          requestParams: req.params,
        }
      );

      // Extract the email and jobId from the request params
      const emailId: string = req.params?.applicantUserEmail;
      const jobId: string = req.params?.jobId;

      // Get the external job application using the service
      const userExternalJobApplicationDetails: QueryResponse<DbUserExternalJobApplicationDto> =
        await userExternalJobApplicationServiceObj.getByJobIdAndApplicantUserEmail(
          emailId,
          jobId
        );

      // Throw error if not found
      if(!userExternalJobApplicationDetails?.count) {
        throw new BaseError(`The User Job Application not found.`, HttpStatusCode.NOT_FOUND_404);
      }

      // send the response
      res.status(HttpStatusCode.OK_200).json(userExternalJobApplicationDetails[0]);
    } catch (error) {
      next(error);
    }
  };
}

export default UserExternalJobApplicationController;