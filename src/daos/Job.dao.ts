// Import opensearch types
import { Search_RequestBody } from "@opensearch-project/opensearch/api/_core/search";
import { QueryContainer } from "@opensearch-project/opensearch/api/_types/_common.query_dsl";
import { SortOptions } from "@opensearch-project/opensearch/api/_types/_common";
import { DeleteByQuery_RequestBody, DeleteByQuery_Response, Index_Response, Update_Response, UpdateByQuery_RequestBody, UpdateByQuery_Response } from "@opensearch-project/opensearch/api";
import { TransportRequestPromise } from "@opensearch-project/opensearch/lib/Transport";

// import luxon
import { DateTime } from "luxon";

// Import Aws opensearch client
import { awsOpensearchLibrary } from "../configs/aws-sdk.config";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import {
  JobCreateCompanyDetailInternalDto,
  JobCreateDto,
  JobListingFilterOptions,
  JobUpdateDto,
  JobUpdateInternalDto,
} from "../dtos/Job.dto";
import { AwsOpensearchRecordListingResponseDTO } from "../dtos/Common.aws-opensearch.dto";

// Import enums
import { AwsOpensearchSortOrderTypeEnum } from "../enums/Common.aws-opensearch.enum";
import { JobDashboardEnum } from "../enums/Job.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

/**
 * JobDao
 *
 * Class responsible for managing job related operations in aws opensearch
 */
class JobDao {
  IndexName = "worko-jobs";

  /**
   * modifyUpdatedAtFieldWithCurrentDateTime
   *
   * Modifies the updatedAt field of an object with the current time.
   *
   * @param {EntityUpdateDto} updateObject - The object to be updated.
   * @returns {EntityUpdateDto} - The updated object.
   */
  modifyUpdatedAtFieldWithCurrentDateTime<
    EntityUpdateDto extends { updatedAt?: string }
  >(updateObject: EntityUpdateDto): EntityUpdateDto {
    updateObject.updatedAt = DateTime.now().toISO();
    return updateObject;
  }

  /**
   * createJob
   *
   * Creates a new Job request.
   *
   * @param {string} id - `id` attribute from `CompanyJob.model.ts` from aws dynamodb.
   * @param {JobCreateDto} JobDetailsData - Data for the Job to be created.
   * @returns {Promise<Index_Response>} - Promise resolving to the newly created Job.
   */
  async createJob(
    id: string,
    jobUrl: string,
    sourcedFrom: JobSourcedFromEnum,
    companyDetailsDto: JobCreateCompanyDetailInternalDto,
    jobCreateData: JobCreateDto
  ): Promise<Index_Response> {
    global.logger.debug(`Create Job in aws opensearch [DAO]`, {
      filePath: __filename,
      methodName: this.createJob.name,
      id,
    });

    // Prepare a request payload to create the entry in the database
    const jobCreateRequest: DbJobAwsOpensearchDto = {
      ...jobCreateData,
      ...companyDetailsDto,
      id: id,
      jobUrl,
      sourcedFrom: sourcedFrom,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
      isDeleted: false,
    };

    return awsOpensearchLibrary.createDocument<DbJobAwsOpensearchDto>(
      id,
      this.IndexName,
      jobCreateRequest
    );
  }

  /**
   * getAllJobsByFilterOptions
   *
   * Bool query
   * @see https://opensearch.org/docs/latest/query-dsl/compound/bool/
   *
   * Match query
   * @see https://opensearch.org/docs/latest/query-dsl/full-text/match/
   *
   * Terms query
   * @see https://opensearch.org/docs/latest/query-dsl/term/terms/
   *
   * Range query
   * @see https://opensearch.org/docs/latest/query-dsl/term/range/
   *
   * Date filter
   *  Date fields
   *  @see https://opensearch.org/docs/latest/query-dsl/term/range/#date-fields
   *
   *  Time zone
   *  @see https://opensearch.org/docs/latest/query-dsl/term/range/#time-zone
   *
   * Multi-match queries
   * @see https://opensearch.org/docs/latest/query-dsl/full-text/multi-match/
   *
   * The `search_after` parameter
   * @see https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#the-search_after-parameter
   *
   * Sort results
   * @see https://opensearch.org/docs/latest/search-plugins/searching-data/sort/
   *
   * Exists query
   * @see https://opensearch.org/docs/latest/query-dsl/term/exists/
   * Fetches all the Jobs for the company with the given filter options.
   *
   * @param {JobListingFilterOptions} jobFilterOptions - The filter options to apply on the Jobs.
   * @returns {Promise<AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>>} - Returns the list of all Jobs.
   */
  async getAllJobsByFilterOptions(
    jobFilterOptions: JobListingFilterOptions
  ): Promise<AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>> {
    // logger
    global.logger.debug(`Get All Jobs by filter options [DAO]`, {
      methodName: this.getAllJobsByFilterOptions.name,
      jobFilterOptions,
    });

    // Construct the AWS OpenSearch query based on the filter options
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        bool: {
          must: [],
        },
      },
      size: jobFilterOptions.pageSize,

