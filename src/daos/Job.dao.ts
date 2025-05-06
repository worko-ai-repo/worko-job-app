// Import opensearch types
import { Search_RequestBody } from "@opensearch-project/opensearch/api/_core/search";
import { QueryContainer } from "@opensearch-project/opensearch/api/_types/_common.query_dsl";
import { SortOptions } from "@opensearch-project/opensearch/api/_types/_common";
import { Index_Response, Update_Response } from "@opensearch-project/opensearch/api";

// import luxon
import { DateTime } from "luxon";

// Import Aws opensearch client
import { awsOpensearchLibrary } from "../configs/aws-sdk.config";

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
import { JobDashboardEnum, JobStatusEnum } from "../enums/Job.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";

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
    global.logger.debug(`Get All Jobs [DAO]`, {
      jobFilterOptions,
      filePath: __filename,
      methodName: this.getAllJobsByFilterOptions.name,
      searchText: jobFilterOptions.searchText,
    });

    // Construct the AWS OpenSearch query based on the filter options
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        bool: {
          must: [],

          must_not: [
            {
              match: { isDeleted: true }, // Exclude deleted jobs
            },
          ],

          should: [],
          minimum_should_match: 0, // This ensures that the `should` clause is not mandatory
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

    const queryBoolMust = awsOpensearchQuery.query?.bool
      ?.must as QueryContainer[];
    const queryBoolShould = awsOpensearchQuery.query?.bool
      ?.should as QueryContainer[];
    const querySort = awsOpensearchQuery.sort as SortOptions[];

    // If dashboard is provided, only retrieve jobs that contain companyId
    if (
      jobFilterOptions?.dashboard &&
      [JobDashboardEnum.ADMIN, JobDashboardEnum.CORPORATE, JobDashboardEnum.USER].includes(jobFilterOptions.dashboard)
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
       * @todo: 
       *  1. Need to Investigate best way to sort job listings in OpenSearch in such a way that the latest jobs appear first, 
       *        with priority given to jobs that contain a companyId.
       */
      querySort.push(
        {
          "companyId.keyword": {
            order: AwsOpensearchSortOrderTypeEnum.DESCENDING,
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
        },
        {
          "externalJobId.keyword": {
            order: AwsOpensearchSortOrderTypeEnum.DESCENDING,
          },
        }
      );      
    }

    // Add search text filter if provided
    if (jobFilterOptions?.searchText) {
      queryBoolMust.push({
        multi_match: {
          query: jobFilterOptions.searchText,
          fields: [
            "jobTitle",
            "jobDescription",
            "department",
            "workMode",
            "location.city",
            "location.state",
            "companyName",
          ],
        },
      });
    }

    // If `companyId` is given then this indicates that we are looking for internal jobs for a specific company
    if (jobFilterOptions?.companyId) {
      queryBoolMust.push({
        match: { companyId: jobFilterOptions.companyId },
      });
    }

    // Add companyName filter if provided
    if (jobFilterOptions?.companyName) {
      queryBoolMust.push({
        match: { companyName: jobFilterOptions.companyName },
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
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "experienceRange" } }, // Ensure experienceRange exists
                  {
                    range: {
                      /**
                       * @description Is experienceRange.min less than or equal to YOE
                       * @example If experienceRange.min = 4 and YOE = 6, then 
                       *   experienceRange.min <= YOE i.e. 4 <= 6 i.e. true
                       */
                      "experienceRange.min": { lte: jobFilterOptions.YOE },
                    },
                  },
                  {
                    range: {
                      /**
                       * @description Is experienceRange.max greater than or equal to YOE
                       * @example If experienceRange.max = 8 and YOE = 6, then
                       *   experienceRange.max >= YOE i.e. 8 >= 6 i.e. true
                       */
                      "experienceRange.max": { gte: jobFilterOptions.YOE },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [
                  { exists: { field: "experienceRange" } }, // Include jobs without experienceRange
                ],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add min experience range filter if provided
    if (jobFilterOptions?.minExperience) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "experienceRange" } },
                  {
                    range: {
                      "experienceRange.min": {
                        lte: jobFilterOptions.minExperience,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "experienceRange" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add max experience range filter if provided
    if (jobFilterOptions?.maxExperience) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "experienceRange" } },
                  {
                    range: {
                      "experienceRange.max": {
                        gte: jobFilterOptions.maxExperience,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "experienceRange" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add min salary range filter if provided
    if (jobFilterOptions?.minSalary) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "salaryRange" } },
                  {
                    range: {
                      "salaryRange.min": {
                        lte: jobFilterOptions.minSalary,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "salaryRange" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add max salary range if provided
    if (jobFilterOptions?.maxSalary) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "salaryRange" } },
                  {
                    range: {
                      "salaryRange.max": {
                        gte: jobFilterOptions.maxSalary,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "salaryRange" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add department filter if provided
    if (jobFilterOptions?.department) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "department" } },
                  {
                    match: { department: jobFilterOptions.department },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "department" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add core skills filter if provided
    if (jobFilterOptions?.coreSkills) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "coreSkills" } },
                  {
                    match: { coreSkills: jobFilterOptions.coreSkills },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "coreSkills" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add soft skills filter if provided
    if (jobFilterOptions?.softSkills) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "softSkills" } },
                  {
                    match: { softSkills: jobFilterOptions.softSkills },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "softSkills" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add technical skills filter if provided
    if (jobFilterOptions?.technicalSkills) {
      queryBoolMust.push({
        bool: {
          should: [
            {
              bool: {
                must: [
                  { exists: { field: "technicalSkills" } },
                  {
                    match: { technicalSkills: jobFilterOptions.technicalSkills },
                  },
                ],
              },
            },
            {
              bool: {
                must_not: [{ exists: { field: "technicalSkills" } }],
              },
            },
          ],
          minimum_should_match: 1, // At least one should be true
        },
      });
    }

    // Add work mode filter if provided
    if (jobFilterOptions?.workMode) {
      queryBoolMust.push({
        match: { workMode: jobFilterOptions.workMode },
      });
    }

    // Add status filter if provided
    if (jobFilterOptions?.status) {
      queryBoolMust.push({
        match: { status: jobFilterOptions.status },
      });
    }

    /**
     * We are filtering using the `jobTitle` input across both the `jobTitle` and `jobDescription` fields.
     *
     * This is because some job titles may be phrased differently, but relevant keywords might appear in the job description.
     *
     * Example:
     * If a job document has a `jobTitle` as "MERN Stack Developer" and its `jobDescription` contains the phrase "Web Developer",
     * then searching for "Web Developer" in the `jobTitle` filter will still return this job, as it's contextually relevant.
     */
    if (jobFilterOptions?.jobTitle) {
      queryBoolShould.push({
        multi_match: {
          query: jobFilterOptions.jobTitle,
          fields: ["jobTitle", "jobDescription"],
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
   * Updates a job in the AWS OpenSearch index using its ID.
   *
   * This method is used to update both internal and external jobs.
   *
   * @param {string} jobId - The ID of the job to update.
   * @param {JobUpdateDto} jobUpdateDto - The data transfer object containing the updated details of the job.
   *
   * @returns {Promise<Update_Response> } - A promise that resolves when the update operation is complete.
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
      jobUpdateDto
    );
  }

  /**
   * Soft deletes a job by updating the `isDeleted` field to true based on the given job ID.
   *
   * This method logs the soft delete operation and sends an update request to the OpenSearch client to modify the job document with the given ID.
   *
   * @param {string} jobId - The ID of the job to soft delete.
   * @returns {Promise<Update_Response>} - A promise that resolves when the update operation is complete.
   */
  async softDeleteJobById(jobId: string): Promise<Update_Response> {
    // Logger
    global.logger.info(`Soft Delete job by id [DAO].`, {
      methodName: this.softDeleteJobById.name,
      id: jobId,
    });

    // Prepare update object
    const updateObject = {
      isDeleted: true,
      status: JobStatusEnum.CLOSED,
    };

    return awsOpensearchLibrary.updateDocumentById<{
      isDeleted: boolean;
      status: JobStatusEnum;
    }>(jobId, this.IndexName, updateObject);
  }

  /**
   * Updates a job by its ID using the provided update data.
   *
   * This method logs the update operation and sends an update request to the OpenSearch client to modify the job document with the given ID.
   *
   * @param {string} jobId - The ID of the job to update.
   * @param {JobUpdateInternalDto} updateDto - The update data for the job.
   *
   * @returns {Promise<Update_Response>} - A promise that resolves when the update operation is complete.
   */
  updateJobById(jobId: string, updateDto: JobUpdateInternalDto) {
    // logger
    global.logger.info(`Update Job By Id From aws opensearch [Service]`, {
      methodName: this.updateJobById.name,
    });

    return awsOpensearchLibrary.updateDocumentById<JobUpdateInternalDto>(
      jobId,
      this.IndexName,
      updateDto
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
   * Bulk deletes jobs from the OpenSearch index with the given IDs.
   *
   * This method logs the bulk delete operation and sends a bulk delete request to the OpenSearch client.
   * The bulk delete request includes a list of `delete` action objects, each containing the ID of a job to delete.
   * The OpenSearch client will respond with an error if any of the job IDs do not exist in the index.
   *
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#delete
   *
   * @param {string[]} ids - The IDs of the jobs to delete.
   *
   * @returns {Promise<boolean>}
   */
  /* async bulkDeleteJobs(ids: string[]): Promise<boolean> {
    global.logger.info(`bulk delete jobs`, {
      fileName: __filename,
      methodName: this.bulkDeleteJobs.name,
    });

    return awsOpensearchLibrary.bulkDeleteDocument(ids, this.IndexName);
  } */

  /**
   * Bulk soft deletes jobs from the OpenSearch index with the given IDs.
   *
   * This method logs the bulk soft delete operation and sends a bulk update request to the OpenSearch client.
   * The bulk update request includes a list of `update` action objects, each containing the ID of a job to soft delete.
   * The OpenSearch client will set the `isDeleted` field of the job to `true` if the job exists in the index.
   * The OpenSearch client will respond with an error if any of the job IDs do not exist in the index.
   *
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#update
   *
   * @param {string[]} ids - The IDs of the jobs to soft delete.
   *
   * @returns
   */
  /* async bulkSoftDeleteJobs(ids: string[]) {
    global.logger.info(`bulk soft delete jobs`, {
      fileName: __filename,
      methodName: this.bulkSoftDeleteJobs.name,
    });

    const bulkJobUpdateData = ids.flatMap((eachId: string) => [
      { update: { _index: this.IndexName, _id: eachId } },
      { doc: { isDeleted: true } },
    ]);

    return awsOpensearchLibrary.opensearchClient.bulk({
      body: bulkJobUpdateData,
    });
  } */

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

    return awsOpensearchLibrary.bulkCreateDocument(bulkJobData);
  }
}

const jobDaoObj = new JobDao();

export { jobDaoObj, JobDao };
