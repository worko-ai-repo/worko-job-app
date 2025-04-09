// Import lambdas
import { APIGatewayProxyResult } from "aws-lambda";

// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import opensearch types
import { Index_Response, Update_Response } from "@opensearch-project/opensearch/api";

// Import luxon
import { DateTime } from "luxon";

// Import daos
import { jobDaoObj } from "../daos/Job.dao";

// Import dtos
import { JobCreateCompanyDetailInternalDto, JobCreateDto, JobListingFilterOptions, JobUpdateDto, JobUpdateInternalDto, ParsedJobDescriptionApiDto, ParsedJobDescriptionResponseDto } from "../dtos/Job.dto";
import { ExternalJobUpdateDto } from "../dtos/ExternalJob.dto";
import { AwsOpensearchRecordListingResponseDTO } from "../dtos/Common.aws-opensearch.dto";
import { CompanyJobCreateDto, CompanyJobUpdateDto } from "../dtos/CompanyJob.dto";
import { FantasticJobApiResponse } from "../dtos/FantasticJob.dto";

// Import enums
import { JobStatusEnum, JobWorkModeEnum } from "../enums/Job.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";

// Import helpers
import { attachCompanyDetails } from "../helpers/companyDetailsInjector.helper";
import { htmlToTextHelperObj } from "../helpers/htmlToText.helper";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";
import { DbExternalJobDto } from "../db/models/ExternalJob.model";
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

