
// Import query responses
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import dtos
import { RequestEvaluationCommonUpdateDto } from "../dtos/RequestEvaluation.dto";
import {
  ResponseEvaluationCreateApiDTO,
  ResponseEvaluationCreateDTO,
  ResponseEvaluationListingFilterOptions,
} from "../dtos/ResponseEvaluation.dto";
import { PaginatedResultsWithMatchingConditionsInternalResponse, PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// import daos
import { responseEvaluationDao } from "../daos/ResponseEvaluation.dao";

// Import dtos
import { UserJobApplicationCommonUpdateDto } from "../dtos/UserJobApplication.dto";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// import models
import { DbResponseEvaluationDto } from "../db/models/ResponseEvaluation.model";

// Import services
import { requestEvaluationServiceObj } from "./RequestEvaluation.service";
import { userJobApplicationServiceObj } from "./UserJobApplication.service";
import UlidService from "../services/Ulid.service";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * ResponseEvaluationService
 * 
 * Service for handling response evaluation-related operations
 */
class ResponseEvaluationService {
  /**
   * createResponseEvaluation
   *
   * Creates a new response evaluation
   *
   * @param {ResponseEvaluationCreateApiDTO} requestBody - The response evaluation data
   * @returns {Promise<DbResponseEvaluationDto>} A promise that resolves to the created response evaluation
   */
  async createResponseEvaluation(
    requestBody: ResponseEvaluationCreateApiDTO
  ): Promise<DbResponseEvaluationDto> {
    global.logger.info("Create Response Evaluation [Service]", {
      filePath: __filename,
      methodName: this.createResponseEvaluation.name,
    });

    /**
     * Check whether the response evaluation already exists
     * If the response evaluation already exists, then throw error
     */
    const existingResponseEvaluation: QueryResponse<DbResponseEvaluationDto> =
      await responseEvaluationDao.getResponseEvaluationByEvaluatorEmailAndJobApplicationId(
        requestBody.createdByUserEmail,
        requestBody.jobApplicationId
      );
    if (existingResponseEvaluation.count) {
      throw new BaseError(
        `Already submitted the feedback for the given job application.`,
        HttpStatusCode.CONFLICT_409
      );
    }

    const curretnActionDate: string = dateHelperObj.getISODate();

    const {score, detailedFeedback, htmlDetailedFeedback, reason, comment, htmlComment,...restRequestBody} = requestBody;

    const cognitoUserId: string = global.requestLocalContext.userId;
    const convertedCognitoUserId: string = UlidService.convertUuidToUlid(cognitoUserId);

    /**
     * Prepare the data required to create  
     */
    const createData: ResponseEvaluationCreateDTO = {
      ...restRequestBody,
      createdByEvaluatorUserId: convertedCognitoUserId,
      statusTracker: [
        {
          score: score,
          detailedFeedback: detailedFeedback,
          htmlDetailedFeedback: htmlDetailedFeedback,
          oldStatus: undefined,
          newStatus: requestBody.status,
          reason: reason,
          comment: comment,
          htmlComment: htmlComment,
          actionDate: curretnActionDate,
        },
      ],
    };
  
    // Create the response evaluation using the DAO
    const responseEvaluationDetails: DbResponseEvaluationDto = await responseEvaluationDao.createResponseEvaluation(createData);

    // Prepare update data
    const updateData: Partial<RequestEvaluationCommonUpdateDto> = {
      evaluationResponseId: responseEvaluationDetails.id,
      evaluationResponseStatus: responseEvaluationDetails.status,
    };

    await requestEvaluationServiceObj.updateRequestEvaluation(
      requestBody.createdByUserEmail,
      responseEvaluationDetails.jobApplicationId,
      responseEvaluationDetails.evaluationRequestId,
      updateData
    );

    // Prepare update data to update the job application
    const updateJobApplicationData: Partial<UserJobApplicationCommonUpdateDto> =
      {
        isEvaluatorResponded: true,
      };

    await userJobApplicationServiceObj.updateJobApplicationByIdAndPrimaryEmail(
      responseEvaluationDetails.jobApplicationId,
      responseEvaluationDetails.applicantUserEmail,
      updateJobApplicationData
    );

    return responseEvaluationDetails;
  }

  /**
   * getResponseEvaluationsByFilterOptions
   *
   * Retrieves response evaluations based on filter options
   *
   * @param {ResponseEvaluationListingFilterOptions} filterOptions - The filter options
   * @returns {Promise<PaginatedResultsWithMatchingConditionsInternalResponse<DbResponseEvaluationDto[]>>} A promise that resolves to paginated response evaluation data
   */
  async getResponseEvaluationsByFilterOptions(
    filterOptions: ResponseEvaluationListingFilterOptions
  ): Promise<PaginatedResultsWithMatchingConditionsInternalResponse<DbResponseEvaluationDto[]>> {
    global.logger.info("Get Response Evaluations By Filter Options [Service]", {
      filePath: __filename,
      methodName: this.getResponseEvaluationsByFilterOptions.name,
    });

    // Fetch response evaluations using filter options
    const responseEvaluationDetails: PaginatedResultsWithMatchingConditionsResponse<DbResponseEvaluationDto> = await responseEvaluationDao.getResponseEvaluationsByFilterOptions(filterOptions);

    // Extract data from the response
    const { lastKey, count, timesQueried, queriedCount, ...responseEvaluationData } = responseEvaluationDetails;

    // Convert to array
    const responseEvaluationArray: DbResponseEvaluationDto[] = Object.values(responseEvaluationData);

    const paginatedResponseEvaluations: PaginatedResultsWithMatchingConditionsInternalResponse<DbResponseEvaluationDto[]> = {
      data: responseEvaluationArray,
      lastKey,
      count,
      timesQueried,
      queriedCount,
    };

    return paginatedResponseEvaluations;
  }

  /**
   * getResponseEvaluationByJobApplicationIdAndId
   *
   * Retrieves a response evaluation by job application ID and evaluation response ID
   *
   * @param {string} jobApplicationId - The job application ID
   * @param {string} id - The ID of the evaluation response
   * @returns {Promise<QueryResponse<DbResponseEvaluationDto>>} A promise that resolves to the response evaluation data
   */
  async getResponseEvaluationByJobApplicationIdAndId(jobApplicationId: string, id: string): Promise<QueryResponse<DbResponseEvaluationDto>> {
    global.logger.info("Get Response Evaluation By Job Application Id And Id [Service]", {
      methodName: this.getResponseEvaluationByJobApplicationIdAndId.name,
      jobApplicationId,
      id,
    });
    
    return responseEvaluationDao.getResponseEvaluationByJobApplicationIdAndId(jobApplicationId, id);
  }
}

// Create an instance of the ResponseEvaluationService class and export it
const responseEvaluationServiceObj = new ResponseEvaluationService();
export { responseEvaluationServiceObj, ResponseEvaluationService };