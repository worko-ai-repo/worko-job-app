
// Import opensearch types
import { Search_RequestBody } from "@opensearch-project/opensearch/api/_core/search";
import { QueryContainer } from "@opensearch-project/opensearch/api/_types/_common.query_dsl";
import { SortOptions } from "@opensearch-project/opensearch/api/_types/_common";
import { DeleteByQuery_RequestBody, DeleteByQuery_Response, Index_Response, Update_Response, UpdateByQuery_RequestBody, UpdateByQuery_Response } from "@opensearch-project/opensearch/api";

// import luxon
import { DateTime } from "luxon";

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
import { JobSourcedFromEnum, OpenSearchOperationsEnum } from "../enums/Common.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";
import { awsOpensearchBase64EncodeStrToLastKey } from "../helpers/aws-opensearch.helper";

// Import models
import { DbJobAwsOpensearchDto } from "../db/aws-opensearch-models/AwsOpenSearchJob.model";

// Import utils
import { invokeVpcLambdaOpenSearchUtilObj } from "../utils/invoke-vpc-lambda-opensearch.util";


class AwsOpenSearchJobDao {
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
   * Creates a Job in the OpenSearch index.
   * 
   * @param {string} id - The ID of the job to be created.
   * @param {string} jobUrl - The URL of the job description.
   * @param {JobSourcedFromEnum} sourcedFrom - The source of the job.
   * @param {JobCreateCompanyDetailInternalDto} companyDetailsDto - The company details of the job.
   * @param {JobCreateDto} jobCreateData - The job details to be created.
   * 
   * @returns {Promise<Index_Response>} - A promise that resolves to the result of the create operation.
   * 
   * @throws {BaseError} 500 - If the Job is not created successfully.
   */
  async createJob(
    id: string,
    jobUrl: string,
    sourcedFrom: JobSourcedFromEnum,
    companyDetailsDto: JobCreateCompanyDetailInternalDto,
    jobCreateData: JobCreateDto
  ): Promise<Index_Response> {
    global.logger.debug(`Create Job in aws opensearch [DAO]`, {
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

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<DbJobAwsOpensearchDto, Index_Response>(
      this.IndexName,
      jobCreateRequest,
      OpenSearchOperationsEnum.CREATE_DOCUMENT,
      "create job",
      this.createJob.name,
      { id }
    );
  }

  async getAllJobsByListOfJobIds(
    jobIds: string[],
    jobListingFilterRequest: JobListingFilterOptions,
  ): Promise<
    AwsOpensearchRecordListingResponseDTO<
      DbJobAwsOpensearchDto[]
    >
  > {
    global.logger.info(`Get all jobs by list of job ids [DAO]`, {
      jobIdsLength: jobIds.length,
      methodName: this.getAllJobsByListOfJobIds.name,
    });

    // Construct the AWS OpenSearch query based on the filter options
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        bool: {
          must: [
            {
              terms: {
                "id.keyword": jobIds,
              },
            }, // Uses an array directly
          ],
        },
      },
      size: jobIds.length,
    };

    global.logger.debug(`aws opensearch query for list of job ids`, {
      awsOpensearchQuery,
      methodName: this.getAllJobsByListOfJobIds.name,
    })

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      {
        awsOpensearchQuery: Search_RequestBody;
        filterOptions: JobListingFilterOptions;
      },
      AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>
    >(
      this.IndexName,
      {
        awsOpensearchQuery,
        filterOptions: jobListingFilterRequest,
      },
      OpenSearchOperationsEnum.GET_DOCUMENTS,
      "list jobs by given job ids",
      this.getAllJobsByListOfJobIds.name
    );
  }

