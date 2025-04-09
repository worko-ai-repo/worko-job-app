// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dtos
import { UserMatchingScoreJobListingFilterOptions, UserMatchingScoreJobListingFilterRequestDTO, UserMatchingScoreJobUpdateApiDTO } from "../dtos/UserMatchingScoreJob.dto";
import { AwsOpensearchRecordListingResponseDTO } from "../dtos/Common.aws-opensearch.dto";

// Import helpers
import { AwsOpensearchRequestHelper } from "../helpers/request.aws-opensearch.helper";

// Import services
import { userMatchingScoreJobServiceObj } from "../services/UserMatchingScoreJob.service";
import userDetailServiceObj from "../services/UserDetail.service";

// Import schemas
import { userMatchingScoreJobFilterDtoValidation, userMatchingScoreJobUpdateApiDTOValidation } from "../schemas/UserMatchingScoreJob.schema";

// Import models
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbUserMatchingScoreJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchUserMatchingScoreJob.model";

// Import utils
import HttpStatusCode from "../utils/http-codes.util";
import { RequestValidationError } from "../utils/errors.util";

/**
 * UserMatchingScoreJobController
 * 
 * Controller for handling user matching score job-related operations
 */
class UserMatchingScoreJobController {
  /**
   * createAllUserMatchingScoreJobByUserId
   *
   * Controller for creating all user matching scores by userId for list of job ids
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  createAllUserMatchingScoreJobByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Update all user matching scores by userId for list of job ids [CONTROLLER]`,
        {
          methodName: this.createAllUserMatchingScoreJobByUserId.name,
        }
      );
  
      // Extract the userId from the response locals
      const cognitoUserId: string = global.requestLocalContext.userId;
  
      // Parse the user details
      const userDetails: DbUserDetailDto =
        await userDetailServiceObj.getUserByIdOne(cognitoUserId);
  
      // Extract and validate the Job Ids data from request body and throw error if not valid
      const reqBody: UserMatchingScoreJobUpdateApiDTO = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        userMatchingScoreJobUpdateApiDTOValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }
  
      const matchingScoreDetails: AwsOpensearchRecordListingResponseDTO<
        DbUserMatchingScoreJobAwsOpensearchDto[]
      > =
        await userMatchingScoreJobServiceObj.createAllUserMatchingScoreJobByUserId(
          userDetails.id,
          validatedRequestBody
        );
  
      res.status(HttpStatusCode.OK_200).json(matchingScoreDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getAllUserMatchingScoreJobByUserId
   *
   * Controller for getting all user matching scores by userId for list of job ids
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getAllUserMatchingScoreJobByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get all user matching scores by userId for list of job ids [CONTROLLER]`,
        {
          methodName: this.getAllUserMatchingScoreJobByUserId.name,
        }
      );
  
      // Extract the userId from the response locals
      const cognitoUserId: string = global.requestLocalContext.userId;
  
      // Parse the user details
      const userDetails: DbUserDetailDto =
        await userDetailServiceObj.getUserByIdOne(cognitoUserId);
  
      const userMatchingScoreJobListingFilterRequest: UserMatchingScoreJobListingFilterOptions =
        AwsOpensearchRequestHelper.parseFilterOptions<
          UserMatchingScoreJobListingFilterRequestDTO,
          UserMatchingScoreJobListingFilterOptions
        >(req.query as unknown as UserMatchingScoreJobListingFilterRequestDTO);
  
      // Validate the request using the appropriate schema
      let { error, value: validatedRequestBody } =
        userMatchingScoreJobFilterDtoValidation.validate(
          userMatchingScoreJobListingFilterRequest,
          {
            abortEarly: false,
          }
        );
      if (error) {
        throw new RequestValidationError(error);
      }
  
      // Prepare the request options for the service
      const userMatchingScoreJobRequestOptions: UserMatchingScoreJobListingFilterOptions =
        {
          ...validatedRequestBody,
          jobIds: validatedRequestBody.jobIds.split(","),
          userId: userDetails.id,
        };
  
      const matchingScoreDetails: AwsOpensearchRecordListingResponseDTO<
        DbUserMatchingScoreJobAwsOpensearchDto[]
      > = await userMatchingScoreJobServiceObj.getAllUserMatchingScoreJobByUserId(
        userMatchingScoreJobRequestOptions
      );
  
      res.status(HttpStatusCode.OK_200).json(matchingScoreDetails);
    } catch (error) {
      next(error);
    }
  };
}

export default UserMatchingScoreJobController;