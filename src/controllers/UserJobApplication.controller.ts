// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose packages
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import dtos
import {
  UserJobApplicationCreateApiDTO,
  UserJobApplicationDisplayToCorporateApiDTO,
  UserJobApplicationHiredFromOtherPortalApiDTO,
  UserJobApplicationHiredFromOtherPortalDTO,
  UserJobApplicationListingFilterOptions,
  UserJobApplicationListingFilterRequestDTO,
  UserJobApplicationRequestFeedbackApiDTO,
  UserJobApplicationUpdateApiDTO,
} from "../dtos/UserJobApplication.dto";
import {
  PaginatedResultsWithMatchingConditionsInternalResponse,
  RecordListingResponseDTO,
} from "../dtos/Common.dto";

// import enums
import { UserType } from "../enums/User.enum";

// import helpers
import { RequestHelper } from "../helpers/request.helper";
import { paginationResponseHelperObj } from "../helpers/pagination-response.helper";
import { getActionByUserId, getEmailFromPK } from "../helpers/user.helper";

// import models
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import { DbUserDetailDto } from "../db/models/UserDetail.model";

// import services
import { userJobApplicationServiceObj } from "../services/UserJobApplication.service";
import userDetailServiceObj from "../services/UserDetail.service";

// import schemas
import {
  UserCreateJobApplicationDTOValidation,
  userJobApplicationHiredFromOtherPortalValidationApiDto,
  userJobApplicationFilterDtoValidation,
  userJobApplicationRequestFeedbackValidation,
  userJobApplicationUpdateValidation,
  userJobApplicationDisplayToCorporateValidation,
} from "../schemas/UserJobApplication.schema";

// import types
import { JobApplicationWithUserDetailsType } from "../types/UserJobApplication.type";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";
import ErrorCodeName from "../utils/error-code-name.util";

/**
 * UserJobApplicationController
 *
 * Controller for handling user job application-related operations
 */