// Import services
import UlidService from "./Ulid.service";
import { companyJobServiceObj } from "./CompanyJob.service";
import InvokeLambdaService from "./InvokeLambda.service";
import { externalJobServiceObj } from "./ExternalJob.service";
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

    /**
     * @todo: Check whether the sorting is disturbed or not.
     */
    const finalResponseWithPagination: AwsOpensearchRecordListingResponseDTO<FinalJobsResponseWithCompanyDetailsAndWithoutCompanyDetails> =
      {
        data: [...jobsWithCompanyDetails, ...jobsWithoutCompanyId],
        pagination: pagination,
      };

    return finalResponseWithPagination;
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
  private transformFantasticJobToAwsOpensearchJobDto(
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
      typeofEmployment: externalJob.employment_type
        ? externalJob.employment_type.join(", ").toUpperCase()
        : undefined,
      location: {
        city: externalJob.cities_derived ?? [],
        state: externalJob.regions_derived ?? [],
        country: externalJob.countries_derived ?? [],
        fullLocation: externalJob.locations_derived ?? [],
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
   * createBulkJobsInOpensearch
   *
   * Bulk indexes jobs in aws opensearch.
   *
   * This method takes an array of external job responses and processes them in batches of 500.
   * Each batch is transformed into the format required by the bulk API and indexed in the `worko-jobs` index in opensearch.
   * If any batch fails, the method returns `false`; otherwise, it returns `true`.
   *
   * @param {FantasticJobApiResponse[]} bulkJobDetails - An array of external job responses to be indexed in opensearch.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all batches are indexed successfully, or `false` if any batch fails.
   */
  async createBulkJobsInOpensearch(bulkJobDetails: FantasticJobApiResponse[]) {
    // global logger
    global.logger.debug(`Bulk index jobs in aws opensearch [SERVICE]`, {
      filePath: __filename,
      methodName: this.createBulkJobsInOpensearch.name,
    });

    // Define the batch size
    const batchSize = 500;

    // Split the bulkJobDetails into chunks of 500
    for (let i = 0; i < bulkJobDetails.length; i += batchSize) {
      const batch: FantasticJobApiResponse[] = bulkJobDetails.slice(
        i,
        i + batchSize
      );

      // Transform the batch into the format required by the bulk API
      const bulkJobData: (
        | DbJobAwsOpensearchDto
        | {
            index: {
              _index: string;
              _id: string;
            };
          }
      )[] = batch.flatMap((eachExternalJob: FantasticJobApiResponse) => {
        const ulidId: string = UlidService.getUlidId();
        return [
          {
            index: { _index: jobDaoObj.IndexName, _id: ulidId },
          },
          this.transformFantasticJobToAwsOpensearchJobDto(
            ulidId,
            eachExternalJob
          ),
        ];
      });

      // Bulk index the current batch of jobs
      const success: boolean = await jobDaoObj.createBulkJobs(bulkJobData);
      global.logger.debug(
        `Bulk index jobs in aws opensearch success status [SERVICE]`,
        { success }
      );

      // If any batch fails, return false
      if (!success) {
        return false;
      }
    }

    // Bulk index jobs
    return true;
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
  scriptBulkUploadJobs(
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

  // ============================================================
  // In near future we will work on deleting job flow
  // ============================================================
  /* bulkDeleteJobs(ids: string[]) {
    return jobDaoObj.bulkDeleteJobs(ids);
  } */

  /* bulkSoftDeleteJobs(ids: string[]) {
    return jobDaoObj.bulkSoftDeleteJobs(ids);
  } */

  async updateInternalOrExternalJobById(
    jobId: string,
    jobUpdateDto: JobUpdateDto
  ): Promise<
    DbJobAwsOpensearchDto | DbExternalJobDto | DbCompanyJobDto | undefined
  > {
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
          updatedJobDetailsOnAwsOpensearch,
        }
      );
    }

    // If `companyId` is not present, then check and update `external job` details in `ExternalJob` model in `worko-job-app` table on `AWS Dynamodb` and return the response.
    if (!jobDetailsOnAwsOpensearch.companyId) {
      // Retrieve the external job details from dynamodb and if not present return the retrieved job details from opensearch
      const externalJobDetailsOnAwsDynamodb: QueryResponse<DbExternalJobDto> = await externalJobServiceObj.getExternalJobById(jobId);
      if (externalJobDetailsOnAwsDynamodb.count === 0) {
        return jobDaoObj.getJobById(jobId);
      }

      // Prepare update External Job dto
      const externalJobUpdateDto: ExternalJobUpdateDto = {
        ...jobUpdateDto,
      };

      // If the external job details from dynamodb present then update it and return
      return externalJobServiceObj.updateExternalJobById(jobId, externalJobUpdateDto);
    }

    // Prepare Company Job Update Dto
    const companyJobUpdateDto: CompanyJobUpdateDto = {
      ...jobUpdateDto,
    };

    // Else Update `job` details in `CompanyJob` model in `worko-job-app` table on `AWS Dynamodb` and return the response.
    return companyJobServiceObj.updateCompanyJobById(
      jobId,
      jobDetailsOnAwsOpensearch.companyId,
      companyJobUpdateDto
    );
  }

  /**
   * softDeleteJobById
   * 
   * NOTE: As of now soft delete is implemented on the `CompanyJobs` present in `dynamodb`(CompanyJob.model.ts) and `opensearch`
   * but it will implement on `external jobs` which are present in in `dynamodb`(ExternalJob.model.ts) and `opensearch` also in near future.
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

    // Soft deleting the job from opensearch database
    const softDeleteJobOnAwsOpensearch: Update_Response =
      await jobDaoObj.softDeleteJobById(jobId);
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
  getJobByIdFromAwsOpensearch(id: string): Promise<DbJobAwsOpensearchDto | undefined> {
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
   * @param {JobUpdateInternalDto} updateDto - The updated details of the job.
   *
   * @returns {Promise<DbJobAwsOpensearchDto | undefined>} - A promise that resolves to the updated job details from the OpenSearch client.
   */
  updateJobByIdOnAwsOpensearch(id: string, updateDto: JobUpdateInternalDto) {
    // logger
    global.logger.info(`Update Job By Id From aws opensearch [Service]`, {
      methodName: this.updateJobByIdOnAwsOpensearch.name,
    });

    return jobDaoObj.updateJobById(id, updateDto);
  }
}

const jobServiceObj = new JobService();
export {
  jobServiceObj,
  JobService
};