      /**
       * @description AWS OpenSearch will sort results by multiple fields
       * in the given order top to bottom (first field is highest priority, second is used when first has ties, etc.).
       *
       * @see https://docs.opensearch.org/docs/latest/search-plugins/searching-data/sort/
       */
      sort: [],
    };

    const queryBoolMust = awsOpensearchQuery.query?.bool?.must as QueryContainer[];
    const querySort = awsOpensearchQuery.sort as SortOptions[];

    // If dashboard is provided, only retrieve jobs that contain companyId
    if (
      jobFilterOptions?.dashboard &&
      [...Object.values(JobDashboardEnum)].includes(jobFilterOptions.dashboard)
    ) {
      queryBoolMust.push({
        exists: {
          field: "companyId",
        },
      });

      querySort.push(
        {
          createdAt: {
            order:
              jobFilterOptions.sortOrder ??
              AwsOpensearchSortOrderTypeEnum.DESCENDING,
          },
        },
        {
          _id: {
            order:
              jobFilterOptions.sortOrder ??
              AwsOpensearchSortOrderTypeEnum.DESCENDING,
          },
        }
      );
    } else {
      /**
       * @description
       * Sort jobs with the following priority:
       *
       * 1. Internal jobs (jobs that contain `companyId`) appear first.
       * 2. Within internal jobs, sort by `createdAt` in descending order (most recent first).
       * 3. After internal jobs, list external jobs (jobs without `companyId`, e.g., those with `externalJobId`).
       * 4. Within external jobs, also sort by `createdAt` in descending order.
       *
       * This is implemented using:
       * - A `_script` sort to give priority (score 1) to jobs with `companyId`.
       * - Then `createdAt` sort in descending order to list recent jobs first within each group.
       * - Finally `_id` sort to break any remaining ties.
       *
       * @see https://docs.opensearch.org/docs/latest/api-reference/script-apis/exec-script/
       */
      querySort.push(
        {
          _script: {
            /**
             * @type { 'number' | 'string' | 'version' }
             */
            type: "number",
            script: {
              /**
               * If the companyId.keyword field exists on a document and is not empty, return 1; otherwise, return 0
               */
              source:
                "doc.containsKey('companyId.keyword') && !doc['companyId.keyword'].empty ? 1 : 0",

              /**
               * @type { 'expression' | 'java' | 'mustache' | 'painless' }
               */
              lang: "painless",
            },
            order: jobFilterOptions.sortOrder ??
            AwsOpensearchSortOrderTypeEnum.DESCENDING,
          },
        },
        {
          createdAt: {
            order:
              jobFilterOptions.sortOrder ??
              AwsOpensearchSortOrderTypeEnum.DESCENDING,
          },
        },
        {
          _id: {
            order:
              jobFilterOptions.sortOrder ??
              AwsOpensearchSortOrderTypeEnum.DESCENDING,
          },
        }
      );
    }
  
    if (jobFilterOptions?.searchText) {
      const searchText: string = jobFilterOptions.searchText;

      queryBoolMust.push({
        bool: {
          should: [
            { term: { "jobTitle.keyword": searchText.toLowerCase() } },
            { term: { "department.keyword": searchText.toLowerCase() } },

            { term: { "workMode.keyword": searchText.toUpperCase() } },

            { match: { companyName: searchText } },
            { match: { "location.city": searchText } },
            { match: { "location.state": searchText } },

            { match_phrase: { jobDescription: searchText } },
          ],
          minimum_should_match: 1,
        },
      });
    }    

    // If `companyId` is given then this indicates that we are looking for internal jobs for a specific company
    if (jobFilterOptions?.companyId) {
      queryBoolMust.push({
        term: {
          "companyId.keyword": jobFilterOptions.companyId,
        },
      });
    }

    // Add companyName filter if provided
    if (jobFilterOptions?.companyName) {
      queryBoolMust.push({
        match: {
          companyName: jobFilterOptions.companyName,
        }
      });
    }

    // Add typeofEmployment filter if provided
    if (jobFilterOptions?.typeofEmployment) {
      queryBoolMust.push({
        match: { typeofEmployment: jobFilterOptions.typeofEmployment },
      });
    }

    // Add location filter if provided
    if (jobFilterOptions?.location) {
      queryBoolMust.push({
        multi_match: {
          query: jobFilterOptions.location,
          fields: ["location.city", "location.state"],
        },
      });
    }

    // Add `YOE` filter if provided
    if (jobFilterOptions?.YOE) {
      queryBoolMust.push(
        {
          range: {
            "experienceRange.min": { lte: jobFilterOptions.YOE },
          },
        },
        {
          range: {
            "experienceRange.max": { gte: jobFilterOptions.YOE },
          },
        }
      );
    }

    // Add min experience range filter if provided
    if (jobFilterOptions?.minExperience) {
      queryBoolMust.push({
        range: {
          "experienceRange.min": {
            lte: jobFilterOptions.minExperience,
          },
        },
      });
    }

    // Add max experience range filter if provided
    if (jobFilterOptions?.maxExperience) {
      queryBoolMust.push({
        range: {
          "experienceRange.max": { gte: jobFilterOptions.maxExperience },
        },
      });
    }

    // Add min salary range filter if provided
    if (jobFilterOptions?.minSalary) {
      queryBoolMust.push({
        range: {
          "salaryRange.min": {
            lte: jobFilterOptions.minSalary,
          },
        },
      });
    }

    // Add max salary range if provided
    if (jobFilterOptions?.maxSalary) {
      queryBoolMust.push({
        range: {
          "salaryRange.max": {
            gte: jobFilterOptions.maxSalary,
          },
        },
      });
    }

    // Add department filter if provided
    if (jobFilterOptions?.department) {
      queryBoolMust.push({
        terms: {
          "department.keyword": jobFilterOptions.department.toLowerCaseArray(),
        }
      });
    }

    // Add core skills filter if provided
    if (jobFilterOptions?.coreSkills) {
      queryBoolMust.push({
        terms: {
          "coreSkills.keyword": jobFilterOptions.coreSkills.toLowerCaseArray(),
        },
      });
    }

    // Add soft skills filter if provided
    if (jobFilterOptions?.softSkills) {
      queryBoolMust.push({
        terms: {
          "softSkills.keyword": jobFilterOptions.softSkills.toLowerCaseArray(),
        },
      });
    }

    // Add technical skills filter if provided
    if (jobFilterOptions?.technicalSkills) {
      queryBoolMust.push({
        terms: {
          "technicalSkills.keyword": jobFilterOptions.technicalSkills.toLowerCaseArray(),
        },
      });
    }

    // Add work mode filter if provided
    if (jobFilterOptions?.workMode) {
      queryBoolMust.push({
        term: { "workMode.keyword": jobFilterOptions.workMode.toUpperCase() },
      });
    }

    // Add status filter if provided
    if (jobFilterOptions?.status) {
      queryBoolMust.push({
        term: { "status.keyword": jobFilterOptions.status.toUpperCase() },
      });
    }

    /**
     * We are filtering using the `jobTitle` input across both the `jobTitle` and `jobDescription` fields.
     *
     * This is because some job titles may be phrased differently, but relevant keywords might appear in the job description.
     */
    if (jobFilterOptions?.jobTitle) {
      const jobTitle: string = jobFilterOptions.jobTitle;

      queryBoolMust.push({
        bool: {
          should: [
            { term: { "jobTitle.keyword": jobTitle.toLowerCase() } },
            { match_phrase: { jobDescription: jobTitle } },
          ],
          minimum_should_match: 1,
        },
      });
    }

    // Add fromDate filter if provided
    if (jobFilterOptions?.fromDate) {
      queryBoolMust.push({
        range: {
          createdAt: {
            /**
             * By default, dates are assumed to be in Coordinated Universal Time (UTC).
             * If you specify a time_zone parameter in the query, the provided date values are converted to UTC.
             * You can specify the time_zone parameter as a UTC offset
             */
            gte: jobFilterOptions.fromDate,
          },
        },
      });
    }

    // Add toDate filter if provided
    if (jobFilterOptions?.toDate) {
      queryBoolMust.push({
        range: {
          createdAt: {
            /**
             * By default, dates are assumed to be in Coordinated Universal Time (UTC).
             * If you specify a time_zone parameter in the query, the provided date values are converted to UTC.
             * You can specify the time_zone parameter as a UTC offset
             */
            lte: jobFilterOptions.toDate,
          },
        },
      });
    }

    /**
     * The `search_after` parameter
     * @see https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#the-search_after-parameter
     */
    if (jobFilterOptions?.lastKey) {
      awsOpensearchQuery.search_after = jobFilterOptions.lastKey;
    }

    // log the query object
    global.logger.debug("Aws OpenSearch Query Details", {
      filePath: __filename,
      methodName: this.getAllJobsByFilterOptions.name,
      awsOpensearchQuery,
    });

    return awsOpensearchLibrary.getDocuments<
      DbJobAwsOpensearchDto,
      JobListingFilterOptions
    >(
      this.IndexName,
      awsOpensearchQuery,
      jobFilterOptions
    );
  }

  /**
   * updateInternalOrExternalJobById
   * 
   * Updates a job by its ID using the provided update data.
   *
   * This method logs the update operation and sends an update request to the OpenSearch client to modify the job document with the given ID.
   *
   * @param {string} jobId - The ID of the job to update.
   * @param {JobUpdateDto} jobUpdateDto - The update data for the job.
   *
   * @returns {Promise<Update_Response>} - A promise that resolves when the update operation is complete.
   */
  async updateInternalOrExternalJobById(
    jobId: string,
    jobUpdateDto: JobUpdateDto
  ): Promise<Update_Response> {
    // Logger
    global.logger.info(`Update job by id [DAO].`, {
      methodName: this.updateInternalOrExternalJobById.name,
      id: jobId,
    });

    return awsOpensearchLibrary.updateDocumentById<JobUpdateDto>(
      jobId,
      this.IndexName,
      this.modifyUpdatedAtFieldWithCurrentDateTime<JobUpdateDto>(jobUpdateDto) // Will add `updatedAt` field to jobUpdateDto object.
    );
  }

  /**
   * softDeleteJobById
   * 
   * Soft deletes a job by its ID in the OpenSearch index.
   *
   * @param {string} jobId - The ID of the job to be soft deleted.
   * @param {Partial<JobUpdateInternalDto>} updateObject - The update data
   * containing fields to mark the job as deleted.
   *
   * @returns {Promise<Update_Response>} - A promise that resolves to the
   * result of the update operation.
   */
  async softDeleteJobById(jobId: string, updateObject: Partial<JobUpdateInternalDto>): Promise<Update_Response> {
    // Logger
    global.logger.info(`Soft Delete job by id [DAO].`, {
      methodName: this.softDeleteJobById.name,
      id: jobId,
    });

    return awsOpensearchLibrary.updateDocumentById<Partial<JobUpdateInternalDto>>(
      jobId, 
      this.IndexName, 
      this.modifyUpdatedAtFieldWithCurrentDateTime<Partial<JobUpdateInternalDto>>(updateObject) // Add `updatedAt` field to "updateObject".
    );
  }

  /**
   * updateJobById
   *
   * Updates a job in the AWS OpenSearch index by its ID.
   *
   * This method logs the update operation and sends an update request to the OpenSearch client
   * to modify the job document with the given ID using the provided update data.
   * An `updatedAt` field is added to the update data before sending the request.
   *
   * @param {string} jobId - The ID of the job to update.
   * @param {Partial<JobUpdateInternalDto>} updateDto - The partial update data for the job.
   *
   * @returns {Promise<Update_Response>} - A promise that resolves to the result of the update operation.
   */
  async updateJobById(jobId: string, updateDto: Partial<JobUpdateInternalDto>): Promise<Update_Response> {
    // logger
    global.logger.info(`Update Job By Id From aws opensearch [Service]`, {
      methodName: this.updateJobById.name,
    });

    return awsOpensearchLibrary.updateDocumentById<Partial<JobUpdateInternalDto>>(
      jobId,
      this.IndexName,
      this.modifyUpdatedAtFieldWithCurrentDateTime<Partial<JobUpdateInternalDto>>(updateDto) // Add `updatedAt` field to "updateDto".
    );
  }

  /**
   * getJobById
   *
   * Retrieves a job by its ID.
   *
   * This method fetches a job document from the AWS OpenSearch index
   * with the given job ID. It logs the operation and returns a promise that
   * resolves to the job details, or an empty object if the job does not exist.
   *
   * @param id - The ID of the job to retrieve.
   * @returns {Promise<DbJobAwsOpensearchDto | undefined>} - The job details from the OpenSearch client.
   */
  async getJobById(id: string): Promise<DbJobAwsOpensearchDto | undefined> {
    // Logger
    global.logger.info(`Get Job By Id From aws opensearch [Dao]`, {
      methodName: this.getJobById.name,
    });

    return awsOpensearchLibrary.getDocumentById<DbJobAwsOpensearchDto>(
      id,
      this.IndexName
    );
  }

  /**
   * buildSoftDeleteOrHardDeleteExternalJobBoolQuery
   *
   * NOTE: As of now this method is used in `deleteOldUnappliedExternalJobs` and `softDeleteOldAppliedExternalJobs`
   * methods, because both methods are having some kind of similar boolean queries, but in near future if we want to implement
   * different boolean queries, then we need to update `deleteOldUnappliedExternalJobs`, `softDeleteOldAppliedExternalJobs`,
   * `buildSoftDeleteOrHardDeleteExternalJobBoolQuery` methods accordingly.
   *
   * This method builds a query to identify external jobs in the OpenSearch index
   * that meet the following criteria:
   * - The `createdAt` field is older than a specified number of days.
   * - The `externalJobId` field exists.
   * - The `isAppliedBySomeone` field is either true or false, based on the parameter and we will write a "must" query accordingly.
   *
   * The query can be used for either delete by query or update by query operations.
   *
   * @param {boolean} isAppliedBySomeone - Indicates if the job has been applied by someone.
   * @returns {ActionByQuery} - The constructed boolean query for deletion or update.
   */
  private buildSoftDeleteOrHardDeleteExternalJobBoolQuery<
    ActionByQuery extends DeleteByQuery_RequestBody["query"] | UpdateByQuery_RequestBody["query"]
  >(isAppliedBySomeone: boolean): ActionByQuery {
    const mustQueries: QueryContainer[] = [
      {
        range: {
          createdAt: {
            lt: dateHelperObj.getPastISODate(
              APP_CONSTANTS.FANTASTIC_JOB_CLEANUP_CONFIG.DELETE_OLDER_THAN_DAYS
            ),
          },
        },
      },
      {
        exists: {
          field: "externalJobId",
        },
      },
    ];

    if (isAppliedBySomeone) {
      // Only true
      mustQueries.push({
        term: {
          isAppliedBySomeone: true,
        },
      });
    } else {
      // false or undefined => should: false, must_not exists
      mustQueries.push({
        bool: {
          should: [
            {
              term: {
                isAppliedBySomeone: false,
              },
            },
            {
              bool: {
                must_not: {
                  exists: {
                    field: "isAppliedBySomeone",
                  },
                },
              },
            },
          ],
        },
      });
    }

    return {
      bool: {
        must: mustQueries,
      },
    } as ActionByQuery;
  }

  /**
   * deleteOldUnappliedExternalJobs
   *
   * Deletes unapplied external jobs that are older than a specified number of days from the OpenSearch index.
   *
   * This method constructs a delete by query request to remove documents that meet the following criteria:
   * - The `createdAt` field is older than the specified number of days.
   * - The `externalJobId` field exists.
   * - The `isAppliedBySomeone` field is set to false.
   *
   * The method logs the deletion operation and returns a promise that resolves to the result of the delete by query operation.
   *
   * @returns {Promise<TransportRequestPromise<DeleteByQuery_Response>>} - A promise resolving to the result of the delete by query operation.
   */
  async deleteOldUnappliedExternalJobs(): Promise<
    TransportRequestPromise<DeleteByQuery_Response>
  > {
    // logger
    global.logger.info(`Delete old unapplied external jobs by query [Dao]`, {
      fileName: __filename,
      methodName: this.deleteOldUnappliedExternalJobs.name,
    });

    // Prepare delete request body
    const deleteOldUnappliedExternalJobsQueryRequestBody: DeleteByQuery_RequestBody =
      {
        /**
         * @todo: Observe the flow of deleting documents and decide whether to use `max_docs` or not.
         */
        // max_docs: 1000,

        query: this.buildSoftDeleteOrHardDeleteExternalJobBoolQuery<
            DeleteByQuery_RequestBody["query"]
          >(false),
      };

    return awsOpensearchLibrary.deleteDocumentsByQuery(
      this.IndexName,
      deleteOldUnappliedExternalJobsQueryRequestBody
    );
  }

  /**
   * softDeleteOldAppliedExternalJobs
   * 
   * Soft deletes old applied external jobs that are older than a specified number of days.
   *
   * This method logs the soft deletion process and calls the JobDao's softDeleteOldAppliedExternalJobs method
   * to perform the update by query operation in OpenSearch.
   *
   * @param {Partial<JobUpdateInternalDto>} updateObject - The data transfer object containing the updated details of the job.
   * @returns {Promise<TransportRequestPromise<UpdateByQuery_Response>>} - A promise resolving to the result of the update by query operation.
   */
  async softDeleteOldAppliedExternalJobs(
    updateObject: Partial<JobUpdateInternalDto>
  ): Promise<TransportRequestPromise<UpdateByQuery_Response>> {
    global.logger.info(`Soft delete old applied external jobs [Dao]`, {
      fileName: __filename,
      methodName: this.softDeleteOldAppliedExternalJobs.name,
    });

    /**
     * Prepare soft delete old applied external jobs request body
     *
     * Request body options
     * @see https://docs.opensearch.org/docs/latest/api-reference/document-apis/update-by-query/#request-body-options
     */
    const softDeleteOldAppliedExternalJobsQueryRequestBody: UpdateByQuery_RequestBody =
      {
        /**
         * @todo: Observe the flow of deleting documents and decide whether to use `max_docs` or not.
         */
        // max_docs: 1000,

        query: this.buildSoftDeleteOrHardDeleteExternalJobBoolQuery<
            UpdateByQuery_RequestBody["query"]
          >(true),

        /**
         * Painless script
         * @see https://docs.opensearch.org/docs/latest/api-reference/script-apis/exec-script/#example-request
         */
        script: {
          params:
            this.modifyUpdatedAtFieldWithCurrentDateTime<
              Partial<JobUpdateInternalDto>
            >(updateObject),
          lang: "painless",
          source: `
            ctx._source.isDeleted = params.isDeleted;
            ctx._source.updatedAt = params.updatedAt;
            ctx._source.status = params.status;
          `,
        },
      };

    return awsOpensearchLibrary.updateDocumentsByQuery(
      this.IndexName,
      softDeleteOldAppliedExternalJobsQueryRequestBody
    );
  }

  /**
   * createBulkJobs
   * 
   * Bulk indexes jobs to the OpenSearch index.
   *
   * This asynchronous method logs the bulk indexing operation and sends a bulk
   * request to the OpenSearch client. It allows for adding, updating, or deleting
   * multiple job documents in a single request. Each job document in the `bulkJobData`
   * array can either be a new job entry or an index action with metadata specifying
   * the job's index and ID.
   *
   * The bulk request performs index actions that create a document if it doesn’t exist
   * and replaces it if it already exists. If any operation in the bulk request fails,
   * the method logs the errors and returns `false`. Otherwise, it returns `true`
   * indicating successful indexing.
   *
   *
   * The bulk operation lets you add, update, or delete multiple documents in a single request.
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/
   *
   * Index:-
   * Index actions create a document if it doesn’t yet exist and replace the document if it already exists. The next line must include a JSON document:
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#index
   *
   * Create:-
   * Creates a document if it doesn’t already exist and returns an error otherwise. The next line must include a JSON document:
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#create
   *
   * @param {(DbJobAwsOpensearchDto | {index: {_index: string; _id: string;}})[]} bulkJobData - An array
   * of job data and index actions to be processed in the bulk request.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations
   * in the bulk request succeed, or `false` if any operation fails.
   */
  async createBulkJobs(
    bulkJobData: (
      | DbJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ): Promise<boolean> {
    global.logger.info(`Bulk put jobs [DAO]`, {
      fileName: __filename,
      methodName: this.createBulkJobs.name,
    });

    // Returns `true` if all operations in the bulk request succeed and `false` if any operation fails
    return awsOpensearchLibrary.bulkCreateDocument(bulkJobData);
  }
}

const jobDaoObj = new JobDao();

export { jobDaoObj, JobDao };
