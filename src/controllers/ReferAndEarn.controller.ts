//Import from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import express types
import { NextFunction, Request, Response } from "express";

// Import dtos
import {
  ReferAndEarnCreateApiDto,
  ReferAndEarnCreateDto,
  ReferAndEarnUpdateApiDto,
  ReferAndEarnFilterOptions,
  ReferAndEarnListingFilterRequestDTO,
  ReferAndEarnRequestWithdrawalApiDto,
} from "../dtos/ReferAndEarn.dto";
import {
  PaginatedResultsWithMatchingConditionsInternalResponse,
  RecordListingResponseDTO,
} from "../dtos/Common.dto";

// Import enums
import { ReferAndEarnJobApplicationStatusEnum } from "../enums/ReferAndEarn.enum";

//Import helpers
import { paginationResponseHelperObj } from "../helpers/pagination-response.helper";
import { RequestHelper } from "../helpers/request.helper";
import { getEmailFromPK, getPhoneCountryCodeAndNumber } from "../helpers/user.helper";

// Import models
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbReferAndEarnDto } from "../db/models/ReferAndEarn.model";

// Import schemas
import {
  referAndEarnCreateApiDtoValidation,
  referAndEarnFilterOptionsValidation,
  referAndEarnRequestWithdrawalApiDtoValidation,
  referAndEarnUpdateApiDtoValidation,
} from "../schemas/ReferAndEarn.schema";

// Import services
import { referAndEarnServiceObj } from "../services/ReferAndEarn.service";
import userDetailServiceObj from "../services/UserDetail.service";

