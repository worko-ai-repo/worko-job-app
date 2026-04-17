// import dynamoose types 
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";
import { ObjectType } from "dynamoose/dist/General";
import { Condition } from "dynamoose/dist/Condition";

// import daos
import BaseDao from "./Base.dao";

// import dtos
import { RequestEvaluationCommonUpdateDto, RequestEvaluationCreateDto, RequestEvaluationListingFilterOptions } from "../dtos/RequestEvaluation.dto";
import { PaginatedResultsWithMatchingConditionsResponse } from "../dtos/Common.dto";

// Import enums
import { SortOrderTypeEnum } from "../enums/Common.enum";
import { ResponseEvaluationStatusEnum } from "../enums/ResponseEvaluation.enum";
import { RequestEvaluationDashboardTypeEnum } from "../enums/RequestEvaluation.enum";

// import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";

// import models
import { DbRequestEvaluationDto, RequestEvaluationModel } from "../db/models/RequestEvaluation.model";

// import services
import UlidService from "../services/Ulid.service";

/**
 * RequestEvaluationDao
 * 
 * Dao for handling request evaluation-related operations
 */
class RequestEvaluationDao implements BaseDao {
  modelName = "RequestEvaluation";
  partitianKey = "EVAL#{evaluatorEmail}";
  sortKeys = { SK_ID: "REQ#JOB#APP#{jobApplicationId}#ID#{id}" };
  GSI1PK = "EVAL#REQ#";
  GSI1SK = "JOB#APP#{jobApplicationId}#ID#{id}";

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} evaluatorEmail - The primary email of the user.
   * @param {string} jobApplicationId - The job application ID.
   * @param {string} id - The ID of the request evaluation.
   *
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(
    evaluatorEmail: string,
    jobApplicationId: string,
    id: string
  ): {
    PK: string;
    SK: string;
  } {
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
   * prepareGSI1PKAndGSI1SKForQuery
   *
   * Prepares the partition key and sort key for a GSI1 query.
   *
   * @param {string} jobApplicationId - The job application ID.
   * @param {string} id - The ID of the request evaluation.
   *
   * @returns {{GSI1PK: string, GSI1SK: string}} - An object containing the partition key and sort key.
   */
  prepareGSI1PKAndGSI1SKForQuery(
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
   * createRequestEvaluation
   *
   * Creates a new request evaluation
   *
   * @param {RequestEvaluationCreateDto} requestEvaluationData - The request evaluation data
   * @returns {Promise<DbRequestEvaluationDto>} A promise that resolves to the created request evaluation
   */
  async createRequestEvaluation(
    requestEvaluationData: RequestEvaluationCreateDto
  ): Promise<DbRequestEvaluationDto> {
    global.logger.info(`Create Request Evaluation [DAO]`, {
      methodName: this.createRequestEvaluation.name,
    });

    // Generate a unique ID
    const ulidId: string = UlidService.getUlidId();

    // Prepare PK and SK
    const { PK, SK } = this.preparePKAndSKForQuery(
      requestEvaluationData.evaluatorDetails.email,
      requestEvaluationData.jobApplicationId,
      ulidId
    );

    // Prepare GSI1PK and GSI1SK
    const { GSI1PK, GSI1SK } = this.prepareGSI1PKAndGSI1SKForQuery(
      requestEvaluationData.jobApplicationId,
      ulidId
    );

    // Prepare the data required to create a new request evaluation
    const newRequestEvaluation = {
      ...requestEvaluationData,
      id: ulidId,
      PK: PK,
      SK: SK,
      GSI1PK: GSI1PK,
      GSI1SK: GSI1SK,
    };

    // Create the request evaluation in the database
    return RequestEvaluationModel.create(newRequestEvaluation);
  }

  /**
   * createBulkRequestEvaluationByBatchPut
   *
   * Creates multiple request evaluations in bulk using DynamoDB's batchPut
   *
   * @param {RequestEvaluationCreateDto[]} requestEvaluationDataArray - The array of request evaluation data
   * @returns {Promise<ObjectType[]>} A promise that resolves to the unprocessed request evaluation items
   */
  async createBulkRequestEvaluationByBatchPut(
    requestEvaluationDataArray: RequestEvaluationCreateDto[]
  ): Promise<ObjectType[]> {
    global.logger.info(`Create Bulk Request Evaluation [DAO]`, {
      methodName: this.createBulkRequestEvaluationByBatchPut.name,
      itemsCount: requestEvaluationDataArray.length,
    });

    // Prepare all items with their keys and IDs
    const itemsToCreate = requestEvaluationDataArray.map(
      (requestEvaluationData: RequestEvaluationCreateDto) => {
        const ulidId: string = UlidService.getUlidId();
        const { PK, SK } = this.preparePKAndSKForQuery(
          requestEvaluationData.evaluatorDetails.email,
          requestEvaluationData.jobApplicationId,
          ulidId
        );
        const { GSI1PK, GSI1SK } = this.prepareGSI1PKAndGSI1SKForQuery(
          requestEvaluationData.jobApplicationId,
          ulidId
        );

        const newRequestEvaluation = {
          ...requestEvaluationData,
          id: ulidId,
          PK: PK,
          SK: SK,
          GSI1PK: GSI1PK,
          GSI1SK: GSI1SK,
        };

        return newRequestEvaluation;
      }
    );

    let totalUnprocessedRequestEvaluations: ObjectType[] = [];

    // Process in batches of 15 items (using batchPut with max 25 items per batch, but keeping it at 15 for safety)
    const batchSize = 15;
    for (let i = 0; i < itemsToCreate.length; i += batchSize) {
      const batch = itemsToCreate.slice(i, i + batchSize);
      const unprocessedRequestEvaluations: {
        unprocessedItems: ObjectType[];
      } = await RequestEvaluationModel.batchPut(batch);

      totalUnprocessedRequestEvaluations.push(
        ...unprocessedRequestEvaluations.unprocessedItems
      );
    }

    return totalUnprocessedRequestEvaluations;
  }

  /**
   * getRequestEvaluationByEvaluatorEmailAndJobApplicationId
   *
   * Retrieves a request evaluation using the evaluator's email and job application ID.
   *
   * @param {string} evaluatorEmail - The email of the evaluator.
   * @param {string} jobApplicationId - The ID of the job application.
   * @returns {Promise<QueryResponse<DbRequestEvaluationDto>>} A promise that resolves to the request evaluation data.
   */
  async getRequestEvaluationByEvaluatorEmailAndJobApplicationId(
    evaluatorEmail: string,
    jobApplicationId: string
  ): Promise<QueryResponse<DbRequestEvaluationDto>> {
    global.logger.info(
      `Get Request Evaluation By using Evaluator email and Job application id [DAO]`,
      {
        methodName:
          this.getRequestEvaluationByEvaluatorEmailAndJobApplicationId.name,
        evaluatorEmail,
        jobApplicationId,
      }
    );

    const { PK, SK } = this.preparePKAndSKForQuery(
      evaluatorEmail,
      jobApplicationId,
      ""
    );

    return RequestEvaluationModel.query("PK")
      .eq(PK)
      .where("SK")
      .beginsWith(SK)
      .exec();
  }

  async getRequestEvaluationsByFilterOptions(
    filterOptions: RequestEvaluationListingFilterOptions,
  ): Promise<
    PaginatedResultsWithMatchingConditionsResponse<DbRequestEvaluationDto>
  > {
    global.logger.info("Get Request Evaluations By Filter Options [DAO]", {
      methodName: this.getRequestEvaluationsByFilterOptions.name,
      filterOptions,
    });

    const { evaluatorEmail, jobApplicationId, companyId } = filterOptions;

    let query: Query<DbRequestEvaluationDto>;

    if (evaluatorEmail && jobApplicationId) {
      const { PK, SK } = this.preparePKAndSKForQuery(
        evaluatorEmail,
        jobApplicationId,
        ""
      );

      // Retrieves a specific job application requested to the evaluator
      query = RequestEvaluationModel.query("PK")
        .eq(PK)
        .where("SK")
        .beginsWith(SK);
    } else if (evaluatorEmail) {
      // Retrieves all the job applications requested to the evaluator
      query = RequestEvaluationModel.query("PK")
        .eq(this.partitianKey.strtr({ "{evaluatorEmail}": evaluatorEmail }))
        .where("SK")
        .beginsWith("REQ#JOB#APP#");
    } else if (jobApplicationId) {
      const { GSI1PK, GSI1SK } = this.prepareGSI1PKAndGSI1SKForQuery(
        jobApplicationId,
        ""
      );

      // Retrieves all the requested evaluators for a specific job application
      query = RequestEvaluationModel.query("GSI1PK")
        .eq(GSI1PK)
        .where("GSI1SK")
        .beginsWith(GSI1SK);
    } else {
      // Retrieves all the requested evaluations for all job applications
      query = RequestEvaluationModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .beginsWith("JOB#APP#");
    }

    // Sort the results based on the provided sort order
    query = query.sort(filterOptions.sortOrder as SortOrderTypeEnum)

    if(filterOptions.evaluationRequesterAdminUserId) {
      query = query.where("createdByUserId").eq(filterOptions.evaluationRequesterAdminUserId)
    }

    if(filterOptions.evaluationRequesterCorporateUserId) {
      query = query.where("createdByCorporateUserId").eq(filterOptions.evaluationRequesterCorporateUserId)
    }

    if (filterOptions.dashboardType === RequestEvaluationDashboardTypeEnum.EVALUATOR) {
      query = query.and().parenthesis((condition: Condition) => {
        return condition
          .where("evaluationResponseStatus")
          .eq(ResponseEvaluationStatusEnum.INTERVIEW_SCHEDULED)
          .or()
          .where("evaluationResponseStatus")
          .not()
          .exists()
      });
    }

    if (companyId) {
      query = query.where("companyId").eq(companyId);
    }
    // Execute the query with pagination
    return getPaginatedResultsWithMatchingConditions<
      DbRequestEvaluationDto,
      RequestEvaluationListingFilterOptions
    >(query, filterOptions);
  }

  /**
   * getRequestEvaluationByJobApplIdAndEvaluationReqId
   *
   * Retrieves a request evaluation by job application ID and evaluation request ID
   *
   * @param {string} jobApplicationId - The job application ID
   * @param {string} evaluationReqId - The ID of the evaluation request
   * @returns {Promise<QueryResponse<DbRequestEvaluationDto>>} A promise that resolves to the request evaluation data
   */
  async getRequestEvaluationByJobApplIdAndEvaluationReqId(
    jobApplicationId: string,
    evaluationReqId: string
  ): Promise<QueryResponse<DbRequestEvaluationDto>> {
    global.logger.info(
      `Get Request Evaluation By Job Application Id and Evaluation Request Id [DAO]`,
      {
        methodName: this.getRequestEvaluationByJobApplIdAndEvaluationReqId.name,
        jobApplicationId,
        evaluationReqId,
      }
    );

    const { GSI1PK, GSI1SK } = this.prepareGSI1PKAndGSI1SKForQuery(
      jobApplicationId,
      evaluationReqId
    );

    return RequestEvaluationModel.query("GSI1PK")
      .eq(GSI1PK)
      .where("GSI1SK")
      .beginsWith(GSI1SK)
      .exec();
  }

  /**
   * updateRequestEvaluation
   * 
   * Updates a request evaluation using the evaluator's email, job application ID, 
   * and request evaluation ID.
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
    global.logger.info("Update Request Evaluation [DAO]", {
      evaluatorEmail,
      jobApplicationId,
      id,
      updateData,
      methodName: this.updateRequestEvaluation.name,
    });

    const { PK, SK } = this.preparePKAndSKForQuery(
      evaluatorEmail,
      jobApplicationId,
      id
    );

    return RequestEvaluationModel.update(
      {
        PK,
        SK,
      },
      updateData
    );
  }
}

// Create an instance of RequestEvaluationDao and export
const requestEvaluationDao = new RequestEvaluationDao();
export { requestEvaluationDao, RequestEvaluationDao };