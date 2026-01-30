
// Import lambdas
import { APIGatewayProxyResult } from "aws-lambda";

// Import dynamoose types
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import dtos
import { JobBulkUpdateApiDto, JobBulkUpdateResponseDto, JobCreateCompanyDetailInternalDto, JobCreateDto, JobListingFilterOptions, JobSoftDeleteApiDto, JobUpdateDto, JobUpdateInternalDto, ParsedJobDescriptionApiDto, ParsedJobDescriptionResponseDto } from "../dtos/Job.dto";
import { CompanyJobCommonUpdateDto, CompanyJobCreateDto, CompanyJobUpdateDto } from "../dtos/CompanyJob.dto";
import { EntityBulkUpdateMetricDto } from "../dtos/Common.dto";
import { AwsS3VectorJobCreateDto, AwsS3VectorJobCreateOrUpdateParsedResponseDto, AwsS3VectorJobListingFilterOptions, AwsS3VectorJobMatchingScoreDto, AwsS3VectorJobGetParsedResponseDto, AwsS3VectorJobUpdateDto, AwsS3VectorJobCreateOrUpdateJobDataDto } from "../dtos/AwsS3VectorJob.dto";
import { GcpFirestoreRecordListingResponseDTO } from "../dtos/Common.gcp-firestore.dto";

// Import enums
import { JobStatusEnum } from "../enums/Job.enum";
import { JobSourcedFromEnum } from "../enums/Common.enum";
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

// Import helpers
import { getActionByUserId } from "../helpers/user.helper";
import { injectCountCompanyJobByEntityTypeDetailsHelper } from "../helpers/injectCountCompanyJobDetails.helper";
import { dateHelperObj } from "../helpers/date.helper";
import { injectEntityDetailsHelperObj } from "./injectEntityDetails.helper";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbCompanyJobDto } from "../db/models/CompanyJob.model";
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

// Import services
import { userJobApplicationServiceObj } from "./UserJobApplication.service";
import { companyJobServiceObj } from "./CompanyJob.service";
import InvokeLambdaService from "./InvokeLambda.service";
import companyServiceObj  from "./Company.service";
import { awsS3VectorJobServiceObj } from "./AwsS3VectorJob.service";
import { gcpFirestoreJobServiceObj } from "./GcpFirestoreJob.service";

// Import types
import { JobsWithOrWithoutEntityDetails } from "../types/Job.type";

// Import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError } from "../utils/errors.util";

/**
 * JobService
 * 
 * @description 
 *  1. As of now this `JobService` class is responsible for interacting
 *     with `Aws dynamodb`, `Gcp firestore`, `Aws s3 vector` because jobs are stored in these three different databases.
 *  2. `JobService` class is a bridge between `Aws dynamodb`, `Gcp firestore` and `Aws s3 vector`
 *  3. `JobService` class should not directly call `dao` classes, it should call `service` classes of
 *    `Aws dynamodb` or `Gcp firestore` or `Aws s3 vector` for implementations. 
 * 
 * @note 
 *  1. As of now `Aws opensearch` is not being used for storing jobs, if
 *  its being used update in `AwsOpenSearchJob.service.ts`, `AwsOpenSearchJob.dao.ts`, `AwsOpenSearchJob.model.ts`
 */