// Import utils
import { BaseError, RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * ReferAndEarnController
 *
 * Controller for handling refer and earn related operations
 */
class ReferAndEarnController {
  /**
   * getReferAndEarnById
   *
   * This method handles the HTTP request to fetch a single refer and earn record
   * by its ID. It extracts the ID from the request parameters, calls the service
   * layer to retrieve the record, and returns either the found record or an empty
   * object if no record was found.
   *
   * @param {Request} req - The Express request object containing the ID parameter
   * @param {Response} res - The Express response object for sending the result
   * @param {NextFunction} next - The Express next function for error handling
   */
  async getReferAndEarnById(req: Request, res: Response, next: NextFunction) {
    try {
      global.logger.info(`Get Refer And Earn By Id [Controller]`, {
        filePath: __filename,
        methodName: "getReferAndEarnById",
      });

      // Extract the refer and earn ID from the request
      const referAndEarnId: string = req.params.id;

      // Call the service layer to retrieve the refer and earn record
      const ReferAndEarnDetails: QueryResponse<DbReferAndEarnDto> = await referAndEarnServiceObj.getReferAndEarnById(referAndEarnId);

      // Retrieve the final record from the response
      const finalResponse: DbReferAndEarnDto | {} = ReferAndEarnDetails.count === 0 ? {} : ReferAndEarnDetails[0];

      // Send the response
      res.status(HttpStatusCode.OK_200).json(finalResponse);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * getReferAndEarnByFilterOptions
   *
   * Retrieves refer and earn records based on specified filter criteria.
   *
   * This method handles the HTTP request to fetch refer and earn records with
   * various filter options. It extracts query parameters from the request, constructs
   * a filter options object, calls the service layer to retrieve the filtered records,
   * and returns the paginated results.
   *
   * @param {Request} req - The Express request object containing query parameters
   * @param {Response} res - The Express response object for sending the results
   * @param {NextFunction} next - The Express next function for error handling
   */
  async getReferAndEarnByFilterOptions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      global.logger.info(`Get Refer And Earn By filter options [Controller]`, {
        filePath: __filename,
        methodName: "getReferAndEarnByFilterOptions",
      });

      // Parse filter options from the request query parameters
      const referAndEarnListingFilterRequest: ReferAndEarnFilterOptions =
        RequestHelper.parseFilterOptions<
          ReferAndEarnListingFilterRequestDTO,
          ReferAndEarnFilterOptions
        >(req.query as unknown as ReferAndEarnListingFilterRequestDTO);

      // Validate the request using the Joi schema
      const { error: reqBodyError, value: referAndEarnRequestBody } =
        referAndEarnFilterOptionsValidation.validate(
          referAndEarnListingFilterRequest,
          { abortEarly: false }
        );

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      // Get referrals using the service - with the correct return type
      const referAndEarnDetails: PaginatedResultsWithMatchingConditionsInternalResponse<
        DbReferAndEarnDto[]
      > = await referAndEarnServiceObj.getReferAndEarnByFilterOptions(
        referAndEarnRequestBody
      );

      // Extract the response data
      const { lastKey, count, timesQueried, queriedCount, data } =
        referAndEarnDetails;

      // Generate the pagination response
      const referAndEarnResponse: RecordListingResponseDTO<
        DbReferAndEarnDto[]
      > = paginationResponseHelperObj.customizedPaginationRecordListingResponse<
        DbReferAndEarnDto[],
        ReferAndEarnFilterOptions
      >(
        data,
        referAndEarnRequestBody,
        count,
        timesQueried,
        lastKey,
        queriedCount
      );

      // Return the response
      res.status(HttpStatusCode.OK_200).json(referAndEarnResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * createReferAndEarn
   *
   * This method is used to create a new refer and earn
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  createReferAndEarn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // logger
      global.logger.info(`Create Refer and earn [Controller]`, {
        filePath: __filename,
        methodName: this.createReferAndEarn.name,
      });

      // Store the request body according to the dto.
      const requestBody: ReferAndEarnCreateApiDto = req.body;

      // Validate the user input and throw a validation error if necessary using the Joi schema
      const { error, value: validatedReferAndEarnRequestBody } =
        referAndEarnCreateApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (error) {
        // Throw the validation error with details
        throw new RequestValidationError(error);
      }

      // Extract the userId from the response locals
      const cognitoUserId: string = global.requestLocalContext.userId;

      // Parse the user details
      const userDetails: DbUserDetailDto = await userDetailServiceObj.getUserByIdOne(cognitoUserId);

      // Retrieve the referrer email
      const referrerEmail: string = getEmailFromPK(userDetails.PK);

      // Get phone country code and number
      const {
        phoneCountryCode, // 91
        phoneNumber // 9666xxx100
      } = getPhoneCountryCodeAndNumber(userDetails.number)

      // Create Internal DTO
      const jobCreateDto: ReferAndEarnCreateDto = {
        ...validatedReferAndEarnRequestBody,
        createdByUserId: cognitoUserId,
        referrerDetails: {
          id: userDetails.id,
          email: referrerEmail,
          name: userDetails.name.toLowerCase(),
          phoneCountryCode: phoneCountryCode, // 91
          phoneNumber: phoneNumber // 9666xxx100
        }
      };

      // Call the service to create the job
      const referAndEarnDetails: DbReferAndEarnDto =
        await referAndEarnServiceObj.performReferAndEarnCreateActivities(
          referrerEmail, // referrer email
          jobCreateDto
        );

      // send response with job details
      res.status(HttpStatusCode.CREATED_201).json(referAndEarnDetails);
    } catch (error) {
      // Pass the error to Express's default error handler
      next(error);
    }
  };

  /**
   * updateReferAndEarnById
   *
   * Updates an existing refer and earn ticket's status, email, or phone number.
   *
   * This method handles the HTTP request to update a refer and earn record. It logs
   * the update attempt, extracts the ID and email from request parameters and update
   * fields from the request body, validates that at least one field is provided for
   * update, calls the service layer to perform the update, and returns the updated record.
   *
   * @param {Request} req - The Express request object containing parameters and update data
   * @param {Response} res - The Express response object for sending the updated record
   * @param {NextFunction} next - The Express next function for error handling
   */
  updateReferAndEarnById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // logger
      global.logger.info(`Update Refer and earn [Controller]`, {
        filePath: __filename,
        methodName: this.updateReferAndEarnById.name,
      });

      // Request body
      const updateRequestBody: ReferAndEarnUpdateApiDto = req.body;

      // Validate the user input and throw a validation error if necessary using the Joi schema
      const { error, value: validatedUpdateReferAndEarnRequestBody } =
        referAndEarnUpdateApiDtoValidation.validate(updateRequestBody, {
          abortEarly: false,
        });
      if (error) {
        // Throw the validation error with details
        throw new RequestValidationError(error);
      }

      // Parse the user details
      const userDetails: DbUserDetailDto =
        await userDetailServiceObj.getUserByIdOne(
          global.requestLocalContext.userId
        );

      // Fetch existing refer and earn ticket
      const existingReferAndEarn: QueryResponse<DbReferAndEarnDto> =
        await referAndEarnServiceObj.getReferAndEarnById(req.params.id);
      if (!existingReferAndEarn.count) {
        throw new BaseError(
          `The Refer and Earn details not found.`,
          HttpStatusCode.NOT_FOUND_404
        );
      }

      // Call service to update the refer and earn ticket
      const updatedReferAndEarn: DbReferAndEarnDto =
        await referAndEarnServiceObj.updateReferAndEarnById(
          validatedUpdateReferAndEarnRequestBody,
          userDetails,
          existingReferAndEarn[0]
        );

      // Send response with updated data
      res.status(HttpStatusCode.OK_200).json(updatedReferAndEarn);
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateReferAndEarnRequestWithdrawal
   *
   * @param {Request} req - The Express request object containing parameters and update data
   * @param {Response} res - The Express response object for sending the updated record
   * @param {NextFunction} next - The Express next function for error handling
   */
  updateReferAndEarnRequestWithdrawal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Update Refer and earn request withdrawal [Controller]`,
        {
          filePath: __filename,
          methodName: this.updateReferAndEarnRequestWithdrawal.name,
        }
      );

      // Request body
      const requestBody: ReferAndEarnRequestWithdrawalApiDto = req.body;

      // Validate and throw an error if necessary using the Joi schema
      const { error, value: validatedReferAndEarnRequestBody } =
        referAndEarnRequestWithdrawalApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (error) {
        // Throw the validation error with details
        throw new RequestValidationError(error);
      }

      // Parse the user details
      const userDetails: DbUserDetailDto = await userDetailServiceObj.getUserByIdOne(
        global.requestLocalContext.userId
      );

      // Fetch existing refer and earn details
      const existingReferAndEarn: QueryResponse<DbReferAndEarnDto> = await referAndEarnServiceObj.getReferAndEarnByReferrerEmailAndId(
        getEmailFromPK(userDetails.PK),
        req.params.id
      );

      // Check if the refer and earn details exists
      if (!existingReferAndEarn.count) {
        throw new BaseError(
          `You are not allowed to request for withdrawal.`,
          HttpStatusCode.FORBIDDEN_403
        );
      }

      // Retrieve the existing refer and earn data
      const existingReferAndEarnData: DbReferAndEarnDto =
        existingReferAndEarn[0];

      // If the job application status is not equal to `JOINED` then don't allow `referrer` to request for withdrawal
      if (
        existingReferAndEarnData.jobApplicationStatus !==
          ReferAndEarnJobApplicationStatusEnum.JOINED ||
        !existingReferAndEarnData.userJobApplicationId
      ) {
        global.logger.error(
          "Withdrawal is only allowed after your referred friend has officially joined the company.",
          {
            filePath: __filename,
            methodName: this.createReferAndEarn.name,
            existingReferAndEarnData,
          }
        );

        throw new BaseError(
          `Withdrawal is only allowed after your referred friend has officially joined the company.`,
          HttpStatusCode.FORBIDDEN_403
        );
      }

      // Call service to update the refer and earn data
      const updatedReferAndEarn: DbReferAndEarnDto =
        await referAndEarnServiceObj.updateReferAndEarnRequestWithdrawal(
          existingReferAndEarnData,
          userDetails, // referrer details
          validatedReferAndEarnRequestBody
        );

      // Send response with updated data
      res.status(HttpStatusCode.OK_200).json(updatedReferAndEarn);
    } catch (error) {
      next(error);
    }
  };
}

export default ReferAndEarnController;
