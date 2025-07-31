
// Import lambdas
import { APIGatewayProxyResult } from "aws-lambda";

// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import opensearch types
import { DeleteByQuery_Response, Index_Response, Update_Response, UpdateByQuery_Response } from "@opensearch-project/opensearch/api";

// Import luxon
import { DateTime } from "luxon";

// Import daos
import { jobDaoObj } from "../daos/Job.dao";

// Import dtos
import { JobBulkUpdateApiDto, JobBulkUpdateResponseDto, JobCreateCompanyDetailInternalDto, JobCreateDto, JobListingFilterOptions, JobUpdateDto, JobUpdateInternalDto, ParsedJobDescriptionApiDto, ParsedJobDescriptionResponseDto } from "../dtos/Job.dto";
import { AwsOpensearchRecordListingResponseDTO } from "../dtos/Common.aws-opensearch.dto";
import { CompanyJobCommonUpdateDto, CompanyJobCreateDto, CompanyJobUpdateDto } from "../dtos/CompanyJob.dto";
import { FantasticJobApiResponse } from "../dtos/FantasticJob.dto";
import { EntityBulkUpdateMetricDto, MinMaxRange } from "../dtos/Common.dto";
import { BrightDataJobApiResponse } from "../dtos/BrightDataJob.dto";

// Import enums
import { JobStatusEnum, JobWorkModeEnum } from "../enums/Job.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";

// Import helpers
import { attachCompanyDetails } from "../helpers/companyDetailsInjector.helper";
import { htmlToTextHelperObj } from "../helpers/htmlToText.helper";
import { getActionByUserId } from "../helpers/user.helper";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

// Import services
import { companyJobServiceObj } from "./CompanyJob.service";
import InvokeLambdaService from "./InvokeLambda.service";
import companyServiceObj  from "./Company.service";

// Import types
import { FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails } from "../types/Job.type";

// Import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError } from "../utils/errors.util";

/**
 * JobService
 * 
 * Class responsible for managing job related operations
 */
class JobService {
  /**
   * getIndexName
   *
   * Retrieves the index name used for job data storage.
   *
   * @returns {string} - The name of the index.
   */
  getIndexName(): string {
    return jobDaoObj.IndexName;
  }

