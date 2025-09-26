// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import dtos
import {
  ResponseEvaluationCreateApiDTO,
  ResponseEvaluationListingFilterOptions,
  ResponseEvaluationListingFilterRequestDTO,
} from "../dtos/ResponseEvaluation.dto";
import { PaginatedResultsWithMatchingConditionsInternalResponse, RecordListingResponseDTO } from "../dtos/Common.dto";

// import helpers
import { RequestHelper } from "../helpers/request.helper";
import { paginationResponseHelperObj } from "../helpers/pagination-response.helper";

// import models
import { DbResponseEvaluationDto } from "../db/models/ResponseEvaluation.model";

// import services
import { responseEvaluationServiceObj } from "../services/ResponseEvaluation.service";

// import schemas
import {
  responseEvaluationCreateValidation,
  responseEvaluationFilterValidation,
} from "../schemas/ResponseEvaluation.schema";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";

/**
 * ResponseEvaluationController
 *
 * Controller for handling response evaluation-related operations
 */
class ResponseEvaluationController {
  /**
   * createResponseEvaluation
   *
   * Controller for creating a new response evaluation
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  createResponseEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Create Response Evaluation [Controller]`, {
        methodName: this.createResponseEvaluation.name,
      });

      const reqBody: ResponseEvaluationCreateApiDTO = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        responseEvaluationCreateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const responseEvaluationDetails: DbResponseEvaluationDto =
        await responseEvaluationServiceObj.createResponseEvaluation(
          validatedRequestBody
        );

      res.status(HttpStatusCode.CREATED_201).json(responseEvaluationDetails);
    } catch (error) {
      global.logger.error(`Error in Create Response Evaluation [Controller]`, {
        filePath: __filename,
        methodName: this.createResponseEvaluation.name,
        error,
      });
      next(error);
    }
  };

  /**
   * getResponseEvaluationsByFilterOptions
   *
   * Controller for getting response evaluations by filter options
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getResponseEvaluationsByFilterOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get Response Evaluations By Filter Options [Controller]`,
        {
          filePath: __filename,
          methodName: this.getResponseEvaluationsByFilterOptions.name,
        }
      );

      const filterOptions: ResponseEvaluationListingFilterOptions =
        RequestHelper.parseFilterOptions<
          ResponseEvaluationListingFilterRequestDTO,
          ResponseEvaluationListingFilterOptions
        >(req.query as unknown as ResponseEvaluationListingFilterRequestDTO);

      const { error: reqBodyError, value: validatedFilterOptions } =
        responseEvaluationFilterValidation.validate(filterOptions, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const responseEvaluationDetails: PaginatedResultsWithMatchingConditionsInternalResponse<
        DbResponseEvaluationDto[]
      > =
        await responseEvaluationServiceObj.getResponseEvaluationsByFilterOptions(
          validatedFilterOptions
        );

      const { lastKey, count, timesQueried, queriedCount, data } =
        responseEvaluationDetails;

      const response: RecordListingResponseDTO<DbResponseEvaluationDto[]> =
        paginationResponseHelperObj.customizedPaginationRecordListingResponse<
          DbResponseEvaluationDto[],
          ResponseEvaluationListingFilterOptions
        >(data, filterOptions, count, timesQueried, lastKey, queriedCount);

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      global.logger.error(
        `Error in Get Response Evaluations By Filter Options [Controller]`,
        {
          filePath: __filename,
          methodName: this.getResponseEvaluationsByFilterOptions.name,
          error,
        }
      );
      next(error);
    }
  };

  /**
   * getResponseEvaluationByJobApplicationIdAndId
   *
   * Controller for getting response evaluation by job application ID and evaluation response ID
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getResponseEvaluationByJobApplicationIdAndId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get Response Evaluation By Job Application Id And Id [Controller]`,
        {
          filePath: __filename,
          methodName: this.getResponseEvaluationByJobApplicationIdAndId.name,
        }
      );

      const jobApplicationId: string = req.params.jobApplicationId;
      const id: string = req.params.id;

      const responseEvaluationDetails: QueryResponse<DbResponseEvaluationDto> =
        await responseEvaluationServiceObj.getResponseEvaluationByJobApplicationIdAndId(
          jobApplicationId,
          id
        );

      if (!responseEvaluationDetails.count) {
        throw new BaseError(
          "Response Evaluation Not Found",
          HttpStatusCode.NOT_FOUND_404
        );
      }

      res.status(HttpStatusCode.OK_200).json(responseEvaluationDetails[0]);
    } catch (error) {
      global.logger.error(
        `Error in Get Response Evaluation By Job Application Id And Id [Controller]`,
        {
          filePath: __filename,
          methodName: this.getResponseEvaluationByJobApplicationIdAndId.name,
          error,
        }
      );
      next(error);
    }
  };
}

export default ResponseEvaluationController;