class UserJobApplicationController {
  /**
   * createJobApplication
   *
   * Controller for creating a new job application
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  createJobApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // logger
      global.logger.info(`Create Job Application [Controller]`, {
        filePath: __filename,
        methodName: this.createJobApplication.name,
      });

      // Extract the userId from the response locals
      const cognitoUserId: string = global.requestLocalContext.userId;

      // Parse the user details
      const userDetails: DbUserDetailDto =
        await userDetailServiceObj.getUserByIdOne(cognitoUserId);

      // Extract and validate the job application data from request body and throw error if not valid
      const reqBody: UserJobApplicationCreateApiDTO = req.body;
      const { error: reqBodyError, value: jobApplicationRequestBody } =
        UserCreateJobApplicationDTOValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Create the job application using the service
      const newJobApplicationDetails: DbUserJobApplicationDto =
        await userJobApplicationServiceObj.createJobApplication(
          userDetails,
          jobApplicationRequestBody
        );

      res.status(HttpStatusCode.CREATED_201).json(newJobApplicationDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getJobApplicationScore
   *
   * Controller for getting job application score
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getJobApplicationScore = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Get Job Application Score [Controller]`, {
        filePath: __filename,
        methodName: this.getJobApplicationScore.name,
        requestParams: req.params,
      });

      // Get job applications score using the service
      const userJobApplicationScoreDetails: DbUserJobApplicationDto =
        await userJobApplicationServiceObj.getJobApplicationScore(
          req.params.id
        );

      // return the response
      res.status(HttpStatusCode.OK_200).json(userJobApplicationScoreDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getJobApplicationById
   *
   * Controller for getting job application by id
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getJobApplicationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Get Job Application By Id [Controller]`, {
        filePath: __filename,
        methodName: this.getJobApplicationById.name,
        requestParams: req.params,
      });

      // Extract and validate the job application id from request parameters and throw error if not valid
      const jobApplicationId: string = req.params.id;

      // Get job applications for the candidate using the service
      const jobApplicationDetails: DbUserJobApplicationDto =
        await userJobApplicationServiceObj.getJobApplicationById(
          jobApplicationId
        );

      // return the response
      res.status(HttpStatusCode.OK_200).json(jobApplicationDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getUserJobApplicationByEmailIdAndJobId
   *
   * Controller for retrieving a user job application by job id and applicant user email
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getUserJobApplicationByEmailIdAndJobId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get User Job Application By Job Id And Applicant User Email [Controller]`,
        {
          filePath: __filename,
          methodName:
            this.getUserJobApplicationByEmailIdAndJobId.name,
          requestParams: req.params,
        }
      );

      // Extract the email and jobId from the request params
      const emailId: string = req.params?.applicantUserEmail;
      const jobId: string = req.params?.jobId;

      const userJobApplicationDetails: QueryResponse<DbUserJobApplicationDto> =
        await userJobApplicationServiceObj.getUserJobApplicationByEmailIdAndJobId(
          emailId,
          jobId
        );

      // Throw error if not found
      if(!userJobApplicationDetails?.count) {
        throw new BaseError(`The User Job Application not found.`, HttpStatusCode.NOT_FOUND_404);
      }

      // send the response
      res.status(HttpStatusCode.OK_200).json(userJobApplicationDetails[0]);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getJobApplicationsByFilterOptions
   *
   * Controller for getting job applications by filter options
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getJobApplicationsByFilterOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get Job Applications By filter options [Controller]`,
        {
          filePath: __filename,
          methodName: this.getJobApplicationsByFilterOptions.name,
        }
      );

      // Parse filter options from the request query parameters
      const userJobApplicationRecordListingFilterRequest: UserJobApplicationListingFilterOptions =
        RequestHelper.parseFilterOptions<
          UserJobApplicationListingFilterRequestDTO,
          UserJobApplicationListingFilterOptions
        >(req.query as unknown as UserJobApplicationListingFilterRequestDTO);

      // Validate the request body using the Joi schema and throw a validation error if not valid
      const { error: reqBodyError, value: jobApplicationRequestBody } =
        userJobApplicationFilterDtoValidation.validate(
          userJobApplicationRecordListingFilterRequest,
          {
            abortEarly: false,
          }
        );
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Get job applications for the corporate user using the service
      const userJobApplicationDetails:
        | PaginatedResultsWithMatchingConditionsInternalResponse<
            JobApplicationWithUserDetailsType[]
          >
        | PaginatedResultsWithMatchingConditionsInternalResponse<
            (DbUserJobApplicationDto & {
              jobUrl: string | undefined;
              jobTitle: string | undefined;
              jdExtracted: string | undefined;
            })[]
          > =
        await userJobApplicationServiceObj.getJobApplicationsByFilterOptions(
          jobApplicationRequestBody
        );

      if (jobApplicationRequestBody.userType === UserType.CAND) {
        // Extract the count, timesQueried,lastKey and other details from the response
        const { lastKey, count, timesQueried, queriedCount, data } =
          userJobApplicationDetails;

        // Generate the pagination response
        const jobApplicationsResponse: RecordListingResponseDTO<
          (DbUserJobApplicationDto & {
            jobUrl: string | undefined;
            jobTitle: string | undefined;
            jdExtracted: string | undefined;
          })[]
        > =
          paginationResponseHelperObj.customizedPaginationRecordListingResponse<
            (DbUserJobApplicationDto & {
              jobUrl: string | undefined;
              jobTitle: string | undefined;
              jdExtracted: string | undefined;
            })[],
            UserJobApplicationListingFilterOptions
          >(
            data as (DbUserJobApplicationDto & {
              jobUrl: string | undefined;
              jobTitle: string | undefined;
              jdExtracted: string | undefined;
            })[],
            userJobApplicationRecordListingFilterRequest,
            count,
            timesQueried,
            lastKey,
            queriedCount
          );

        // return the response
        res.status(HttpStatusCode.OK_200).json(jobApplicationsResponse);
      } else {
        const { lastKey, count, timesQueried, queriedCount, data } =
          userJobApplicationDetails;

        // Generate the pagination response
        const jobApplicationsResponse: RecordListingResponseDTO<
          JobApplicationWithUserDetailsType[]
        > =
          paginationResponseHelperObj.customizedPaginationRecordListingResponse<
            JobApplicationWithUserDetailsType[],
            UserJobApplicationListingFilterOptions
          >(
            data as JobApplicationWithUserDetailsType[],
            userJobApplicationRecordListingFilterRequest,
            count,
            timesQueried,
            lastKey,
            queriedCount
          );

        // return the response
        res.status(HttpStatusCode.OK_200).json(jobApplicationsResponse);
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateJobApplicationByCorpUser
   *
   * Controller for updating job application by corp user
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  updateJobApplicationByCorpUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Update Job Application By Corp User [Controller]`, {
        filePath: __filename,
        methodName: this.updateJobApplicationByCorpUser.name,
        reqBody: req.body,
        reqParams: req.params,
      });

      // Get job application id from the request Parameters
      const jobApplicationId: string = req.params.id;

      // Get job application details from the request body and validate it, if not valid throw error
      const reqBody: UserJobApplicationUpdateApiDTO = req.body;
      const { error: reqBodyError, value: jobApplicationRequestBody } =
        userJobApplicationUpdateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Update job application details using the service
      const userJobApplicationDetails: DbUserJobApplicationDto =
        await userJobApplicationServiceObj.updateJobApplicationByCorpUser(
          jobApplicationId,
          jobApplicationRequestBody
        );

      // return the response
      res.status(HttpStatusCode.OK_200).json(userJobApplicationDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateJobApplicationRequestFeedback
   *
   * Controller for when user requests for feedback
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  updateJobApplicationRequestFeedback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Create Job Application Request Feedback [Controller]`,
        {
          filePath: __filename,
          methodName: this.updateJobApplicationRequestFeedback.name,
          reqParams: req.params,
        }
      );

      // Get job application details from the request body and validate it, if not valid throw error
      const reqBody: UserJobApplicationRequestFeedbackApiDTO = req.body;
      const { error: reqBodyError, value: jobApplicationRequestBody } =
        userJobApplicationRequestFeedbackValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Get job application id from the request Parameters
      const jobApplicationId: string = req.params.id;

      const jobApplicationFeedbackRequestDetails: boolean =
        await userJobApplicationServiceObj.updateJobApplicationRequestFeedback(
          jobApplicationRequestBody,
          jobApplicationId
        );

      res.status(HttpStatusCode.OK_200).json({
        isNotficationSent: jobApplicationFeedbackRequestDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateJobApplicationDisplayToCorporate
   *
   * Controller for when worko admin send job application to recruiter
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  updateJobApplicationDisplayToCorporate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Update Job Application Display To Corporate [Controller]`,
        {
          filePath: __filename,
          methodName: this.updateJobApplicationDisplayToCorporate.name,
          reqParams: req.params,
        }
      );

      // Get job application details from the request body and validate it, if not valid throw error
      const reqBody: UserJobApplicationDisplayToCorporateApiDTO = req.body;
      const { error: reqBodyError, value: jobApplicationRequestBody } =
        userJobApplicationDisplayToCorporateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const jobApplicationDetails: DbUserJobApplicationDto = await userJobApplicationServiceObj.updateJobApplicationDisplayToCorporate(
        req.params.id, // `id` attribute of `UserJobApplication.model.ts`
        jobApplicationRequestBody
      );

      res.status(HttpStatusCode.OK_200).json(jobApplicationDetails);
    } catch (error: any) {
      global.logger.debug(
        `Error at catch block in while sending to recruiter. [Script Controller]`,
        {
          error,
          methodName: this.updateJobApplicationDisplayToCorporate.name,
        }
      );

      if(error?.code === ErrorCodeName.RESOURCE_NOT_FOUND_EXCEPTION && error.statusCode === HttpStatusCode.NOT_FOUND_404) {
        global.logger.error(`Schedule Not found to delete.`, {
          methodName: this.updateJobApplicationDisplayToCorporate.name,
        })
        res.status(HttpStatusCode.FORBIDDEN_403).json(
          {
            "errorCode": HttpStatusCode.FORBIDDEN_403,
            "errorMsg": "You can only send to corporates before specified hours.",
          }
        )
      }
      next(error);
    }
  };

  /**
   * updateUserJobApplicationHiredFromOtherPortalDetails
   *
   * Controller for when a corporate recruiter/admin hires a candidate
   * from a different job portal and updates the duplicacy details while viewing the application on Worko.ai.
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  updateUserJobApplicationHiredFromOtherPortalDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Update User Job Application Hired From Other Portal Details [Controller]`,
        {
          filePath: __filename,
          methodName:
            this.updateUserJobApplicationHiredFromOtherPortalDetails.name,
          reqParams: req.params,
        }
      );

      // Get job application id
      const jobApplicationId: string = req.params.id;

      // Get job application details from the request body and validate it, if not valid throw error
      const reqBody: UserJobApplicationHiredFromOtherPortalApiDTO = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        userJobApplicationHiredFromOtherPortalValidationApiDto.validate(
          reqBody,
          {
            abortEarly: false,
          }
        );
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Get existing user job application details
      const existingUserJobApplicationDetails: DbUserJobApplicationDto =
        await userJobApplicationServiceObj.getJobApplicationById(
          jobApplicationId
        );

      // Get email id from PK of existingUserJobApplicationDetails;
      const emailId: string = getEmailFromPK(
        existingUserJobApplicationDetails.PK
      );

      // Get actionByUserId and actionByCorporateUserId using the helper function
      const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

      // Prepare the details required to be updated
      let userJobApplicationHiredFromOtherPortalDetails: UserJobApplicationHiredFromOtherPortalDTO =
        {
          ...validatedRequestBody,
        };

      if (actionByUserId) {
        userJobApplicationHiredFromOtherPortalDetails.updatedByUserId =
          actionByUserId;
      }

      if (actionByCorporateUserId) {
        userJobApplicationHiredFromOtherPortalDetails.updatedByCorporateUserId =
          actionByCorporateUserId;
      }

      const userJobApplicationDetails: DbUserJobApplicationDto =
        await userJobApplicationServiceObj.updateUserJobApplicationHiredFromOtherPortalDetails(
          jobApplicationId,
          emailId,
          userJobApplicationHiredFromOtherPortalDetails
        );

      res.status(HttpStatusCode.OK_200).json(userJobApplicationDetails);
    } catch (error) {
      next(error);
    }
  };
}

export default UserJobApplicationController;