  /**
   * createJob
   * 
   * Creates a Job for a Company.
   * 
   * @param {JobCreateDto} jobCreateDto - The details of the Job to be created.
   * @returns {Promise<DbCompanyJobDto>} - Promise resolving to the newly created Job.
   * 
   * @throws {BaseError} 404 - If the CompanyId is not found.
   * @throws {BaseError} 500 - If the Job is not created successfully.
   */
  async createJob(jobCreateDto: JobCreateDto): Promise<DbCompanyJobDto> {
    // logger
    global.logger.info("Create Job [Service]", {
      filePath: __filename,
      methodName: this.createJob.name,
    });

    // Call the service to check if the company exists from the Business Layer.[Service Call]
    let companyDetails: QueryResponse<DbCompanyDetailDto> =
      await companyServiceObj.getCompanyDetailById(jobCreateDto.companyId);

    // Check if the CompanyId is an empty array
    if (!companyDetails.count) {
      // Throw an error if the CompanyId is not found
      throw new BaseError(
        `The Company details not found. please check the information and try again.`,
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Parsed company details
    const parsedCompanyDetails: DbCompanyDetailDto = companyDetails[0];

    // Prepare Create Company Job Dto
    const companyJobCreateDto: CompanyJobCreateDto = {
      ...jobCreateDto,
    };

    // Create company job on aws dynamodb
    const companyJobDetailsOnAwsDynamodb: DbCompanyJobDto =
      await companyJobServiceObj.createJob(
        parsedCompanyDetails.name,
        companyJobCreateDto
      );
    if (!companyJobDetailsOnAwsDynamodb) {
      throw new BaseError(
        "The Job is not created successfully, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    // Prepare company details to store in opensearch job model
    const companyDetailsDto: JobCreateCompanyDetailInternalDto = {
      companyName: parsedCompanyDetails.name,
      companyUrl: parsedCompanyDetails.website,
      companyLogoUrl: parsedCompanyDetails.logoUrl,
    };

    // Create job on aws opensearch
    const jobDetailsOnAwsOpensearch: Index_Response = await jobDaoObj.createJob(
      companyJobDetailsOnAwsDynamodb.id, // job id
      companyJobDetailsOnAwsDynamodb.jobUrl,
      JobSourcedFromEnum.WORKO,
      companyDetailsDto,
      jobCreateDto
    );

    // Check if the job is created in aws opensearch or not and throw error if not
    if (jobDetailsOnAwsOpensearch.statusCode !== HttpStatusCode.CREATED_201) {
      // As the job is not created in aws opensearch,so to make the consistency we need to Delete the job from aws dynamodb
      await companyJobServiceObj.deleteCompanyJob(
        companyJobDetailsOnAwsDynamodb
      );

      // Throw an error if the Job is not created
      throw new BaseError(
        "Failed to create Job, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return companyJobDetailsOnAwsDynamodb;
  }

  /**
   * parseJobDescription
   *
   * Parses a job description using a Lambda function.
   *
   * @param {ParsedJobDescriptionApiDto} parsedJobDescriptionApiDto - The DTO containing the job description to be parsed.
   * @returns {Promise<ParsedJobDescriptionResponseDto>} The parsed job description details.
   * @throws {BaseError} If the Lambda invocation fails or returns a non-200 status code.
   */
  async parseJobDescription(
    parsedJobDescriptionApiDto: ParsedJobDescriptionApiDto
  ): Promise<ParsedJobDescriptionResponseDto> {
    // Global Logger for the Parse Job Description Controller
    global.logger.info("Parsing Job Description. [service]", {
      filePath: __filename,
      methodName: this.parseJobDescription.name,
    });

    // Invoke Lambda to parse job description
    const parseJobDescriptionResponse: APIGatewayProxyResult =
      await InvokeLambdaService.triggerParseJobDescription(
        parsedJobDescriptionApiDto
      );

    // If the response status code is not 200 then throw an error
    if (parseJobDescriptionResponse.statusCode !== HttpStatusCode.OK_200) {
      throw new BaseError(
        "Unable to parse job description, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    // Return the parsed response
    return JSON.parse(parseJobDescriptionResponse["body"]);
  }

  /**
   * getAllJobsByFilterOptions
   *
   * Fetches all the Jobs for the company with the given filter options.
   *
   * @param {JobListingFilterOptions} jobListingFilterRequest - The filter options to apply on the Jobs.
   * @returns {Promise<AwsOpensearchRecordListingResponseDTO<FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails>>} - Returns the list of all Jobs.
   */
  async getAllJobsByFilterOptions(
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<
    AwsOpensearchRecordListingResponseDTO<FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails>
  > {
    global.logger.info("Get All Jobs [Service]", {
      filePath: __filename,
      methodName: this.getAllJobsByFilterOptions.name,
    });

    // Get all jobs by filter options
    const jobListingResponse: AwsOpensearchRecordListingResponseDTO<
      DbJobAwsOpensearchDto[]
    > = await jobDaoObj.getAllJobsByFilterOptions(jobListingFilterRequest);

    // Destructure the response
    const { pagination, data: jobsData } = jobListingResponse;

    // Filter jobsData to only include objects that have a `companyId`
    const jobsWithCompanyId: DbJobAwsOpensearchDto[] = jobsData.filter(
      (job: DbJobAwsOpensearchDto) => job.companyId
    );

    // Filter jobsData to only include objects that don't have a `companyId`
    const jobsWithoutCompanyId: DbJobAwsOpensearchDto[] = jobsData.filter(
      (job: DbJobAwsOpensearchDto) => !job.companyId
    );

    // Attach company details
    const jobsWithCompanyDetails: (DbJobAwsOpensearchDto & {
      companyDetails: DbCompanyDetailDto | undefined;
    })[] = await attachCompanyDetails<DbJobAwsOpensearchDto>(jobsWithCompanyId);

    const finalResponseWithPagination: AwsOpensearchRecordListingResponseDTO<FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails> =
      {
        data: [...jobsWithCompanyDetails, ...jobsWithoutCompanyId],
        pagination: pagination,
      };

    return finalResponseWithPagination;
  }

  /**
   * createBulkJobs
   *
   * This method sends a bulk request to create multiple job documents in the OpenSearch index.
   * It returns a promise that resolves to `true` if all operations in the bulk request
   * succeed, or `false` if any operation fails.
   *
   * @param {(DbJobAwsOpensearchDto | {index: {_index: string; _id: string;}})[]} bulkJobData - An array
   * of job data and index actions to be processed in the bulk request.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations
   * in the bulk request succeed, or `false` if any operation fails.
   */
  async createBulkJobs(
    bulkJobData: (
      DbJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ): Promise<boolean> {
    // global logger
    global.logger.debug(`Create bulk jobs [SERVICE]`, {
      filePath: __filename,
      methodName: this.createBulkJobs.name,
    });

    return jobDaoObj.createBulkJobs(bulkJobData);
  }

  /**
   * transformFantasticJobToAwsOpensearchJobDto
   *
   * Transforms the fantastic job response to the DbJobAwsOpensearchDto.
   *
   * This function is used to transform the external job response from the external job API to the DbJobAwsOpensearchDto.
   *
   * @param {FantasticJobApiResponse} externalJob - The external job response from the external job API.
   * @returns {DbJobAwsOpensearchDto} - The transformed DbJobAwsOpensearchDto.
   */
  transformFantasticJobToAwsOpensearchJobDto(
    ulidId: string,
    externalJob: FantasticJobApiResponse
  ): DbJobAwsOpensearchDto {
    const dbJobDto: DbJobAwsOpensearchDto = {
      id: ulidId,
      externalJobId: externalJob.id,
      sourcedFrom: JobSourcedFromEnum.FANTASTIC_JOB,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
      jobTitle: externalJob.title.toLowerCase(),
      typeofEmployment: (Array.isArray(externalJob.employment_type) && externalJob.employment_type.length)
        ? externalJob.employment_type.join(", ").toUpperCase()
        : undefined,
      location: {
        city: externalJob?.cities_derived?.toLowerCaseArray() ?? [],
        state: externalJob?.regions_derived?.toLowerCaseArray() ?? [],
        country: externalJob?.countries_derived?.toLowerCaseArray() ?? [],
        fullLocation: externalJob?.locations_derived?.toLowerCaseArray() ?? [],
      },
      jobDescription: externalJob.description_html
        ? htmlToTextHelperObj.htmlToText(externalJob.description_html)
        : externalJob.description_text,
      htmlJobDescription: externalJob.description_html,
      jobPostedDate: externalJob.date_posted,
      jobCreatedDate: externalJob.date_created,
      jobUrl: externalJob.url,
      status: JobStatusEnum.PUBLISHED,
      workMode: externalJob.remote_derived
        ? JobWorkModeEnum.WFH
        : JobWorkModeEnum.WFO,
      companyName: externalJob.organization.toUpperCase() ?? undefined,
      companyUrl: externalJob.organization_url ?? undefined,
      companyLogoUrl: externalJob.organization_logo ?? undefined,
      isDeleted: false,
    };

    return dbJobDto;
  }

  /**
   * transformBrightDataJobToAwsOpensearchJobDto
   * 
   * Transforms a BrightData job response to the DbJobAwsOpensearchDto format.
   *
   * This function takes the external job response from BrightData and maps it to
   * the internal DbJobAwsOpensearchDto structure, which is used for indexing in
   * AWS OpenSearch.
   *
   * @param {string} ulidId - A unique ULID identifier for the job.
   * @param {BrightDataJobApiResponse} externalJob - The BrightData job response object.
   * @returns {DbJobAwsOpensearchDto} - The transformed job data in the internal DTO format.
   */
  transformBrightDataJobToAwsOpensearchJobDto(
    ulidId: string,
    externalJob: BrightDataJobApiResponse
  ): DbJobAwsOpensearchDto {
    const {
      job_posting_id,
      job_posted_date,
      job_description_formatted,
      job_title,
      job_employment_type,
      job_location,
      job_summary,
      url,
      company_name,
      company_url,
      company_logo,
      job_function,
      base_salary,
      job_poster,
      job_industries,
      job_seniority_level,
    } = externalJob;

    const jobLocation: string[] = job_location ? [job_location.toLowerCase()] : [];

    let salaryRange: MinMaxRange | undefined;
    if(base_salary?.min_amount && base_salary?.max_amount) {
      salaryRange = {
        min: base_salary.min_amount,
        max: base_salary.max_amount,
      };
    } else if (base_salary?.min_amount) {
      salaryRange = {
        min: base_salary.min_amount,
      };
    } else if (base_salary?.max_amount) {
      salaryRange = {
        max: base_salary.max_amount,
      };
    } else {
      salaryRange = undefined;
    }

    const dbJobDto: DbJobAwsOpensearchDto = {
      id: ulidId,
      externalJobId: job_posting_id ?? ulidId,
      sourcedFrom: JobSourcedFromEnum.BRIGHT_DATA_JOB,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
      jobTitle: job_title ? job_title.toLowerCase() : "",
      typeofEmployment: job_employment_type ?? undefined,
      location: {
        city: jobLocation,
        state: jobLocation,
        country: jobLocation,
        fullLocation: jobLocation,
      },
      jobDescription: job_summary ?? undefined,
      htmlJobDescription: job_description_formatted ?? undefined,
      jobPostedDate: job_posted_date ?? undefined,
      jobUrl: url ?? undefined,
      status: JobStatusEnum.PUBLISHED,
      companyName: company_name ? company_name.toUpperCase() : undefined,
      companyUrl: company_url ?? undefined,
      companyLogoUrl: company_logo ?? undefined,
      isDeleted: false,
      department: job_function ?? undefined,
      salaryRange: salaryRange,
      brightDataJobPoster: job_poster ?? undefined,
      industry: job_industries ?? undefined,
      brightDataJobSeniorityLevel: job_seniority_level ?? undefined,
    };

    return dbJobDto;
  }

  /**
   * scriptBulkUploadJobs
   * 
   * Bulk uploads jobs in aws opensearch.
   *
   * This method takes an array of formatted job data and index actions to be processed in the bulk request.
   * It sends a bulk request to the OpenSearch client to perform index actions, which create a document if it doesn’t exist
   * and replace it if it does.
   *
   * The method returns a promise that resolves to `true` if all operations in the bulk request succeed, or `false` if any operation fails.
   *
   * @param {(DbJobAwsOpensearchDto | {index: {_index: string; _id: string;}})[]} formattedJobListingArray - An array of job data and index actions to be processed in the bulk request.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations in the bulk request succeed, or `false` if any operation fails.
   */
  async scriptBulkUploadJobs(
    formattedJobListingArray: (
      | DbJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ) {
    global.logger.info("Bulk upload jobs [Service]", {
      methodName: this.scriptBulkUploadJobs.name,
    });

    return jobDaoObj.createBulkJobs(formattedJobListingArray);
  }

  /**
   * deleteOldUnappliedExternalJobs
   *
   * Deletes unapplied external jobs that are older than a specified number of days.
   *
   * This method logs the deletion process and calls the JobDao's deleteOldUnappliedExternalJobs method
   * to perform the delete by query operation in OpenSearch.
   *
   * @returns {Promise<DeleteByQuery_Response>} - A promise resolving to the result of the delete by query operation.
   */
  async deleteOldUnappliedExternalJobs(): Promise<DeleteByQuery_Response> {
    global.logger.info("Delete old unapplied external jobs [Service]", {
      methodName: this.deleteOldUnappliedExternalJobs.name,
    });

    return jobDaoObj.deleteOldUnappliedExternalJobs();
  }

  /**
   * softDeleteOldAppliedExternalJobs
   * 
   * Soft deletes old applied external jobs that are older than a specified number of days.
   *
   * This method logs the soft deletion process and calls the JobDao's softDeleteOldAppliedExternalJobs method
   * to perform the update by query operation in OpenSearch.
   *
   * @returns {Promise<UpdateByQuery_Response>} - A promise resolving to the result of the update by query operation.
   */
  async softDeleteOldAppliedExternalJobs(): Promise<UpdateByQuery_Response> {
    global.logger.info("Soft delete old applied external jobs [Service]", {
      methodName: this.softDeleteOldAppliedExternalJobs.name,
    });

    // Prepare Update Object
    const updateObject: Partial<JobUpdateInternalDto> = {
      isDeleted: true,
      status: JobStatusEnum.CLOSED,
    };

    return jobDaoObj.softDeleteOldAppliedExternalJobs(updateObject);
  }

  /**
   * updateInternalOrExternalJobById
   *
   * Updates a job by its ID using the provided update data.
   *
   * This method retrieves the job details from the `worko-jobs` index on `AWS Opensearch` and throws an error if the job is not found.
   * If the job is found, it updates the job details in `worko-jobs` index on `AWS Opensearch` and if the job is internal then it updates the `companyJob` details in dynamodb.
   *
   * If the job is external then it returns the updated job details from `worko-jobs` index on `AWS Opensearch`.
   *
   * @param {string} jobId - The ID of the job to update.
   * @param {JobUpdateDto} jobUpdateDto - The update data for the job.
   *
   * @returns {Promise<DbJobAwsOpensearchDto | DbCompanyJobDto | undefined>} - A promise that resolves to the updated job details from `worko-jobs` index on `AWS Opensearch` or undefined if the job is not found.
   */
  async updateInternalOrExternalJobById(
    jobId: string,
    jobUpdateDto: JobUpdateDto
  ): Promise<DbJobAwsOpensearchDto | DbCompanyJobDto | undefined> {
    // Logger
    global.logger.debug(`Update job by id [service]`, {
      methodName: this.updateInternalOrExternalJobById.name,
      jobId: jobId,
    });

    // Retrieve the job details from `worko-jobs` index on `AWS Opensearch` and throw an error if the job is not found.
    const jobDetailsOnAwsOpensearch: DbJobAwsOpensearchDto | undefined =
      await jobDaoObj.getJobById(jobId);
    if (!jobDetailsOnAwsOpensearch) {
      throw new BaseError(
        "The Job Details not found.",
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Update `job` details in `worko-jobs` index on `AWS Opensearch`.
    const updatedJobDetailsOnAwsOpensearch: Update_Response =
      await jobDaoObj.updateInternalOrExternalJobById(jobId, jobUpdateDto);
    if (updatedJobDetailsOnAwsOpensearch.statusCode !== HttpStatusCode.OK_200) {
      global.logger.error(
        `Update job by id in aws opensearch failed [SERVICE]`,
        {
          jobId: jobId,
          updatedJobDetailsOnAwsOpensearch,
        }
      );

      // Throw an error if the job is not updated
      throw new BaseError(
        "Unable to update job details, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    // If the job is internal then update the `companyJob` details in dynamodb.
    if(jobDetailsOnAwsOpensearch.companyId) {

      /**
       * Removes the `updatedAt` property from `jobUpdateDto` before updating the item in DynamoDB.
       *
       * Reason:
       * - `updatedAt` attribute is managed automatically by DynamoDB (via timestamps settings in Dynamoose).
       * - Including it manually may cause unintended overrides or conflicts during update.
       */
      delete jobUpdateDto.updatedAt;

      // Prepare Company Job Update Dto
      const companyJobUpdateDto: CompanyJobUpdateDto = {
        ...jobUpdateDto,
      };

      // Return updated `companyJob` details
      return companyJobServiceObj.updateCompanyJobById(
        jobId,
        jobDetailsOnAwsOpensearch.companyId,
        companyJobUpdateDto
      );
    }

    // Return the external job details
    return jobDaoObj.getJobById(jobId);
  }

  /**
   * softDeleteJobById
   * 
   * NOTE: As of now soft delete is implemented on the `CompanyJobs` present in `dynamodb`(CompanyJob.model.ts) and Job documents containing `companyId` in `opensearch`
   *
   * @param {string} jobId - The ID of the job to be soft deleted.
   * @param {string} companyId - The ID of the company associated with the job.
   * @returns {Promise<DbCompanyJobDto>} A promise that resolves to the soft deleted job details.
   */
  async softDeleteJobById(
    jobId: string,
    companyId: string
  ): Promise<DbCompanyJobDto> {
    // Global Logger for the Delete Job Controller
    global.logger.info("Deleting Job. [controller]", {
      filePath: __filename,
      methodName: this.softDeleteJobById.name,
      jobId: jobId,
      companyId: companyId,
    });

    // Prepare Update Object for opensearch
    const updateObjectForOpensearch: Partial<JobUpdateInternalDto> = {
      isDeleted: true,
      status: JobStatusEnum.CLOSED,
    };

    // Soft deleting the job from opensearch database
    const softDeleteJobOnAwsOpensearch: Update_Response =
      await jobDaoObj.softDeleteJobById(jobId, updateObjectForOpensearch);
    if (softDeleteJobOnAwsOpensearch.statusCode !== HttpStatusCode.OK_200) {
      throw new BaseError(
        "Unable to soft delete job, Please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
    global.logger.debug("Soft delete job on aws opensearch. [service]", {
      softDeleteJobOnAwsOpensearchStatusCode:
        softDeleteJobOnAwsOpensearch.statusCode,
    });

    // Soft delete the job from `CompanyJob` 
    return companyJobServiceObj.softDeleteJobById(jobId, companyId);
  }

  /**
   * getJobByIdFromAwsOpensearch
   *
   * Retrieves a job by its ID.
   *
   * This method fetches the job details from AWS OpenSearch using the given job ID.
   * It logs the operation and returns a promise that resolves to the job details.
   *
   * @param {string} id - The ID of the job to retrieve.
   * @returns {Promise<DbJobAwsOpensearchDto | undefined>} A promise that resolves to the job details.
   */
  async getJobByIdFromAwsOpensearch(
    id: string
  ): Promise<DbJobAwsOpensearchDto | undefined> {
    // logger
    global.logger.info(`Get Job By Id From aws opensearch [Service]`, {
      methodName: this.getJobByIdFromAwsOpensearch.name,
    });

    return jobDaoObj.getJobById(id);
  }

  /**
   * updateJobByIdOnAwsOpensearch
   *
   * Updates a job by its ID.
   *
   * This method logs the update operation and sends an update request to the OpenSearch client to modify the job document with the given ID.
   *
   * @param {string} id - The ID of the job to update.
   * @param {Partial<JobUpdateInternalDto>} updateDto - The updated details of the job.
   *
   * @returns {Promise<DbJobAwsOpensearchDto | undefined>} - A promise that resolves to the updated job details from the OpenSearch client.
   */
  async updateJobByIdOnAwsOpensearch(
    id: string,
    updateDto: Partial<JobUpdateInternalDto>
  ): Promise<Update_Response> {
    // logger
    global.logger.info(`Update Job By Id From aws opensearch [Service]`, {
      methodName: this.updateJobByIdOnAwsOpensearch.name,
    });

    return jobDaoObj.updateJobById(id, updateDto);
  }

  /**
   * updateBulkJob
   *
   * Updates multiple jobs in the OpenSearch index and DynamoDB table by their IDs.
   *
   * This method logs the update operation, processes each job update in the request body, and sends update requests to the OpenSearch client and DynamoDB.
   * It also keeps metrics of the success and failure of the update operations on both OpenSearch and DynamoDB.
   *
   * @param {JobBulkUpdateApiDto} validatedJobRequestBody - The validated request body containing the bulk job update data.
   *
   * @returns {Promise<JobBulkUpdateResponseDto>} - A promise that resolves to the bulk job update response containing metrics of the update operations on both OpenSearch and DynamoDB.
   */
  async updateBulkJob(
    validatedJobRequestBody: JobBulkUpdateApiDto
  ): Promise<JobBulkUpdateResponseDto> {
    global.logger.info("Bulk update job [Service]", {
      methodName: this.updateBulkJob.name,
      validatedJobRequestBody: validatedJobRequestBody,
    });

    // Get action by user id
    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    let opensearchUpdateData: Partial<JobUpdateInternalDto> = {};
    let dynamodbUpdateData: Partial<CompanyJobCommonUpdateDto> = {};

    if (actionByUserId) {
      opensearchUpdateData.updatedByUserId = actionByUserId;
      dynamodbUpdateData.updatedByUserId = actionByUserId;
    } else {
      opensearchUpdateData.updatedByCorporateUserId = actionByCorporateUserId;
      dynamodbUpdateData.updatedByCorporateUserId = actionByCorporateUserId;
    }

    const opensearchResult: EntityBulkUpdateMetricDto = {
      success: { count: 0, primaryIds: [] },
      failure: { count: 0, primaryIds: [] },
    };

    const dynamodbResult: EntityBulkUpdateMetricDto = {
      success: { count: 0, primaryIds: [] },
      failure: { count: 0, primaryIds: [] },
    };

    // Process each job update
    for (const jobUpdate of validatedJobRequestBody.bulkJobUpdate) {
      const { companyId, jobId, status } = jobUpdate;

      // Prepare update data for OpenSearch
      opensearchUpdateData.status = status;

      // Prepare update data for DynamoDB
      dynamodbUpdateData.status = status;

      try {
        // Update in OpenSearch
        const opensearchResponse: Update_Response =
          await jobDaoObj.updateJobById(jobId, opensearchUpdateData);

        if (opensearchResponse.statusCode === HttpStatusCode.OK_200) {
          opensearchResult.success.count++;
          opensearchResult.success.primaryIds.push(jobId);
        } else {
          opensearchResult.failure.count++;
          opensearchResult.failure.primaryIds.push(jobId);

          global.logger.error(`Failed to update jobId: ${jobId} in Opensearch`,{
            opensearchResponse
          });
        }
      } catch (error) {
        opensearchResult.failure.count++;
        opensearchResult.failure.primaryIds.push(jobId);

        global.logger.error(`Failed to update jobId: ${jobId} in Opensearch`, {
          error: error,
        });
      }

      try {
        // Update in DynamoDB
        const updateResult: DbCompanyJobDto =
          await companyJobServiceObj.updateCommonCompanyJobById(
            jobId,
            companyId,
            dynamodbUpdateData
          );

        if (updateResult?.id) {
          dynamodbResult.success.count++;
          dynamodbResult.success.primaryIds.push(jobId);
        } else {
          dynamodbResult.failure.count++;
          dynamodbResult.failure.primaryIds.push(jobId);

          global.logger.error(`Failed to update jobId: ${jobId} in DynamoDB`, {
            updateResult,
          });
        }
      } catch (error) {
        dynamodbResult.failure.count++;
        dynamodbResult.failure.primaryIds.push(jobId);

        global.logger.error(`Failed to update job ${jobId} in DynamoDB:`, {
          error: error,
        });
      }
    }

    // Prepare the response
    const bulkJobUpdateResponse: JobBulkUpdateResponseDto = {
      opensearchBulkJobUpdateMetrics: opensearchResult,
      dynamodbBulkJobUpdateMetrics: dynamodbResult,
    };

    return bulkJobUpdateResponse;
  }
}

const jobServiceObj: JobService = new JobService();
export {
  jobServiceObj,
  JobService
};