  async getAllJobsByListOfS3VectorJobIds(
    jobIds: string[],
    jobListingFilterRequest: JobListingFilterOptions,
  ): Promise<
    AwsOpensearchRecordListingResponseDTO<
      DbJobAwsOpensearchDto[]
    >
  > {
    global.logger.info(`Get all jobs by list of job ids [DAO]`, {
      jobIdsLength: jobIds.length,
      methodName: this.getAllJobsByListOfS3VectorJobIds.name,
    });

    // Construct the AWS OpenSearch query based on the filter options
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        bool: {
          must: [
            {
              terms: {
                "id.keyword": jobIds,
              },
            }, // Uses an array directly
            {
              term: {
                "status.keyword": JobStatusEnum.PUBLISHED,
              }
            }
          ],
        },
      },
      size: jobIds.length,
      sort: [
        {
          createdAt: AwsOpensearchSortOrderTypeEnum.DESCENDING,
          _id: AwsOpensearchSortOrderTypeEnum.DESCENDING,
        },
      ],
    };

    const queryBoolMust = awsOpensearchQuery.query?.bool?.must as QueryContainer[];

    const {dashboard, pageSize: requestedPageSize, searchText} = jobListingFilterRequest;

    if (searchText) {
      const lowerCaseSearchText: string = searchText.toLowerCase();

      queryBoolMust.push({
        bool: {
          should: [
            { term: { "jobTitle.keyword": lowerCaseSearchText } },
            { term: { "department.keyword": lowerCaseSearchText } },
            { term: { "workMode.keyword": searchText.toUpperCase() } },
            { match: { companyName: searchText } },

            // Search in location
            { match: { "location.city": searchText } },
            { match: { "location.state": searchText } },

            // Search in skills
            { terms: { "coreSkills.keyword": [lowerCaseSearchText] }},
            { terms: { "softSkills.keyword": [lowerCaseSearchText] }},
            { terms: { "technicalSkills.keyword": [lowerCaseSearchText] }},
          ],
          minimum_should_match: 1,
        },
      });
    } 

    if(dashboard === JobDashboardEnum.USER) {
      queryBoolMust.push({
        exists: {
          field: "companyId",
        },
      });
    }

    global.logger.debug(`aws opensearch query for s3 vector job ids`, {
      awsOpensearchQuery,
      methodName: this.getAllJobsByListOfS3VectorJobIds.name,
    })

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      {
        awsOpensearchQuery: Search_RequestBody;
        filterOptions: {
          pageSize: number;
        };
      },
      AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>
    >(
      this.IndexName,
      {
        awsOpensearchQuery,
        filterOptions: {
          pageSize: requestedPageSize,
        },
      },
      OpenSearchOperationsEnum.GET_DOCUMENTS,
      "list jobs by given job ids",
      this.getAllJobsByListOfS3VectorJobIds.name
    );
  }

  async getAllJobsByFilterOptionsWithoutPagination(): Promise<AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>> {
    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      {
        awsOpensearchQuery: Search_RequestBody;
      },
      AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>
    >(
      this.IndexName,
      {
        awsOpensearchQuery: { query: { match_all: {} } } as Search_RequestBody,
      },
      OpenSearchOperationsEnum.GET_ALL_DOCUMENTS_WITHOUT_PAGINATION,
      "list jobs by filter options without pagination",
      this.getAllJobsByFilterOptionsWithoutPagination.name
    )
  }

  async getAllJobsToMigrateFromAwsOpensearch(
    filterOptions: {
      pageSize: number;
      lastKey?: string;
    }
  ): Promise<AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>> {
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        match_all: {},
      },
      size: filterOptions.pageSize,
      sort: [
        {
          createdAt: AwsOpensearchSortOrderTypeEnum.DESCENDING,
          _id: AwsOpensearchSortOrderTypeEnum.DESCENDING,
        },
      ],
    };

    if (filterOptions?.lastKey) {
      global.logger.debug(`encoded last key to be used`, { lastKey: filterOptions.lastKey });
      let decodedLastKey: any[] | undefined = awsOpensearchBase64EncodeStrToLastKey(
        filterOptions.lastKey
      ); // decoding base64 string to original value(possibly array of values)
      global.logger.debug(`decoded last key to be used`, { decodedLastKey });
      awsOpensearchQuery.search_after = decodedLastKey;
    }

    global.logger.debug(`aws opensearch query for migrating jobs from aws opensearch`, {
      awsOpensearchQuery,
      methodName: this.getAllJobsToMigrateFromAwsOpensearch.name,
    })

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      {
        awsOpensearchQuery: Search_RequestBody;
        filterOptions: {
          pageSize: number;
        };
      },
      AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>
    >(
      this.IndexName,
      {
        awsOpensearchQuery,
        filterOptions: {
          pageSize: filterOptions.pageSize,
        },
      },
      OpenSearchOperationsEnum.GET_DOCUMENTS,
      "list jobs to migrate from aws opensearch",
      this.getAllJobsToMigrateFromAwsOpensearch.name
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

    /**
     * If dashboard is provided, only retrieve jobs that contain companyId
     * 
     * @NOTE: As of now if any value in "JobDashboardEnum" is given 
     * by frontend we are sending only jobs that contain "companyId",
     * but in near future if we want to implement different boolean queries, then we need to update this method accordingly.
     */
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

      /**
       * @description
       *     1. For `corporate-admin`:
       *        1. Only jobs from their `Company`:
       *           1. Include `corporate-admin` created jobs
       *           2. Include `corporate-recruiter` created jobs
       *     2. For `corporate-recruiter`:
       *        1. Only jobs from their `Company`:
       *           1. Include `corporate-recruiter` created jobs
       */
      if (
        jobFilterOptions.dashboard === JobDashboardEnum.CORPORATE &&
        jobFilterOptions?.userRole
      ) {
        if (
          jobFilterOptions.userRole ===
            CorporateUserTypeEnum.CORPORATE_RECRUITER &&
          jobFilterOptions?.corporateRecruiterUserId
        ) {
          queryBoolMust.push({
            term: {
              "createdByCorporateUserId.keyword": jobFilterOptions.corporateRecruiterUserId,
            },
          });
        } else if (
          jobFilterOptions.userRole === CorporateUserTypeEnum.CORPORATE_ADMIN
        ) {
          queryBoolMust.push({
            exists: {
              field: "createdByCorporateUserId",
            },
          });
        }
      }
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

      const lowerCaseSearchText: string = searchText.toLowerCase();

      queryBoolMust.push({
        bool: {
          should: [
            { term: { "jobTitle.keyword": lowerCaseSearchText } },
            { term: { "department.keyword": lowerCaseSearchText } },
            { term: { "workMode.keyword": searchText.toUpperCase() } },
            { match: { companyName: searchText } },

            // Search in location
            { match: { "location.city": searchText } },
            { match: { "location.state": searchText } },

            // Search in skills
            { terms: { "coreSkills.keyword": [lowerCaseSearchText] }},
            { terms: { "softSkills.keyword": [lowerCaseSearchText] }},
            { terms: { "technicalSkills.keyword": [lowerCaseSearchText] }},
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

    /**
     * `experienceRange.min` should be less than or equal to the candidate's YOE
     * 
     * @example
     * If YOE = 10:
     *    1. experienceRange.min = 4 
     *       Logic: 4 <= 10 = true (job document matched)
     *    2. experienceRange.min = 10 
     *       Logic: 10 <= 10 = true (job document matched)
     *    3. experienceRange.min = 15 
     *       Logic: 15 <= 10 = false (job document not matched)
     */
    if (jobFilterOptions?.YOE || jobFilterOptions?.YOE === 0) {
      queryBoolMust.push({
        range: {
          // "experienceRange.min" <= YOE
          "experienceRange.min": { lte: jobFilterOptions.YOE },
        },
      });
    }

    /**
     * @example
     * If minExperience = 4:
     *    1. experienceRange.min = 7 
     *       Logic: 7 >= 4 = true (job document matched)
     *    2. experienceRange.min = 4 
     *       Logic: 4 >= 4 = true (job document matched)
     *    3. experienceRange.min = 3 
     *       Logic: 3 >= 4 = false (job document not matched)
     */
    if (jobFilterOptions?.minExperience || jobFilterOptions?.minExperience === 0) {
      queryBoolMust.push({
        range: {
          "experienceRange.min": {
            gte: jobFilterOptions.minExperience,
          },
        },
      });
    }

    /**
     * @example
     * If maxExperience = 10:
     *    1. experienceRange.max = 7 
     *       Logic: 7 <= 10 = true (job document matched)
     *    2. experienceRange.max = 10 
     *       Logic: 10 <= 10 = true (job document matched)
     *    3. experienceRange.max = 15 
     *       Logic: 15 <= 10 = false (job document not matched)
     */
    if (jobFilterOptions?.maxExperience || jobFilterOptions?.maxExperience === 0) {
      queryBoolMust.push({
        range: {
          "experienceRange.max": { lte: jobFilterOptions.maxExperience },
        },
      });
    }

    /**
     * @example
     * If minSalary = 50000:
     *    1. salaryRange.min = 70000 
     *       Logic: 70000 >= 50000 = true (job document matched)
     *    2. salaryRange.min = 50000 
     *       Logic: 50000 >= 50000 = true (job document matched)
     *    3. salaryRange.min = 40000 
     *       Logic: 40000 >= 50000 = false (job document not matched)
     */
    if (jobFilterOptions?.minSalary || jobFilterOptions?.minSalary === 0) {
      queryBoolMust.push({
        range: {
          "salaryRange.min": {
            gte: jobFilterOptions.minSalary,
          },
        },
      });
    }

    /**
     * @example
     * If maxSalary = 100000:
     *    1. salaryRange.max = 70000 
     *       Logic: 70000 <= 100000 = true (job document matched)
     *    2. salaryRange.max = 100000 
     *       Logic: 100000 <= 100000 = true (job document matched)
     *    3. salaryRange.max = 150000 
     *       Logic: 150000 <= 100000 = false (job document not matched)
     */
    if (jobFilterOptions?.maxSalary || jobFilterOptions?.maxSalary === 0) {
      queryBoolMust.push({
        range: {
          "salaryRange.max": {
            lte: jobFilterOptions.maxSalary,
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
      // awsOpensearchQuery.search_after = jobFilterOptions.lastKey;
    }

    // log the query object
    global.logger.debug("Aws OpenSearch Query Details", {
      methodName: this.getAllJobsByFilterOptions.name,
      awsOpensearchQuery,
    });

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<{
      awsOpensearchQuery: Search_RequestBody,
      filterOptions: JobListingFilterOptions,
    },AwsOpensearchRecordListingResponseDTO<DbJobAwsOpensearchDto[]>>(
      this.IndexName,
      {
        awsOpensearchQuery,
        filterOptions: jobFilterOptions,
      },
      OpenSearchOperationsEnum.GET_DOCUMENTS,
      "list jobs",
      this.getAllJobsByFilterOptions.name
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

    if (jobUpdateDto?.status) {
      jobUpdateDto.isDeleted = jobUpdateDto.status === JobStatusEnum.CLOSED;
    }

    const updatedDto: JobUpdateDto = this.modifyUpdatedAtFieldWithCurrentDateTime<JobUpdateDto>(jobUpdateDto); // Will add `updatedAt` field to jobUpdateDto object.

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<{
      id: string,
      updatedDto: JobUpdateDto
    },Update_Response>(
      this.IndexName,
      {
        id: jobId,
        updatedDto: updatedDto,
      },
      OpenSearchOperationsEnum.UPDATE_DOCUMENT_BY_ID,
      "update job by id",
      this.updateInternalOrExternalJobById.name
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

    const updatedDto: Partial<JobUpdateInternalDto> = this.modifyUpdatedAtFieldWithCurrentDateTime<Partial<JobUpdateInternalDto>>(updateObject) // Add `updatedAt` field to "updateObject".

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<{
      id: string,
      updatedDto: Partial<JobUpdateInternalDto>
    },Update_Response>(
      this.IndexName,
      {
        id: jobId,
        updatedDto: updatedDto,
      },
      OpenSearchOperationsEnum.UPDATE_DOCUMENT_BY_ID,
      "soft delete job by id",
      this.softDeleteJobById.name
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

    if (updateDto?.status) {
      updateDto.isDeleted = updateDto.status === JobStatusEnum.CLOSED;
    }

    const updatedDto: Partial<JobUpdateInternalDto> =
      this.modifyUpdatedAtFieldWithCurrentDateTime<
        Partial<JobUpdateInternalDto>
      >(updateDto); // Add `updatedAt` field to "updateObject".

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<{
      id: string,
      updatedDto: Partial<JobUpdateInternalDto>
    },Update_Response>(
      this.IndexName,
      {
        id: jobId,
        updatedDto: updatedDto,
      },
      OpenSearchOperationsEnum.UPDATE_DOCUMENT_BY_ID,
      "update job by id",
      this.updateJobById.name
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

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<{
      documentId: string
    },DbJobAwsOpensearchDto | undefined>(
      this.IndexName,
      {
        documentId: id,
      },
      OpenSearchOperationsEnum.GET_DOCUMENT_BY_ID,
      "get job by id",
      this.getJobById.name
    );
  }

  private buildHardDeleteExternalJobBoolQuery(deleteOlderThanDays: number, sourcedFrom: JobSourcedFromEnum): QueryContainer {
    return {
      bool: {
        must: [
          {
            range: {
              createdAt: {
                lt: dateHelperObj.getPastISODate(deleteOlderThanDays),
              },
            },
          },
          {
            exists: {
              field: "externalJobId",
            },
          },
          {
            term: {
              "sourcedFrom.keyword": sourcedFrom,
            },
          },
          {
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
          },
        ],
      },
    };
  }

  async getAllOldUnappliedExternalJobs(
    deleteOlderThanDays: number,
    sourcedFrom: JobSourcedFromEnum
  ): Promise<DbJobAwsOpensearchDto[]> {
    let awsOpensearchQuery: Search_RequestBody = {
      _source: ["id"],
      query: this.buildHardDeleteExternalJobBoolQuery(deleteOlderThanDays, sourcedFrom),
    };

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
    {
      awsOpensearchQuery: Search_RequestBody;
    },
    DbJobAwsOpensearchDto[]
    >(
      this.IndexName,
      {
        awsOpensearchQuery: awsOpensearchQuery,
      },
      OpenSearchOperationsEnum.GET_ALL_DOCUMENTS_WITHOUT_PAGINATION,
      "get old unapplied external job ids for s3 vector activity",
      this.getAllOldUnappliedExternalJobs.name
    );
  }

  async deleteOldUnappliedExternalJobByIds(
    oldUnappliedExternalJobIds: string[],
  ): Promise<
    DeleteByQuery_Response
  > {
    // logger
    global.logger.info(`Delete old unapplied external jobs by query [Dao]`, {
      jobIdsLength: oldUnappliedExternalJobIds.length,
      methodName: this.deleteOldUnappliedExternalJobByIds.name,
    });

    // Prepare delete request body
    const deleteOldUnappliedExternalJobsQueryRequestBody: DeleteByQuery_RequestBody =
      {
        query: {
          bool: {
            must: [
              {
                terms: {
                  "id.keyword": oldUnappliedExternalJobIds,
                },
              }, // Uses an array directly
              {
                exists: {
                  field: "externalJobId",
                },
              },
            ],
          },
        },
      };

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      DeleteByQuery_RequestBody,
      DeleteByQuery_Response
    >(
      this.IndexName,
      deleteOldUnappliedExternalJobsQueryRequestBody,
      OpenSearchOperationsEnum.DELETE_DOCUMENTS_BY_QUERY,
      "delete jobs by query",
      this.deleteOldUnappliedExternalJobByIds.name
    );
  }

  private buildSoftDeleteExternalJobBoolQuery<
    ActionByQuery 
  >(deleteOlderThanDays: number, sourcedFrom: JobSourcedFromEnum): ActionByQuery {
    const mustQueries: QueryContainer[] = [
      {
        range: {
          createdAt: {
            lt: dateHelperObj.getPastISODate(deleteOlderThanDays),
          },
        },
      },
      {
        exists: {
          field: "externalJobId",
        },
      },
      {
        term: {
          "sourcedFrom.keyword": sourcedFrom,
        },
      },
      {
        term: {
          isAppliedBySomeone: true,
        },
      },
    ];

    return {
      bool: {
        must: mustQueries,
      },
    } as ActionByQuery;
  }

  async softDeleteOldAppliedExternalJobs(
    updateObject: Partial<JobUpdateInternalDto>,
    deleteOlderThanDays: number,
    sourcedFrom: JobSourcedFromEnum,
  ): Promise<UpdateByQuery_Response> {
    global.logger.info(`Soft delete old applied external jobs [Dao]`, {
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
        query: this.buildSoftDeleteExternalJobBoolQuery<
            UpdateByQuery_RequestBody["query"]
          >(deleteOlderThanDays, sourcedFrom),

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

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      UpdateByQuery_RequestBody,
      UpdateByQuery_Response
    >(
      this.IndexName,
      softDeleteOldAppliedExternalJobsQueryRequestBody,
      OpenSearchOperationsEnum.UPDATE_DOCUMENTS_BY_QUERY,
      "soft delete jobs by query",
      this.softDeleteOldAppliedExternalJobs.name
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

    return invokeVpcLambdaOpenSearchUtilObj.executeOperation<
      (
        | DbJobAwsOpensearchDto
        | {
            index: {
              _index: string;
              _id: string;
            };
          }
      )[],
      boolean
    >(
      this.IndexName,
      bulkJobData,
      OpenSearchOperationsEnum.BULK_CREATE_DOCUMENT,
      "bulk index jobs",
      this.createBulkJobs.name
    );
  }
}

const awsOpenSearchJobDaoObj = new AwsOpenSearchJobDao();

export { awsOpenSearchJobDaoObj, AwsOpenSearchJobDao };
