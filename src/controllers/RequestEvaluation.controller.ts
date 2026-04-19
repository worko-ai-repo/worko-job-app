// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";

// import dtos
import {
  RequestEvaluationCreateApiDTO,
  RequestEvaluationBulkCreateApiDTO,
  RequestEvaluationListingFilterOptions,
  RequestEvaluationListingFilterRequestDTO,
} from "../dtos/RequestEvaluation.dto";
import { PaginatedResultsWithMatchingConditionsInternalResponse, RecordListingResponseDTO } from "../dtos/Common.dto";

// import helpers
import { RequestHelper } from "../helpers/request.helper";
import { paginationResponseHelperObj } from "../helpers/pagination-response.helper";

// import models
import { DbRequestEvaluationDto } from "../db/models/RequestEvaluation.model";

// import services
import { requestEvaluationServiceObj } from "../services/RequestEvaluation.service";

// import schemas
import {
  requestEvaluationCreateValidation,
  requestEvaluationBulkCreateValidation,
  requestEvaluationFilterValidation,
  requestEvaluationCompanyFilterValidation,
} from "../schemas/RequestEvaluation.schema";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";

/**
 * RequestEvaluationController
 *
 * Controller for handling request evaluation-related operations
 */
class RequestEvaluationController {
  /**
   * createRequestEvaluation
   *
   * Controller for creating a new request evaluation
   * 
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  createRequestEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Create Request Evaluation [Controller]`, {
        methodName: this.createRequestEvaluation.name,
      });

      const reqBody: RequestEvaluationCreateApiDTO = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        requestEvaluationCreateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const requestEvaluationDetails: DbRequestEvaluationDto =
        await requestEvaluationServiceObj.createRequestEvaluation(
          validatedRequestBody
        );

      res.status(HttpStatusCode.CREATED_201).json(requestEvaluationDetails);
    } catch (error) {
      global.logger.error(`Error at catch block in Create Request Evaluation [Controller]`, {
        error,
        methodName: this.createRequestEvaluation.name,
      });
      next(error);
    }
  };

  /**
   * createBulkRequestEvaluation
   *
   * Controller for creating bulk request evaluations
   * 
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  createBulkRequestEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Create Bulk Request Evaluation [Controller]`, {
        methodName: this.createBulkRequestEvaluation.name,
      });

      const reqBody: RequestEvaluationBulkCreateApiDTO = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        requestEvaluationBulkCreateValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const requestEvaluationDetails: {
        uprocessedItems: ObjectType[];
        existingItems: DbRequestEvaluationDto[];
      } = await requestEvaluationServiceObj.createBulkRequestEvaluation(
        validatedRequestBody
      );

      res.status(HttpStatusCode.CREATED_201).json(requestEvaluationDetails);
    } catch (error) {
      global.logger.error(`Error at catch block in Create Bulk Request Evaluation [Controller]`, {
        error,
        methodName: this.createBulkRequestEvaluation.name,
      });
      next(error);
    }
  };

  /**
   * getRequestEvaluationsByFilterOptions
   *
   * Controller for getting request evaluations by filter options
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getRequestEvaluationsByFilterOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get Request Evaluations By Filter Options [Controller]`,
        {
          methodName: this.getRequestEvaluationsByFilterOptions.name,
        }
      );

      const filterOptions: RequestEvaluationListingFilterOptions =
        RequestHelper.parseFilterOptions<
          RequestEvaluationListingFilterRequestDTO,
          RequestEvaluationListingFilterOptions
        >(req.query as unknown as RequestEvaluationListingFilterRequestDTO);

      const { error: reqBodyError, value: validatedFilterOptions } =
        requestEvaluationFilterValidation.validate(filterOptions, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const requestEvaluationDetails: PaginatedResultsWithMatchingConditionsInternalResponse<DbRequestEvaluationDto[]> =
        await requestEvaluationServiceObj.getRequestEvaluationsByFilterOptions(
          validatedFilterOptions
        );

      const { lastKey, count, timesQueried, queriedCount, data } =
        requestEvaluationDetails;

      const response: RecordListingResponseDTO<DbRequestEvaluationDto[]> =
        paginationResponseHelperObj.customizedPaginationRecordListingResponse<
          DbRequestEvaluationDto[],
          RequestEvaluationListingFilterOptions
        >(data, filterOptions, count, timesQueried, lastKey, queriedCount);

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getRequestEvaluationsByFilterOptionsForCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get Request Evaluations By Filter Options [Controller]`,
        {
          methodName: this.getRequestEvaluationsByFilterOptionsForCompany.name,
        }
      );

      const filterOptions: RequestEvaluationListingFilterOptions =
        RequestHelper.parseFilterOptions<
          RequestEvaluationListingFilterRequestDTO,
          RequestEvaluationListingFilterOptions
        >(req.query as unknown as RequestEvaluationListingFilterRequestDTO);

      const { error: reqBodyError, value: validatedFilterOptions } =
        requestEvaluationCompanyFilterValidation.validate(filterOptions, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const requestEvaluationDetails: PaginatedResultsWithMatchingConditionsInternalResponse<DbRequestEvaluationDto[]> =
        await requestEvaluationServiceObj.getRequestEvaluationsByFilterOptionsForCompany(
          validatedFilterOptions
        );

      const { lastKey, count, timesQueried, queriedCount, data } =
        requestEvaluationDetails;

      const response: RecordListingResponseDTO<DbRequestEvaluationDto[]> =
        paginationResponseHelperObj.customizedPaginationRecordListingResponse<
          DbRequestEvaluationDto[],
          RequestEvaluationListingFilterOptions
        >(data, filterOptions, count, timesQueried, lastKey, queriedCount);

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getRequestEvaluationByJobApplIdAndEvaluationReqId
   *
   * Controller for getting request evaluation by job application ID and evaluation request ID
   *
   * @param {Request} req - Express request object:
   * @param {Response} res - Express response object used to send back the API response.
   * @param {NextFunction} next - Express next function for error handling.
   */
  getRequestEvaluationByJobApplIdAndEvaluationReqId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Get Request Evaluation By Job Application ID and Evaluation Request ID [Controller]`,
        {
          methodName: this.getRequestEvaluationByJobApplIdAndEvaluationReqId.name,
        }
      );

      const jobApplicationId: string = req.params.jobApplicationId;
      const evaluationRequestId: string = req.params.evaluationRequestId;

      const requestEvaluationDetails: QueryResponse<DbRequestEvaluationDto> =
        await requestEvaluationServiceObj.getRequestEvaluationByJobApplIdAndEvaluationReqId(
          jobApplicationId,
          evaluationRequestId
        );

      if (!requestEvaluationDetails.count) {
        throw new BaseError(
          `No request evaluation found for this job application.`,
          HttpStatusCode.NOT_FOUND_404
        )
      }

      res.status(HttpStatusCode.OK_200).json(requestEvaluationDetails[0]);
    } catch (error) {
      global.logger.error(`Error at catch block in Get Request Evaluation By Job Application ID and Evaluation Request ID [Controller]`, {
        error,
        methodName: this.getRequestEvaluationByJobApplIdAndEvaluationReqId.name,
      });
      next(error);
    }
  };
}

export default RequestEvaluationController;