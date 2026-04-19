
// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import daos
import { requestEvaluationDao } from "../daos/RequestEvaluation.dao";

// import dtos
import {
  RequestEvaluationCommonUpdateDto,
  RequestEvaluationCreateApiDTO,
  RequestEvaluationBulkCreateApiDTO,
  RequestEvaluationCreateDto,
  RequestEvaluationListingFilterOptions,
} from "../dtos/RequestEvaluation.dto";
import { PaginatedResultsWithMatchingConditionsInternalResponse, PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";
import { EmailTemplatePlaceholderEVALUATOR_REQUEST_EVALUATION } from "../dtos/EmailTemplatePlaceholder.dto";

// Import enums
import { EmailTemplateEnum } from "../enums/EmailTemplate.enum";

// import helpers
import { getActionByUserId } from "../helpers/user.helper";

// Import libraries
import { emailLibrary, EmailSourceDestinationAddress } from "../libraries/email.library";

// import models
import { DbRequestEvaluationDto } from "../db/models/RequestEvaluation.model";

// import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * RequestEvaluationService
 * 
 * Service for handling request evaluation-related operations
 */
class RequestEvaluationService {
  /**
   * createRequestEvaluation
   *
   * Creates a new request evaluation
   *
   * @param {RequestEvaluationCreateApiDTO} requestBody - The request evaluation data
   * @returns {Promise<DbRequestEvaluationDto>} A promise that resolves to the created request evaluation
   */
  async createRequestEvaluation(
    requestBody: RequestEvaluationCreateApiDTO
  ): Promise<DbRequestEvaluationDto> {
    global.logger.info("Create Request Evaluation [Service]", {
      methodName: this.createRequestEvaluation.name,
    });

    const existingRequestEvaluation: QueryResponse<DbRequestEvaluationDto> =
      await requestEvaluationDao.getRequestEvaluationByEvaluatorEmailAndJobApplicationId(
        requestBody.evaluatorDetails.email,
        requestBody.jobApplicationId
      );
    if (existingRequestEvaluation.count) {
      throw new BaseError(
        `Already sent this job application to the same evaluator with the email address ${requestBody.evaluatorDetails.email}.`,
        HttpStatusCode.CONFLICT_409
      );
    }

    // Get actionByUserId and actionByCorporateUserId using the helper function
    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    // Prepare the data required to create a new request evaluation
    const requestEvaluationDto: RequestEvaluationCreateDto = {
      ...requestBody,
      createdByUserId: actionByUserId,
      createdByCorporateUserId: actionByCorporateUserId,
    };

    // Create the request evaluation using the DAO
    const requestEvaluationDetails: DbRequestEvaluationDto =
      await requestEvaluationDao.createRequestEvaluation(requestEvaluationDto);

    const {evaluatorDetails, jobTitle, hrName, hrCurrentCompanyName} = requestEvaluationDetails;
    const {email, name} = evaluatorDetails;
  
    const isEmailSent: boolean = await this.sendEmailToEvaluatorForReviewingJobApplications(
      name,
      email,
      jobTitle,
      hrName,
      hrCurrentCompanyName,
      requestEvaluationDetails.jobApplicationId,
      requestEvaluationDetails.id,
    );
    global.logger.info("Send Email To Evaluator For Reviewing Job Applications [Service]", {
      methodName: this.sendEmailToEvaluatorForReviewingJobApplications.name,
      isEmailSent,
    })

    return requestEvaluationDetails;
  }

  /**
   * createBulkRequestEvaluation
   * 
   * Creates multiple request evaluations in bulk, with the ability to send an email to the evaluator
   * for reviewing job applications.
   * 
   * @param {RequestEvaluationBulkCreateApiDTO} requestBody - The request evaluation data
   * @returns {Promise<{ uprocessedItems: ObjectType[], existingItems: DbRequestEvaluationDto[] }>} A promise that resolves to an object with the unprocessed request evaluation items and the existing request evaluation items.
   */
  async createBulkRequestEvaluation(
    requestBody: RequestEvaluationBulkCreateApiDTO
  ): Promise<{ uprocessedItems: ObjectType[], existingItems: DbRequestEvaluationDto[] }> {
    global.logger.info("Create Bulk Request Evaluation [Service]", {
      methodName: this.createBulkRequestEvaluation.name,
      itemsCount: requestBody.requestEvaluations.length,
    });

    // Get actionByUserId and actionByCorporateUserId using the helper function
    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    // Filter out existing request evaluations
    const newRequestEvaluations: RequestEvaluationCreateApiDTO[] = [];
    const existingRequestEvaluations: DbRequestEvaluationDto[] = [];

    let listOfEvaluatorEmails: string[] = [];

    let listOfJobIds: string[] = [];
    
    for (const item of requestBody.requestEvaluations) {
      const existingRequestEvaluation: QueryResponse<DbRequestEvaluationDto> = await requestEvaluationDao.getRequestEvaluationByEvaluatorEmailAndJobApplicationId(
        item.evaluatorDetails.email,
        item.jobApplicationId
      );
      
      if (!existingRequestEvaluation.count) {
        newRequestEvaluations.push(item);
      } else if (existingRequestEvaluation.count) {
        existingRequestEvaluations.push(existingRequestEvaluation[0]);
      }

      listOfEvaluatorEmails.push(item.evaluatorDetails.email);
      listOfJobIds.push(item.jobId);
    }

    const uniqueJobIds: Set<string> = new Set(listOfJobIds);

    if (uniqueJobIds.size > 1) {
      throw new BaseError(
        "List of applications must be from a single job.",
        HttpStatusCode.CONFLICT_409
      );
    }

    const uniqueEvaluatorEmails: Set<string> = new Set(listOfEvaluatorEmails);

    if(uniqueEvaluatorEmails.size > 1) {
      throw new BaseError(
        "Only one evaluator can be assigned to list of applications for a single job.",
        HttpStatusCode.CONFLICT_409
      );
    }

    let requestEvaluationDetails: ObjectType[] = [];
    
    if (newRequestEvaluations.length > 0) {
      // Prepare the data required to create bulk request evaluations
      const requestEvaluationDtos: RequestEvaluationCreateDto[] =
        newRequestEvaluations.map((item: RequestEvaluationCreateApiDTO) => ({
          ...item,
          createdByUserId: actionByUserId,
          createdByCorporateUserId: actionByCorporateUserId,
        }));

      // Create the request evaluations using the DAO
      requestEvaluationDetails = await requestEvaluationDao.createBulkRequestEvaluationByBatchPut(
        requestEvaluationDtos
      );
    }
    
    // We are assuming that all the request evaluations are sent to the same evaluator.
    const { evaluatorDetails, jobTitle, hrName, hrCurrentCompanyName, jobApplicationId: reqBodyJobApplicationId } = requestBody.requestEvaluations[0];
    const { email, name } = evaluatorDetails;

    const existingRequestEvaluationDetails: QueryResponse<DbRequestEvaluationDto> = await requestEvaluationDao.getRequestEvaluationByEvaluatorEmailAndJobApplicationId(
      email,
      reqBodyJobApplicationId
    );

    const {id: evaluationRequestId, jobApplicationId: retrievedJobApplicationId} = existingRequestEvaluationDetails[0];

    const isEmailSent: boolean = await this.sendEmailToEvaluatorForReviewingJobApplications(
      name,
      email,
      jobTitle,
      hrName,
      hrCurrentCompanyName,
      retrievedJobApplicationId,
      evaluationRequestId,
    );
    global.logger.info("Send Email To Evaluator For Reviewing Job Applications [Service]", {
      methodName: this.sendEmailToEvaluatorForReviewingJobApplications.name,
      isEmailSent,
    })

    return {
      uprocessedItems: requestEvaluationDetails,
      existingItems: existingRequestEvaluations,
    };
  }

  /**
   * sendEmailToEvaluatorForReviewingJobApplications
   *
   * Sends an email to the evaluator.
   *
   * @param {string} evaluatorName - The full name of the evaluator
   * @param {string} evaluatorEmail - The email of the evaluator
   * @param {string} jobTitle - The job title for which the request evaluation is created
   * @param {string} hrName - The name of the HR
   * @param {string} hrCurrentCompanyName - The current company name of the HR
   * @param {string} jobApplicationId - The ID of the job application
   * @param {string} evaluationRequestId - The ID of the evaluation request
   * @returns {Promise<boolean>} A promise that resolves to true if the email is sent, false otherwise
   */
  private async sendEmailToEvaluatorForReviewingJobApplications(
    evaluatorName: string,
    evaluatorEmail: string,
    jobTitle: string,
    hrName: string,
    hrCurrentCompanyName: string,
    jobApplicationId: string,
    evaluationRequestId: string,
  ): Promise<boolean> {
    const toEvaluatorAddress: EmailSourceDestinationAddress = {
      email: evaluatorEmail,
      fullName: evaluatorName,
    };

    const emailToEvaluatorPlaceholders: EmailTemplatePlaceholderEVALUATOR_REQUEST_EVALUATION =
      {
        evaluatorName: evaluatorName.toTitleCase(),
        jobTitle: jobTitle.toTitleCase(),
        hrName: hrName.toTitleCase(),
        hrCurrentCompanyName: hrCurrentCompanyName.toTitleCase(),
        evaluatorDashboardUrl:
          APP_CONSTANTS.WORKO_EVALUATOR_DASHBOARD_URL.strtr({
            "{jobApplicationId}": jobApplicationId,
            "{evaluationRequestId}": evaluationRequestId,
          }),
        ...APP_CONSTANTS.GET_WORKO_SOCIAL_PROFILES_TO_SEND_EMAIL,
      };

    const emailToEvaluatorSendResponse: {
      awsMessageId: string | null;
      systemLogId: string | null;
    } = await emailLibrary.sendEmail(
      EmailTemplateEnum.EVALUATOR_REQUEST_EVALUATION,
      toEvaluatorAddress,
      emailToEvaluatorPlaceholders
    );

    if (!emailToEvaluatorSendResponse.awsMessageId) {
      global.logger.error("Failed to send email to Evaluator", {
        evaluatorEmail: evaluatorEmail,
      });

      return false;
    }

    return true;
  }

  /**
   * getRequestEvaluationsByFilterOptions
   *
   * Retrieves request evaluations based on filter options
   *
   * @param {RequestEvaluationListingFilterOptions} filterOptions - The filter options
   * @returns {Promise<PaginatedResultsWithMatchingConditionsInternalResponse<DbRequestEvaluationDto[]>>} A promise that resolves to paginated request evaluation data
   */
  async getRequestEvaluationsByFilterOptions(
    filterOptions: RequestEvaluationListingFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsInternalResponse<
      DbRequestEvaluationDto[]
    >
  > {
    global.logger.info("Get Request Evaluations By Filter Options [Service]", {
      filePath: __filename,
      methodName: this.getRequestEvaluationsByFilterOptions.name,
    });

    // Fetch request evaluations using filter options
    const requestEvaluationDetails: PaginatedResultsWithMatchingConditionsResponse<DbRequestEvaluationDto> =
      await requestEvaluationDao.getRequestEvaluationsByFilterOptions(
        filterOptions
      );

    // Extract data from the response
    const {
      lastKey,
      count,
      timesQueried,
      queriedCount,
      ...requestEvaluationData
    } = requestEvaluationDetails;

    // Convert to array
    const requestEvaluationArray: DbRequestEvaluationDto[] = Object.values(
      requestEvaluationData
    );

    const paginatedRequestEvaluations: PaginatedResultsWithMatchingConditionsInternalResponse<
      DbRequestEvaluationDto[]
    > = {
      data: requestEvaluationArray,
      lastKey,
      count,
      timesQueried,
      queriedCount,
    };

    return paginatedRequestEvaluations;
  }

  async getRequestEvaluationsByFilterOptionsForCompany(
    filterOptions: RequestEvaluationListingFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsInternalResponse<
      DbRequestEvaluationDto[]
    >
  > {
    global.logger.info("Get Request Evaluations By Filter Options [Service]", {
      filePath: __filename,
      methodName: this.getRequestEvaluationsByFilterOptionsForCompany.name,
    });

    // Fetch request evaluations using filter options
    const requestEvaluationDetails: PaginatedResultsWithMatchingConditionsResponse<DbRequestEvaluationDto> =
      await requestEvaluationDao.getRequestEvaluationsByFilterOptionsForCompany(
        filterOptions
      );

    // Extract data from the response
    const {
      lastKey,
      count,
      timesQueried,
      queriedCount,
      ...requestEvaluationData
    } = requestEvaluationDetails;

    // Convert to array
    const requestEvaluationArray: DbRequestEvaluationDto[] = Object.values(
      requestEvaluationData
    );

    const paginatedRequestEvaluations: PaginatedResultsWithMatchingConditionsInternalResponse<
      DbRequestEvaluationDto[]
    > = {
      data: requestEvaluationArray,
      lastKey,
      count,
      timesQueried,
      queriedCount,
    };

    return paginatedRequestEvaluations;
  }
  /**
   * getRequestEvaluationByJobApplIdAndEvaluationReqId
   *
   * Retrieves a request evaluation by job application ID and evaluation request ID
   *
   * @param {string} jobApplicationId - The job application ID
   * @param {string} evaluationRequestId - The ID of the evaluation request
   * @returns {Promise<QueryResponse<DbRequestEvaluationDto>>} A promise that resolves to the request evaluation data
   */
  async getRequestEvaluationByJobApplIdAndEvaluationReqId(
    jobApplicationId: string,
    evaluationRequestId: string
  ): Promise<QueryResponse<DbRequestEvaluationDto>> {
    global.logger.info(
      "Get Request Evaluation By Job Appl Id And Evaluation Req Id [Service]",
      {
        jobApplicationId,
        evaluationRequestId,
        methodName: this.getRequestEvaluationByJobApplIdAndEvaluationReqId.name,
      }
    );

    return requestEvaluationDao.getRequestEvaluationByJobApplIdAndEvaluationReqId(
      jobApplicationId,
      evaluationRequestId
    );
  }

  /**
   * updateRequestEvaluation
   *
   * Updates the request evaluation details using evaluator's email, job application ID, and evaluation ID.
   *
   * @param {string} evaluatorEmail - The email of the evaluator.
   * @param {string} jobApplicationId - The ID of the job application.
   * @param {string} id - The ID of the request evaluation.
   * @param {Partial<RequestEvaluationCommonUpdateDto>} updateData - The data to update in the request evaluation.
   * @returns {Promise<DbRequestEvaluationDto>} A promise that resolves to the updated request evaluation data.
   */
  async updateRequestEvaluation(
    evaluatorEmail: string,
    jobApplicationId: string,
    id: string, // `id` attribute of `RequestEvaluation.model.ts`
    updateData: Partial<RequestEvaluationCommonUpdateDto>
  ): Promise<DbRequestEvaluationDto> {
    global.logger.info("Update Request Evaluation [Service]", {
      evaluatorEmail,
      jobApplicationId,
      id,
      updateData,
      methodName: this.updateRequestEvaluation.name,
    });

    return requestEvaluationDao.updateRequestEvaluation(
      evaluatorEmail,
      jobApplicationId,
      id,
      updateData
    );
  }
}

// Create an instance of the RequestEvaluationService class and export it
const requestEvaluationServiceObj = new RequestEvaluationService();
export { requestEvaluationServiceObj, RequestEvaluationService };