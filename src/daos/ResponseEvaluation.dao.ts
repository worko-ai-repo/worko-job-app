// import dynamoose types 
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";

// import daos
import BaseDao from "./Base.dao";

// import dtos
import { ResponseEvaluationCreateDTO, ResponseEvaluationListingFilterOptions } from "../dtos/ResponseEvaluation.dto";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// Import enums
import { SortOrderTypeEnum } from "../enums/Common.enum";

// import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

// import models
import { DbResponseEvaluationDto, ResponseEvaluationModel } from "../db/models/ResponseEvaluation.model";

// import services
import UlidService from "../services/Ulid.service";

/**
 * ResponseEvaluationDao
 * 
 * Dao for handling response evaluation-related operations
 */
class ResponseEvaluationDao implements BaseDao {
  modelName = "ResponseEvaluation";
  partitianKey = "EVAL#{evaluatorEmail}"; // `applicant user email`
  sortKeys = { SK_ID: "RESP#JOB#APP#{jobApplicationId}#ID#{id}" };
  GSI1PK = "EVAL#RESP#";
  GSI1SK = "JOB#APP#{jobApplicationId}#ID#{id}";

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} evaluatorEmail - The email of the evaluator.
   * @param {string} jobApplicationId - The ID of the job application.
   * @param {string} id - The ID of the response evaluation.
   *
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(
    evaluatorEmail: string,
    jobApplicationId: string,
    id: string
  ): { PK: string; SK: string } {
    return {
      PK: this.partitianKey.strtr({
        "{evaluatorEmail}": evaluatorEmail,
      }),
      SK: this.sortKeys.SK_ID.strtr({
        "{jobApplicationId}": jobApplicationId,
        "{id}": id,
      }),
    };
  }

  /**
   * prepareGsi1PKAndGsi1SKForQuery
   *
   * Prepares the partition key and sort key for a GSI1 query.
   *
   * @param {string} jobApplicationId - The ID of the job application.
   * @param {string} id - The ID of the response evaluation.
   *
   * @returns {{GSI1PK: string, GSI1SK: string}} - An object containing the partition key and sort key.
   */
  prepareGsi1PKAndGsi1SKForQuery(
    jobApplicationId: string,
    id: string
  ): { GSI1PK: string; GSI1SK: string } {
    return {
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{jobApplicationId}": jobApplicationId,
        "{id}": id,
      }),
    };
  }

  /**
   * createResponseEvaluation
   *
   * Creates a new response evaluation and saves it to the database.
   * Generates a unique ULID for the evaluation and prepares the necessary
   * partition and sort keys for both the main table and GSI1.
   *
   * @param {ResponseEvaluationCreateDTO} responseEvaluationData - The data required to create the response evaluation.
   * @returns {Promise<DbResponseEvaluationDto>} A promise that resolves to the created response evaluation.
   */
  async createResponseEvaluation(
    responseEvaluationData: ResponseEvaluationCreateDTO
  ): Promise<DbResponseEvaluationDto> {
    global.logger.info(`Create Response Evaluation [DAO]`, {
      methodName: this.createResponseEvaluation.name,
    });

    const ulidId: string = UlidService.getUlidId();
    const evaluatorEmail: string = responseEvaluationData.createdByUserEmail;

    const { PK, SK } = this.preparePKAndSKForQuery(
      evaluatorEmail,
      responseEvaluationData.jobApplicationId,
      ulidId
    );

    const { GSI1PK, GSI1SK } = this.prepareGsi1PKAndGsi1SKForQuery(
      responseEvaluationData.jobApplicationId,
      ulidId
    );

    // Prepare the data required to create a new response evaluation
    const newResponseEvaluation = {
      ...responseEvaluationData,
      PK,
      SK,
      GSI1PK,
      GSI1SK,
      id: ulidId,
    };

    // Create the response evaluation in the database
    return ResponseEvaluationModel.create(newResponseEvaluation);
  }

  /**
   * getResponseEvaluationByEvaluatorEmailAndJobApplicationId
   *
   * Retrieves a response evaluation using the evaluator's email and job application ID.
   *
   * @param {string} evaluatorEmail - The email of the evaluator.
   * @param {string} jobApplicationId - The ID of the job application.
   * @returns {Promise<QueryResponse<DbResponseEvaluationDto>>} A promise that resolves to the response evaluation data.
   */
  async getResponseEvaluationByEvaluatorEmailAndJobApplicationId(
    evaluatorEmail: string,
    jobApplicationId: string
  ): Promise<QueryResponse<DbResponseEvaluationDto>> {
    global.logger.info(
      `Get Response Evaluation By Evaluator Email And Job Application Id [DAO]`,
      {
        methodName:
          this.getResponseEvaluationByEvaluatorEmailAndJobApplicationId.name,
        evaluatorEmail,
        jobApplicationId,
      }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(
      evaluatorEmail,
      jobApplicationId,
      ""
    );

    return ResponseEvaluationModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(SK)
      .exec();
  }

  /**
   * getResponseEvaluationsByFilterOptions
   *
   * Retrieves response evaluations based on filter options
   *
   * @param {ResponseEvaluationListingFilterOptions} filterOptions - The filter options
   * @returns {Promise<PaginatedResultsWithMatchingConditionsResponse<DbResponseEvaluationDto>>} A promise that resolves to paginated response evaluation data
   */
  async getResponseEvaluationsByFilterOptions(
    filterOptions: ResponseEvaluationListingFilterOptions
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbResponseEvaluationDto>
  > {
    global.logger.info("Get Response Evaluations By Filter Options [DAO]", {
      filePath: __filename,
      methodName: this.getResponseEvaluationsByFilterOptions.name,
    });

    let query: Query<DbResponseEvaluationDto>;

    const {evaluatorEmail, jobApplicationId, status, evaluatorRequesterUserId, evaluatorRequesterCorporateUserId} = filterOptions;

    if(evaluatorEmail && jobApplicationId) {
      // Retrieves submitted feedback of a specific job application by specific evaluator
      const { PK, SK } = this.preparePKAndSKForQuery(
        evaluatorEmail,
        jobApplicationId,
        ""
      )
      query = ResponseEvaluationModel.query("PK")
        .eq(PK)
        .where("SK")
        .beginsWith(SK);
    } else if(evaluatorEmail) {
      // Retrieves submitted feedback of all job applications by specific evaluator
      query = ResponseEvaluationModel.query("PK")
        .eq(this.partitianKey.strtr({
          "{evaluatorEmail}": evaluatorEmail
        }))
        .where("SK")
        .beginsWith("RESP#JOB#APP#");
    } else if(jobApplicationId) {
      // Retrieves all evaluators responses for a specific job application
      const { GSI1PK, GSI1SK } = this.prepareGsi1PKAndGsi1SKForQuery(jobApplicationId, "");
      query = ResponseEvaluationModel.query("GSI1PK")
        .eq(GSI1PK)
        .where("GSI1SK")
        .beginsWith(GSI1SK);
    } else {
      // Retrieves all responses for all job applications
      query = ResponseEvaluationModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .beginsWith("JOB#APP#");
    }

    // Sort the results based on the provided sort order
    query = query.sort(
      filterOptions.sortOrder as SortOrderTypeEnum
    );

    // Execute the query with pagination
    return getPaginatedResultsWithMatchingConditions<
      DbResponseEvaluationDto,
      ResponseEvaluationListingFilterOptions
    >(query, filterOptions);
  }

  /**
   * getResponseEvaluationByJobApplicationIdAndId
   *
   * Retrieves a response evaluation by job application ID and response evaluation ID
   *
   * @param {string} jobApplicationId - The ID of the job application
   * @param {string} id - The ID of the response evaluation
   * @returns {Promise<QueryResponse<DbResponseEvaluationDto>>} A promise that resolves to the response evaluation data
   */
  async getResponseEvaluationByJobApplicationIdAndId(jobApplicationId: string, id: string): Promise<QueryResponse<DbResponseEvaluationDto>> {
    global.logger.info("Get Response Evaluation By Job Application Id And Id [DAO]", {
      methodName: this.getResponseEvaluationByJobApplicationIdAndId.name,
      jobApplicationId,
      id,
    });

    const { GSI1PK, GSI1SK } = this.prepareGsi1PKAndGsi1SKForQuery(
      jobApplicationId,
      id
    );

    return ResponseEvaluationModel.query("GSI1PK")
      .eq(GSI1PK)
      .where("GSI1SK")
      .beginsWith(GSI1SK)
      .exec();
  }
}

// Create an instance of ResponseEvaluationDao and export
const responseEvaluationDao = new ResponseEvaluationDao();
export { responseEvaluationDao, ResponseEvaluationDao };