class JobService {
  async prepareAndCreateJobInAwsS3Vector(
    jobDataToStoreInAwsS3Vector: DbGcpFirestoreJobDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    const awsS3VectorJobCreateDto: AwsS3VectorJobCreateDto = awsS3VectorJobServiceObj.prepareAwsS3VectorJobCreateDto(
      awsS3VectorJobServiceObj.getAwsS3VectorJobIndexName(),
      jobDataToStoreInAwsS3Vector
    )

    // Create job in s3 vector
    const jobDetailsOnAwsS3Vector: AwsS3VectorJobCreateOrUpdateParsedResponseDto = await awsS3VectorJobServiceObj.createAwsS3VectorJob(
      awsS3VectorJobCreateDto
    );
    if(!jobDetailsOnAwsS3Vector?.results?.success) {
      throw new BaseError(
        "Failed to create Job, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }    

    return jobDetailsOnAwsS3Vector
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
  async createJob(jobCreateDto: JobCreateDto): Promise<DbGcpFirestoreJobDto> {
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

    const jobOnGcpFirestore: DbGcpFirestoreJobDto | undefined = await gcpFirestoreJobServiceObj.createJob(
      {
        id: companyJobDetailsOnAwsDynamodb.id,
        jobUrl: companyJobDetailsOnAwsDynamodb.jobUrl,
        sourcedFrom: JobSourcedFromEnum.WORKO,
        ...companyDetailsDto,
        ...jobCreateDto,
        createdAt: dateHelperObj.getISODate(),
        updatedAt: dateHelperObj.getISODate(),
        isDeleted: false,
      }
    )
    if(!jobOnGcpFirestore) {
      global.logger.error("Failed to create job on gcp firestore", {filePath: __filename, methodName: this.createJob.name,});
      throw new BaseError(
        "Failed to create Job, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    await this.prepareAndCreateJobInAwsS3Vector(jobOnGcpFirestore);

    await this.syncSitemapAfterJobCreate(jobOnGcpFirestore);

    return jobOnGcpFirestore;
  }

  /**
   * Syncs sitemap after job creation. Uses dynamic import to avoid circular dependency with Sitemap.service.
   * Failures are logged but do not block job creation.
   */
  private async syncSitemapAfterJobCreate(job: DbGcpFirestoreJobDto): Promise<void> {
    try {
      const sitemapServiceObj = (await import("./Sitemap.service")).default;
      await sitemapServiceObj.addOrUpdateJobInSitemap(job);
    } catch (sitemapError) {
      global.logger.error("Failed to update sitemap after job creation [Service]", {
        filePath: __filename,
        methodName: "createJob",
        jobId: job.id,
        error: sitemapError,
      });
    }
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

  private async attachGcpFirestoreJobsWithCompanyDetailsAndAwsS3VectorMatchScore(
    jobsData: DbGcpFirestoreJobDto[],
    initialMatchScoreJobMap: Map<string, AwsS3VectorJobMatchingScoreDto>,
    jobListingFilterRequest: JobListingFilterOptions,
  ): Promise<JobsWithOrWithoutEntityDetails> {
    if (!jobListingFilterRequest.includeCompanyDetails) {
      return jobsData.map((job: DbGcpFirestoreJobDto) => ({
        ...job,
        initialMatchingScoreDetails: initialMatchScoreJobMap.get(job.id),
      }));
    }

    if(!jobsData.length) {
      return jobsData.map((job: DbGcpFirestoreJobDto) => ({
        ...job,
        initialMatchingScoreDetails: initialMatchScoreJobMap.get(job.id),
      }))
    }

    // Partition jobs by companyId in a single iteration
    const jobsWithCompanyId: (DbGcpFirestoreJobDto & {
      initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
    })[] = [];
    const jobsWithoutCompanyId: (DbGcpFirestoreJobDto & {
      initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
    })[] = [];

    jobsData.forEach((job: DbGcpFirestoreJobDto) => {
      if (job.companyId) {
        jobsWithCompanyId.push({
          ...job,
          initialMatchingScoreDetails: initialMatchScoreJobMap.get(job.id),
        });
      } else {
        jobsWithoutCompanyId.push({
          ...job,
          initialMatchingScoreDetails: initialMatchScoreJobMap.get(job.id),
        });
      }
    });

    // Attach company details
    const jobsWithCompanyDetails: JobsWithOrWithoutEntityDetails = await injectEntityDetailsHelperObj.injectEntityDetailsForGcpFirestoreAndAwsS3VectorJobs<
      (DbGcpFirestoreJobDto & {
        initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
      })
    >(
      jobsWithCompanyId
    );

    return [
      ...jobsWithCompanyDetails,
      ...jobsWithoutCompanyId,
    ];
  }

  private async attachGcpFirestoreJobsWithCompanyDetails(
    jobsData: DbGcpFirestoreJobDto[],
    jobListingFilterRequest: JobListingFilterOptions,
  ): Promise<(DbGcpFirestoreJobDto & { companyDetails?: DbCompanyDetailDto })[]> {
    if (!jobListingFilterRequest.includeCompanyDetails) {
      return jobsData;
    }

    if(!jobsData.length) {
      return jobsData;
    }

    const jobsWithCompanyId: DbGcpFirestoreJobDto[] = [];
    const jobsWithoutCompanyId: DbGcpFirestoreJobDto[] = [];

    jobsData.forEach((job: DbGcpFirestoreJobDto) => {
      if (job.companyId) {
        jobsWithCompanyId.push(job);
      } else {
        jobsWithoutCompanyId.push(job);
      }
    });

    // Attach company details
    const jobsWithCompanyDetails: (DbGcpFirestoreJobDto & {
      companyDetails?: DbCompanyDetailDto;
    })[] = await injectEntityDetailsHelperObj.injectEntityDetailsForGcpFirestoreAndAwsS3VectorJobs<
      DbGcpFirestoreJobDto
    >(
      jobsWithCompanyId
    );

    return [
      ...jobsWithCompanyDetails,
      ...jobsWithoutCompanyId,
    ];
  }

  async getAllJobsByFilterOptionsFromGcpFirestore(
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<GcpFirestoreRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>> {
    global.logger.info("Get All Jobs by Filter Options From Gcp Firestore [Service]", {
      methodName: this.getAllJobsByFilterOptionsFromGcpFirestore.name,
    });

    const jobListingResponse: GcpFirestoreRecordListingResponseDTO<DbGcpFirestoreJobDto[]> = await gcpFirestoreJobServiceObj.getAllJobsByFilterOptions(
        jobListingFilterRequest
      );

    const jobsWithCompanyDetails: (DbGcpFirestoreJobDto & {
      companyDetails?: DbCompanyDetailDto;
    })[] = await this.attachGcpFirestoreJobsWithCompanyDetails(
      jobListingResponse.data,
      jobListingFilterRequest
    );

    if(jobListingFilterRequest.includeCountCompanyJobEntityJobApplication) {
      const jobsWithCountCompanyJobDetails: JobsWithOrWithoutEntityDetails = await injectCountCompanyJobByEntityTypeDetailsHelper<(
        (DbGcpFirestoreJobDto & {
          companyDetails?: DbCompanyDetailDto
        })
      )>(
        CountCompanyJobDbEntityTypeEnum.JOB_APPLICATION,
        jobsWithCompanyDetails
      );

      return {
        data: jobsWithCountCompanyJobDetails,
        pagination: jobListingResponse.pagination,
      }
    }

    return {
      data: jobsWithCompanyDetails,
      pagination: jobListingResponse.pagination,
    };
  }

  async getAllJobsFromAwsS3VectorAndGcpFirestoreByFilterOptions(
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<GcpFirestoreRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>> {
    global.logger.info("Get All Jobs from S3 Vector and Opensearch [Service]", {
      methodName: this.getAllJobsFromAwsS3VectorAndGcpFirestoreByFilterOptions.name,
    });

    const s3VectorFilterOptions: AwsS3VectorJobListingFilterOptions = {
      ...jobListingFilterRequest,
    }

    const s3VectorMatchingJobs: AwsS3VectorJobGetParsedResponseDto = await awsS3VectorJobServiceObj.getAllAwsS3VectorJobsByFilterOptions(s3VectorFilterOptions);

    if (!s3VectorMatchingJobs?.jobs?.length) {
      global.logger.warn("No Jobs found in S3 Vector", {
        methodName:
          this.getAllJobsFromAwsS3VectorAndGcpFirestoreByFilterOptions.name,
      });

      return {
        data: [],
        pagination: {
          count: 0,
          pageSize: jobListingFilterRequest.pageSize,
          lastKey: undefined,
          sortOrder: jobListingFilterRequest.sortOrder,
        },
      };
    }

    const initialMatchScoreJobMap: Map<string, AwsS3VectorJobMatchingScoreDto> = new Map<string, AwsS3VectorJobMatchingScoreDto>();
    const s3VectorJobIds: string[] = s3VectorMatchingJobs.jobs.map(
      (
        job: AwsS3VectorJobMatchingScoreDto
      ) => {
        initialMatchScoreJobMap.set(job.jobId, job);
        return job.jobId
      }
    );

    const jobListingResponse: DbGcpFirestoreJobDto[] = await gcpFirestoreJobServiceObj.getJobsByIds(
      s3VectorJobIds
    );

    const attachDetails: JobsWithOrWithoutEntityDetails = await this.attachGcpFirestoreJobsWithCompanyDetailsAndAwsS3VectorMatchScore(
      jobListingResponse,
      initialMatchScoreJobMap,
      jobListingFilterRequest,
    );

    const finalResponse: GcpFirestoreRecordListingResponseDTO<JobsWithOrWithoutEntityDetails> = {
      data: attachDetails,
      pagination: {
        count: attachDetails.length,
        pageSize: jobListingFilterRequest.pageSize,
        lastKey: undefined,
        s3VectorLastKey: s3VectorMatchingJobs.s3VectorLastKey,
        sortOrder: jobListingFilterRequest.sortOrder,
      }
    }

    return finalResponse;
  }
  
  async getAllJobsByDashboardFilterOptions(
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<GcpFirestoreRecordListingResponseDTO<JobsWithOrWithoutEntityDetails>>
 {
    global.logger.info("Get All Jobs by Dashboard [Service]", {
      methodName: this.getAllJobsByDashboardFilterOptions.name,
      dashboard: jobListingFilterRequest.dashboard,
    });

    if(jobListingFilterRequest.fromS3Vector) {
      return this.getAllJobsFromAwsS3VectorAndGcpFirestoreByFilterOptions(jobListingFilterRequest);
    } else {
      return this.getAllJobsByFilterOptionsFromGcpFirestore(jobListingFilterRequest);
    }
  }

  private async updateJobByIdInAwsS3Vector(
    updatedJobDetailsOnGcpFirestore: DbGcpFirestoreJobDto
  ): Promise<AwsS3VectorJobCreateOrUpdateParsedResponseDto> {
    global.logger.info("Update job by id in aws s3 vector [Service]", {
      methodName: this.updateJobByIdInAwsS3Vector.name,
    });

    const updateData: AwsS3VectorJobUpdateDto = awsS3VectorJobServiceObj.prepareAwsS3VectorJobUpdateDto(
      awsS3VectorJobServiceObj.getAwsS3VectorJobIndexName(),
      // We should must send entire opensearch job details 
      // because in aws s3 vector its performing delete and create operation in order to update job details
      updatedJobDetailsOnGcpFirestore 
    )

    const updatedAwsS3VectorJobDetails: AwsS3VectorJobCreateOrUpdateParsedResponseDto = await awsS3VectorJobServiceObj.updateAwsS3VectorJobById(updateData);
    if(!updatedAwsS3VectorJobDetails || !updatedAwsS3VectorJobDetails.results.success) {
      throw new BaseError(
        "Unable to update aws s3 vector job details.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return updatedAwsS3VectorJobDetails;
  }

  /**
   * @todo: Need to think aborting the job update if any one of update in opensearch or dynamodb or aws s3 vector fails.
   */
  async updateInternalOrExternalJobById(
    jobId: string,
    jobUpdateDto: JobUpdateDto
  ): Promise<DbGcpFirestoreJobDto> {
    // Logger
    global.logger.debug(`Update job by id [service]`, {
      methodName: this.updateInternalOrExternalJobById.name,
      jobId: jobId,
    });

    const jobDetailsOnGcpFirestoreBeforeUpdate: DbGcpFirestoreJobDto | undefined =
      await gcpFirestoreJobServiceObj.getJobById(jobId);
    if (!jobDetailsOnGcpFirestoreBeforeUpdate) {
      throw new BaseError(
        "The Job Details not found.",
        HttpStatusCode.NOT_FOUND_404
      );
    }

    const updatedJobDetailsOnGcpFirestore: DbGcpFirestoreJobDto | undefined =
      await gcpFirestoreJobServiceObj.updateJobById(jobId, jobUpdateDto);
    if (!updatedJobDetailsOnGcpFirestore) {
      global.logger.error(
        `Update job by id in gcp firestore failed [SERVICE]`,
        {
          jobId: jobId,
          jobUpdateDto,
          updatedJobDetailsOnGcpFirestore,
        }
      );

      // Throw an error if the job is not updated
      throw new BaseError(
        "Unable to update job details, please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    // If the job is internal then update the `companyJob` details in dynamodb.
    if(updatedJobDetailsOnGcpFirestore.companyId) {
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
      const updatedCompanyJobDetails: DbCompanyJobDto = await companyJobServiceObj.updateCompanyJobById(
        jobId,
        updatedJobDetailsOnGcpFirestore.companyId,
        companyJobUpdateDto
      );

      if(!updatedCompanyJobDetails || !updatedCompanyJobDetails.id) {
        global.logger.error("Unable to update company job details in aws dynamodb. [service]", {
          methodName: this.updateInternalOrExternalJobById.name,
          jobId: jobId,
        })
        throw new BaseError(
          "Unable to update company job details.",
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }
    }

    // if job status before update is published and job status after update is not published then delete job from aws s3 vector
    if(
      jobDetailsOnGcpFirestoreBeforeUpdate.status === JobStatusEnum.PUBLISHED &&
      updatedJobDetailsOnGcpFirestore.status !== JobStatusEnum.PUBLISHED
    ) {
      global.logger.info("Job status before update is published and job status after update is not published, so delete job from aws s3 vector. [service]", {
        methodName: this.updateInternalOrExternalJobById.name,
        jobId: updatedJobDetailsOnGcpFirestore.id,
      })
      const isAwsS3VectorJobDeleted: boolean = await awsS3VectorJobServiceObj.deleteAwsS3VectorJobById(
        updatedJobDetailsOnGcpFirestore.id
      );

      if(!isAwsS3VectorJobDeleted) {
        global.logger.error("Unable to delete aws s3 vector job details. [service]", {
          methodName: this.updateInternalOrExternalJobById.name,
          jobId: updatedJobDetailsOnGcpFirestore.id,
        });
        throw new BaseError(
          "Unable to update job details.",
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }
    }
    // If job status before update is not published and job status after update is published then create job in aws s3 vector
    else if(
      jobDetailsOnGcpFirestoreBeforeUpdate.status !== JobStatusEnum.PUBLISHED &&
      updatedJobDetailsOnGcpFirestore.status === JobStatusEnum.PUBLISHED
    ) {
      global.logger.info("Job status before update is not published and job status after update is published, so create job in aws s3 vector. [service]", {
        methodName: this.updateInternalOrExternalJobById.name,
        jobId: updatedJobDetailsOnGcpFirestore.id,
      });

      await this.prepareAndCreateJobInAwsS3Vector(
        updatedJobDetailsOnGcpFirestore
      );
    } 
    // If job status before update is published and job status after update is published then update job in aws s3 vector
    else if(
      jobDetailsOnGcpFirestoreBeforeUpdate.status === JobStatusEnum.PUBLISHED &&
      updatedJobDetailsOnGcpFirestore.status === JobStatusEnum.PUBLISHED
    ) {
      global.logger.info("Job status before update is published and job status after update is published, so update job in aws s3 vector. [service]", {
        methodName: this.updateInternalOrExternalJobById.name,
        jobId: updatedJobDetailsOnGcpFirestore.id,
      })
      await this.updateJobByIdInAwsS3Vector(
        updatedJobDetailsOnGcpFirestore
      );
    }

    await this.syncSitemapAfterJobUpdate(
      jobDetailsOnGcpFirestoreBeforeUpdate,
      updatedJobDetailsOnGcpFirestore
    );

    // Return the external job details
    return updatedJobDetailsOnGcpFirestore;
  }

  /**
   * Syncs sitemap after job update. Uses dynamic import to avoid circular dependency with Sitemap.service.
   * Failures are logged but do not block job update.
   */
  private async syncSitemapAfterJobUpdate(
    gcpFirestoreJobBeforeUpdate: DbGcpFirestoreJobDto | undefined,
    jobAfterUpdate: DbGcpFirestoreJobDto
  ): Promise<void> {
    try {
      const sitemapServiceObj = (await import("./Sitemap.service")).default;
      await sitemapServiceObj.syncJobInSitemap(gcpFirestoreJobBeforeUpdate, jobAfterUpdate);
    } catch (sitemapError) {
      global.logger.error("Failed to sync sitemap after job update [Service]", {
        filePath: __filename,
        methodName: "updateInternalOrExternalJobById",
        jobId: jobAfterUpdate.id,
        error: sitemapError,
      });
    }
  }

  /**
   * @todo: Need to think aborting the job update if any one of update in opensearch or dynamodb or aws s3 vector fails.
   */
  async softDeleteJobById(
    jobId: string,
    companyId: string,
    requestBody: JobSoftDeleteApiDto
  ): Promise<DbCompanyJobDto> {
    // Global Logger for the Delete Job Controller
    global.logger.info("Deleting Job. [controller]", {
      methodName: this.softDeleteJobById.name,
      jobId: jobId,
      companyId: companyId,
    });

    let jobClosedByUserId: string | undefined;
    const {actionByUserId, actionByCorporateUserId} = getActionByUserId();
    if(actionByUserId) {
      jobClosedByUserId = actionByUserId;
    } else if(actionByCorporateUserId) {
      jobClosedByUserId = actionByCorporateUserId;
    }

    const softDeleteJobOnGcpFirestore: DbGcpFirestoreJobDto | undefined  =
      await gcpFirestoreJobServiceObj.updateJobById(jobId, {
        status: JobStatusEnum.CLOSED,
        shortSoftDeleteReason: requestBody.shortSoftDeleteReason,
        detailedSoftDeleteReason: requestBody.detailedSoftDeleteReason,
    });
    if (!softDeleteJobOnGcpFirestore) {
      global.logger.error(`Unable to soft delete job in gcp firestore.`, {
        softDeleteJobOnGcpFirestore,
        jobId
      })
      throw new BaseError(
        "Unable to soft delete job, Please try again.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    const prepareSoftDeletDataForAwsDynamodb: Partial<CompanyJobCommonUpdateDto> = {
      isDeleted: true,
      status: JobStatusEnum.CLOSED,
      shortSoftDeleteReason: requestBody.shortSoftDeleteReason,
      detailedSoftDeleteReason: requestBody.detailedSoftDeleteReason,
    }

    // Soft delete the job from `CompanyJob` 
    const updatedJobDetails: DbCompanyJobDto = await companyJobServiceObj.softDeleteJobById(jobId, companyId, prepareSoftDeletDataForAwsDynamodb);
    if(updatedJobDetails.status !== JobStatusEnum.CLOSED && updatedJobDetails.isDeleted !== true) {
      global.logger.error("Unable to soft delete job in dynamodb, Please try again. [service]", {
        updatedJobDetails
      })
      throw new BaseError(
        "Unable to Close job.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    const isAwsS3VectorJobDeleted: boolean = await awsS3VectorJobServiceObj.deleteAwsS3VectorJobById(
      updatedJobDetails.id
    );

    if(!isAwsS3VectorJobDeleted) {
      global.logger.error("Unable to hard delete job in aws s3 vector [service]", {
        isAwsS3VectorJobDeleted,
        updatedJobDetails
      })
      throw new BaseError(
        "Unable to Close job.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    await userJobApplicationServiceObj.updateAllNonInitiatedHiringStatusJobApplicationsToReject(
      jobId,
      updatedJobDetails.jobTitle,
      jobClosedByUserId,
      undefined,
      updatedJobDetails.shortSoftDeleteReason,
      updatedJobDetails.detailedSoftDeleteReason,
    );

    await this.removeJobFromSitemapAfterSoftDelete(jobId);

    return updatedJobDetails;
  }

  /**
   * Removes job from sitemap after soft delete. Uses dynamic import to avoid circular dependency.
   */
  private async removeJobFromSitemapAfterSoftDelete(jobId: string): Promise<void> {
    try {
      const sitemapServiceObj = (await import("./Sitemap.service")).default;
      await sitemapServiceObj.removeJobFromSitemap(jobId);
    } catch (sitemapError) {
      global.logger.error("Failed to remove job from sitemap after soft delete [Service]", {
        filePath: __filename,
        methodName: "softDeleteJobById",
        jobId,
        error: sitemapError,
      });
    }
  }

  /**
   * Syncs sitemap after bulk job update (add PUBLISHED jobs, remove ARCHIVED/DRAFT).
   * Uses one sitemap read/write via syncBulkJobsInSitemap.
   */
  private async syncSitemapAfterBulkJobUpdate(
    jobIdsToRemove: string[],
    jobsToAddOrUpdate: DbGcpFirestoreJobDto[]
  ): Promise<void> {
    if (jobIdsToRemove.length === 0 && jobsToAddOrUpdate.length === 0) return;
    try {
      const sitemapServiceObj = (await import("./Sitemap.service")).default;
      await sitemapServiceObj.syncBulkJobsInSitemap(jobIdsToRemove, jobsToAddOrUpdate);
    } catch (sitemapError) {
      global.logger.error("Failed to sync sitemap after bulk job update", {
        filePath: __filename,
        methodName: "updateBulkJob",
        jobIdsToRemoveCount: jobIdsToRemove.length,
        jobsToAddOrUpdateCount: jobsToAddOrUpdate.length,
        error: sitemapError,
      });
    }
  }

  async getJobByIdFromGcpFireStore(id: string): Promise<DbGcpFirestoreJobDto | undefined> {
    return gcpFirestoreJobServiceObj.getJobById(id);
  }

  async getJobByIdFromS3Vector(
    id: string,
    jobListingFilterRequest: JobListingFilterOptions
  ): Promise<DbGcpFirestoreJobDto & {
    initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
  }> {
    global.logger.info(`Get Job By Id From s3 vector [Service]`, {
      methodName: this.getJobByIdFromS3Vector.name,
      requestedJobId: id,
    });

    const jobDetailsGcpFirestore: (DbGcpFirestoreJobDto & {
      initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto
    }) | undefined = await this.getJobByIdFromGcpFireStore(id);
    if(!jobDetailsGcpFirestore) {
      global.logger.warn("Job details not found in gcp firestore.", {
        requestedJobId: id,
        methodName: this.getJobByIdFromS3Vector.name,
      })
      return {} as DbGcpFirestoreJobDto & {
        initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto
      };
    }

    const s3VectorFilterOptions: AwsS3VectorJobListingFilterOptions = {
      jobId: id,
      ...jobListingFilterRequest,
    };

    const s3VectorMatchingJobs: AwsS3VectorJobGetParsedResponseDto = await awsS3VectorJobServiceObj.getAllAwsS3VectorJobsByFilterOptions(s3VectorFilterOptions);

    if (!s3VectorMatchingJobs?.jobs?.length) {
      global.logger.warn("No Jobs found in S3 Vector, so we are returning job details from gcp firestore as a fallback.", {
        requestedJobId: id,
        methodName: this.getJobByIdFromS3Vector.name,
      });

      // We are returning the job details from gcp firestore as a fallback if no jobs found in s3 vector
      return jobDetailsGcpFirestore as DbGcpFirestoreJobDto & {
        initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto
      };
    }

    const initialMatchingScoreDetails: AwsS3VectorJobMatchingScoreDto | undefined = s3VectorMatchingJobs.jobs.find(
      (s3VectorJob: AwsS3VectorJobMatchingScoreDto) => s3VectorJob.jobId === id
    );

    if(!initialMatchingScoreDetails) {
      // Initial matching score details not found
      global.logger.warn("Initial matching score details not found, so we are returning job details from gcp firestore as a fallback.", {
        requestedJobId: id,
        methodName: this.getJobByIdFromS3Vector.name,
      });

      // We are returning the job details from gcp firestore as a fallback, if initial matching score details not found from vector
      return jobDetailsGcpFirestore as DbGcpFirestoreJobDto & {
        initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto
      };
    }

    jobDetailsGcpFirestore.initialMatchingScoreDetails = initialMatchingScoreDetails;

    return jobDetailsGcpFirestore;
  }

  /**
   * @todo: Need to think aborting the bulk job update if any one of update in opensearch or dynamodb or aws s3 vector fails.
   */
  async updateBulkJob(
    validatedJobRequestBody: JobBulkUpdateApiDto
  ): Promise<JobBulkUpdateResponseDto> {
    global.logger.info("Bulk update job [Service]", {
      methodName: this.updateBulkJob.name,
      validatedJobRequestBody: validatedJobRequestBody,
    });

    // Retrieve job ids from all jobs and add to array
    const allJobIdsBeforeUpdate: string[] = validatedJobRequestBody.bulkJobUpdate.map((job: {
      companyId: string;
      jobId: string;
      status: JobStatusEnum;
    }) => job.jobId);

    // Get all Jobs before update
    const jobsDataBeforeUpdate: DbGcpFirestoreJobDto[] = await gcpFirestoreJobServiceObj.getJobsByIds(
      allJobIdsBeforeUpdate
    );

    const jobsMapBeforeUpdate: Map<string, DbGcpFirestoreJobDto> = new Map(jobsDataBeforeUpdate.map((eachJobBeforeUpdate: DbGcpFirestoreJobDto) => [eachJobBeforeUpdate.id, eachJobBeforeUpdate]));

    // Get action by user id
    const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

    let gcpFirestoreUpdateData: Partial<JobUpdateInternalDto> = {};
    let dynamodbUpdateData: Partial<CompanyJobCommonUpdateDto> = {};

    if (actionByUserId) {
      gcpFirestoreUpdateData.updatedByUserId = actionByUserId;
      dynamodbUpdateData.updatedByUserId = actionByUserId;
    } else {
      gcpFirestoreUpdateData.updatedByCorporateUserId = actionByCorporateUserId;
      dynamodbUpdateData.updatedByCorporateUserId = actionByCorporateUserId;
    }

    const gcpFirestoreResult: EntityBulkUpdateMetricDto = {
      success: { count: 0, primaryIds: [] },
      failure: { count: 0, primaryIds: [] },
    };

    const dynamodbResult: EntityBulkUpdateMetricDto = {
      success: { count: 0, primaryIds: [] },
      failure: { count: 0, primaryIds: [] },
    };

    let s3VectorJobIdsToDelete: string[] = [];
    let s3VectorJobsToCreate: AwsS3VectorJobCreateOrUpdateJobDataDto[] = [];
    const sitemapJobIdsToRemove: string[] = [];
    const sitemapJobsToAddOrUpdate: DbGcpFirestoreJobDto[] = [];

    // Process each job update
    for (const jobUpdate of validatedJobRequestBody.bulkJobUpdate) {
      const { companyId, jobId, status: newJobStatus } = jobUpdate;
      const gcpFirestoreJobBeforeUpdate: DbGcpFirestoreJobDto | undefined = jobsMapBeforeUpdate.get(jobId);

      // Prepare update data for gcpFirestore
      gcpFirestoreUpdateData.status = newJobStatus;

      // Prepare update data for DynamoDB
      dynamodbUpdateData.status = newJobStatus;

      try {
        // Update in gcpFirestore
        const gcpFirestoreResponse: DbGcpFirestoreJobDto | undefined =
          await gcpFirestoreJobServiceObj.updateJobById(jobId, gcpFirestoreUpdateData);

        if (gcpFirestoreResponse) {
          gcpFirestoreResult.success.count++;
          gcpFirestoreResult.success.primaryIds!.push(jobId);

          // Sitemap: remove when was PUBLISHED and now not (ARCHIVED/DRAFT)
          if (
            gcpFirestoreJobBeforeUpdate?.status === JobStatusEnum.PUBLISHED &&
            newJobStatus !== JobStatusEnum.PUBLISHED
          ) {
            sitemapJobIdsToRemove.push(jobId);
          }
          // Sitemap: add/update when now PUBLISHED
          if (newJobStatus === JobStatusEnum.PUBLISHED && !gcpFirestoreResponse.isDeleted) {
            sitemapJobsToAddOrUpdate.push(gcpFirestoreResponse);
          }
        } else {
          gcpFirestoreResult.failure.count++;
          gcpFirestoreResult.failure.primaryIds!.push(jobId);

          global.logger.error(`Failed to update jobId: ${jobId} in gcpFirestore`,{
            gcpFirestoreResponse
          });
        }
      } catch (error) {
        gcpFirestoreResult.failure.count++;
        gcpFirestoreResult.failure.primaryIds!.push(jobId);

        global.logger.error(`Failed to update jobId: ${jobId} in gcpFirestore`, {
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
          dynamodbResult.success.primaryIds!.push(jobId);

          const {
            jobTitle,
            location,
            department,
            salaryRange,
            experienceRange,
            otherRequirements,
            coreSkills,
            technicalSkills,
            miscellaneousSkills,
          } = updateResult;

          // If job status before update is not published and job status after update is published then prepare to bulk create job in aws s3 vector
          if(
            gcpFirestoreJobBeforeUpdate
            && gcpFirestoreJobBeforeUpdate.status !== JobStatusEnum.PUBLISHED
            && updateResult.status === JobStatusEnum.PUBLISHED
          ) {
            s3VectorJobsToCreate.push({
              _index: awsS3VectorJobServiceObj.getAwsS3VectorJobIndexName(),
              _id: jobId,
              _source: {
                id: jobId,
                jobTitle,
                location,
                department,
                salaryRange,
                coreSkills,
                technicalSkills,
                miscellaneousSkills,
                experienceRange,
                otherRequirements,
                companyName: gcpFirestoreJobBeforeUpdate.companyName,
              }
            })
          }
          // If job status before update is published and job status after update is not published then prepare to bulk delete job in aws s3 vector
          else if(
            gcpFirestoreJobBeforeUpdate
            && gcpFirestoreJobBeforeUpdate.status === JobStatusEnum.PUBLISHED
            && updateResult.status !== JobStatusEnum.PUBLISHED
          ) {
            s3VectorJobIdsToDelete.push(updateResult.id);
          }
        } else {
          dynamodbResult.failure.count++;
          dynamodbResult.failure.primaryIds!.push(jobId);

          global.logger.error(`Failed to update jobId: ${jobId} in DynamoDB`, {
            updateResult,
          });
        }
      } catch (error) {
        dynamodbResult.failure.count++;
        dynamodbResult.failure.primaryIds!.push(jobId);

        global.logger.error(`Failed to update job ${jobId} in DynamoDB:`, {
          error: error,
        });
      }
    }

    await Promise.all([
      awsS3VectorJobServiceObj.deleteBulkAwsS3VectorJobsByIds(
        s3VectorJobIdsToDelete
      ),

      awsS3VectorJobServiceObj.createBulkAwsS3VectorJobs({
        jobData: s3VectorJobsToCreate,
        indexName: awsS3VectorJobServiceObj.getAwsS3VectorJobIndexName(),
      })
    ]);

    await this.syncSitemapAfterBulkJobUpdate(
      sitemapJobIdsToRemove,
      sitemapJobsToAddOrUpdate
    );

    // Prepare the response
    const bulkJobUpdateResponse: JobBulkUpdateResponseDto = {
      gcpFirestoreBulkJobUpdateMetrics: gcpFirestoreResult,
      dynamodbBulkJobUpdateMetrics: dynamodbResult,
    };

    return bulkJobUpdateResponse;
  }

  async validateAndDeleteExpiredBrightDataJobs(
    deleteOlderThanDays: number,
    sourcedFrom: JobSourcedFromEnum
  ): Promise<boolean> {
    const deleteJobIds: string[] = await gcpFirestoreJobServiceObj.getAllOldExternalJobs(
      deleteOlderThanDays,
      sourcedFrom
    );

    global.logger.debug(`Received deleteJobIds: `, {
      deleteJobIdsLength: deleteJobIds.length
    });

    if(deleteJobIds?.length) {
      /**
       * @todo Need to think how to abort the transaction if any of the activity fails
       */
      const deleteActivities: [boolean, boolean] = await Promise.all([
        // Hard Delete old jobs
        gcpFirestoreJobServiceObj.deleteJobsByIds(
          deleteJobIds,
        ),
          
        awsS3VectorJobServiceObj.deleteBulkAwsS3VectorJobsByIds(
          deleteJobIds
        )
      ]);

      global.logger.debug(`Received deleteActivities: `, {
        deleteActivities
      });

      if(
        !deleteActivities[0] || 
        !deleteActivities[1]
      ) {
        return false;
      }

      return true;
    }

    global.logger.info(`No jobs to delete, so returning false.`);

    return false;
  }
}

const jobServiceObj: JobService = new JobService();
export {
  jobServiceObj,
  JobService
};