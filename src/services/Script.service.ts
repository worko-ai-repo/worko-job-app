
// Import opensearch constants
import {
  Search_RequestBody,
  Search_Response,
} from "@opensearch-project/opensearch/api";
import { Hit } from "@opensearch-project/opensearch/api/_types/_core.search";

// Import dynamoose types
import { ObjectType } from "dynamoose/dist/General";
import { Query, QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import aws-sdk related types
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError, Scheduler } from "aws-sdk";

// Import luxon
import { DateTime } from "luxon";

// Import constants
import { awsOpensearchLibrary, awsSchedulerClientLibrary } from "../configs/aws-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";
import { BRIGHT_DATA_JOB_APP_CONSTANTS } from "../configs/constants/BrightDataJob.constant";

// Import daos
import { jobDaoObj } from "../daos/Job.dao";

// Import dtos
import {
  ScriptCompanyJobBulkUploadDto,
} from "../dtos/CompanyJob.dto";
import { UserJobApplicationBulkUploadDto } from "../dtos/UserJobApplication.dto";
import { JobLocationDto, PaginatedResultsWithMatchingConditionsResponse, RecordListingFilterOptions } from "../dtos/Common.dto";

// Import daos
import { companyJobDaoObj } from "../daos/CompanyJob.dao";
import { userJobApplicationDao } from "../daos/UserJobApplication.dao";

// Import enums
import { JobSourcedFromEnum } from "../enums/Common.enum";

// Import models
import { DbCompanyDetailDto } from "../db/models/CompanyDetail.model";
import { DbUserJobApplicationDto, UserJobApplicationModel } from "../db/models/UserJobApplication.model";

// Import helpers
import { getPaginatedResultsWithMatchingConditions } from "../helpers/dynamoose.helper";
import { attachCompanyDetails } from "../helpers/companyDetailsInjector.helper";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { CompanyJobModel, DbCompanyJobDto } from "../db/models/CompanyJob.model";

// Import services
import { companyJobServiceObj } from "./CompanyJob.service";
import { jobServiceObj } from "./Job.service";
import { userJobApplicationServiceObj } from "./UserJobApplication.service";
import { fantasticJobServiceObj } from "./FantasticJob.service";
import { brightDataJobServiceObj } from "./BrightDataJob.service";

// Import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError } from "../utils/errors.util";
import ErrorCodeName from "../utils/error-code-name.util";

/**
 * ScriptService
 *
 * Service for handling script-related operations related to updating GSI attributes.
 */
class ScriptService {
  /**
   * scriptScheduleJobExternalJobApi
   *
   * Script to schedule job for external job api
   *
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the scheduled job was created successfully.
   */
  async scriptScheduleJobExternalJobApi(): Promise<boolean> {
    global.logger.info(
      `Script to schedule job for external job api [Script Service]`
    );

    return brightDataJobServiceObj.validateAndCreateBrightDataSnapshot();
  }

  /**
   * Transforms the DbCompanyJobDto to DbJobAwsOpensearchDto.
   *
   * This function is used to transform the DbCompanyJobDto (from `worko` dynamodb table) to DbJobAwsOpensearchDto (to `worko-jobs` index in`opensearch`)
   * by converting `createdAt` and `updatedAt` from timestampts to iso date format
   * and removing PK, SK, GSI1PK, GSI1SK from the data.
   *
   * @param {DbCompanyJobDto} internalJob - The DbCompanyJobDto that needs to be transformed.
   * @returns {DbJobAwsOpensearchDto} - The transformed DbJobAwsOpensearchDto.
   */
  private transformCompanyJobDtoToOpensearchWorkoJobsDto(
    internalJob: any
  ): DbJobAwsOpensearchDto {
    /**
     * 1. `createdAt`, `updatedAt` from timestampts to iso date format.
     * 2. remove PK, SK, GSI1PK, GSI1SK from the data.
     */
    const {
      PK,
      SK,
      GSI1PK,
      GSI1SK,
      mislaneiousSkills = undefined,
      miscellaneousSkills = undefined,
      location,
      companyDetails,
      ...restInternalJob
    } = internalJob;

    const locationData: JobLocationDto = {
      city: typeof location === "string" ? [location] : location.city,
      state: typeof location === "string" ? [] : location.state,
      country: typeof location === "string" ? [] : location.country,
      fullLocation: typeof location === "string" ? [location] : location.fullLocation,
    };

    const dbJobDto: DbJobAwsOpensearchDto = {
      ...restInternalJob,
      sourcedFrom: JobSourcedFromEnum.WORKO,
      createdAt: internalJob.createdAt,
      updatedAt: internalJob.updatedAt,
      miscellaneousSkills: mislaneiousSkills || miscellaneousSkills,
      jobUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_INTERNAL_JOB_URL.strtr({
        "{companyName}":
          companyDetails !== undefined
            ? companyDetails?.name.split(" ").join("_")
            : "WORKO_10", // Sample Ex:- "TEST WORKO 4.0" to "TEST_WORKO_4.0",
        "{jobId}": restInternalJob.id,
      }),
      companyName:
        companyDetails !== undefined ? companyDetails?.name : "WORKO_10",
      location: locationData,
    };

    return dbJobDto;
  }

  /**
   * scriptWorkoDdbToWorkoJobsOpensearch
   *
   * Script to transfer data from worko-ddb to worko-jobs-opensearch.
   *
   * 1. Get the data from worko-ddb without pagination till the data is available.
   * 2. Prepare the data by transforming DbCompanyJobDto to DbJobAwsOpensearchDto.
   * 3. Use bulk opensearch method to upload the data to `worko-jobs` index in opensearch.
   *
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the data was uploaded successfully.
   */
  async scriptWorkoDdbToWorkoJobsOpensearch(jobListingArray:any[]) {
    // logger
    global.logger.info(
      `Script to transfer data from worko-ddb to worko-jobs-opensearch [Script Service]`,
      {
        filePath: __filename,
        methodName: this.scriptWorkoDdbToWorkoJobsOpensearch.name,
      }
    );

    /**
     * Prepare the data by Iterating over each item and update few items like:
     *   1. `createdAt`, `updatedAt` from timestampts to iso date format.
     *   2. remove PK, SK, GSI1PK, GSI1SK from the data.
     *   3. While iterating here only, you need to use flatMap to prepare data for bulk opensearch.
     */
    const formattedJobListingArray: (
      | DbJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[] = jobListingArray.flatMap((eachInternalJob: any) => [
      {
        index: { _index: jobDaoObj.IndexName, _id: eachInternalJob.id },
      },
      this.transformCompanyJobDtoToOpensearchWorkoJobsDto(eachInternalJob),
    ]);

    /**
     * Use bulk opensearch method to upload the data to `worko-jobs` index in opensearch
     */
    const bulkUploadJobsDetails: boolean =
      await jobServiceObj.scriptBulkUploadJobs(formattedJobListingArray);

    return bulkUploadJobsDetails;
  }

  prepareDataToUploadInternalJobsWorkoDdbToWorkoJobAppDdb(internalJob: any) {
    const {
      mislaneiousSkills = undefined,
      miscellaneousSkills = undefined,
      location,
      companyDetails,
      ...eachInternalJob
    } = internalJob;

    const createdAtConvertedToMillis: number = DateTime.fromISO(
      eachInternalJob.createdAt
    ).toMillis();
    const updatedAtConvertedToMillis: number = DateTime.fromISO(
      eachInternalJob.updatedAt
    ).toMillis();

    const transformedData: ScriptCompanyJobBulkUploadDto = {
      createdAt: createdAtConvertedToMillis,
      updatedAt: updatedAtConvertedToMillis,
      PK: eachInternalJob.PK,
      SK: eachInternalJob.SK,
      GSI1PK: eachInternalJob.GSI1PK,
      GSI1SK: eachInternalJob.GSI1SK,
      id: eachInternalJob.id,
      companyId: eachInternalJob.companyId,
      createdByCorporateUserId: eachInternalJob.createdByCorporateUserId,
      updatedByCorporateUserId: eachInternalJob.updatedByCorporateUserId,
      createdByUserId: eachInternalJob.createdByCorporateUserId,
      updatedByUserId: eachInternalJob.updatedByUserId,
      coreSkills: eachInternalJob.coreSkills,
      department: eachInternalJob.department,
      experienceRange: eachInternalJob.experienceRange,
      jobTitle: eachInternalJob.jobTitle,
      jobDescription: eachInternalJob.jobDescription,
      jobUrl: APP_CONSTANTS.FRONTEND_URLS.WORKO_INTERNAL_JOB_URL.strtr({
        "{companyName}":
          companyDetails !== undefined
            ? companyDetails?.name.split(" ").join("_")
            : "WORKO_10", // Sample Ex:- "TEST WORKO 4.0" to "TEST_WORKO_4.0"
        "{jobId}": eachInternalJob.id,
      }),
      location: {
        city: [location],
        fullLocation: [location],
      },
      miscellaneousSkills: miscellaneousSkills || mislaneiousSkills,
      noticePeriod: eachInternalJob.noticePeriod,
      numOfOpenings: eachInternalJob.numOfOpenings,
      otherRequirements: eachInternalJob.otherRequirements,
      salaryRange: eachInternalJob.salaryRange,
      softSkills: eachInternalJob.softSkills,
      status: eachInternalJob.status,
      technicalSkills: eachInternalJob.technicalSkills,
      typeofEmployment: eachInternalJob.typeofEmployment,
      workMode: eachInternalJob.workMode,
      isDeleted: eachInternalJob.isDeleted,
    };

    return transformedData;
  }

  prepareDataToUploadInternalUserJobApplicationsWorkoDdbToWorkoJobAppDdb(
    internalUserJobApplication: any
  ) {
    const createdAtConvertedToMillis: number = DateTime.fromISO(
      internalUserJobApplication.createdAt
    ).toMillis();
    const updatedAtConvertedToMillis: number = DateTime.fromISO(
      internalUserJobApplication.updatedAt
    ).toMillis();

    const transformedData: UserJobApplicationBulkUploadDto = {
      createdAt: createdAtConvertedToMillis,
      updatedAt: updatedAtConvertedToMillis,
      PK: internalUserJobApplication.PK,
      SK: internalUserJobApplication.SK,
      id: internalUserJobApplication.id,
      GSI1PK: internalUserJobApplication.GSI1PK,
      GSI1SK: internalUserJobApplication.GSI1SK,
      GSI2PK: internalUserJobApplication.GSI2PK,
      GSI2SK: internalUserJobApplication.GSI2SK,
      companyId: internalUserJobApplication.companyId,
      jobId: internalUserJobApplication.jobId,
      status: internalUserJobApplication.status,
      statusTracker: internalUserJobApplication.statusTracker,
      companyName: internalUserJobApplication.companyName,
      jobPortal: internalUserJobApplication.jobPortal,
      rejectedByUserId: internalUserJobApplication.rejectedByUserId,
      followUpRequest: internalUserJobApplication.followUpRequest,
      cvExtract: internalUserJobApplication.cvExtract,
      jdMatchErrorCode: internalUserJobApplication.jdMatchErrorCode,
      jdMatchErrorDesc: internalUserJobApplication.jdMatchErrorDesc,
      matchingScore: internalUserJobApplication.matchingScore,
      rejectionFeedbackBySystem:
        internalUserJobApplication.rejectionFeedbackBySystem,
      scoreDetails: internalUserJobApplication.scoreDetails,
      scoreFetchedDate: internalUserJobApplication.scoreFetchedDate,
    };

    return transformedData;
  }

  async scriptInternalJobsWorkoDdbToWorkoJobAppDdb(jobListingArray: any[]) {
    global.logger.info(
      `Script to transfer internal jobs from worko-ddb to worko-job-app-ddb [Script Service]`,
      {
        filePath: __filename,
        methodName: this.scriptInternalJobsWorkoDdbToWorkoJobAppDdb.name,
        length: jobListingArray.length,
        singleItem: jobListingArray[0],
      }
    );

    const formattedJobListingArray: ScriptCompanyJobBulkUploadDto[] =
      jobListingArray.map((eachInternalJob) =>
        this.prepareDataToUploadInternalJobsWorkoDdbToWorkoJobAppDdb(
          eachInternalJob
        )
      );

    /**
     * Initialize chunk size
     *
     * The chunk size is initialized to 20, which is the maximum number of items that can be stored in a single call to batchPut.
     * In a single call to batchPut, up to 25 items can be put operations.
     */
    const jobsChunkSize: number = 20;

    // Chunk the data into groups of 20
    const jobsChunks: ScriptCompanyJobBulkUploadDto[][] = [];

    // Iterate and create chunks using chunk size of 20
    for (let i = 0; i < formattedJobListingArray.length; i += jobsChunkSize) {
      /**
       * The slice() method returns selected elements in an array, as a new array.
       * The slice() method selects from a given start, up to a (not inclusive) given end.
       * The slice() method does not change the original array.
       */
      jobsChunks.push(formattedJobListingArray.slice(i, i + jobsChunkSize));
    }

    // Process each chunk
    const unprocessedItems: ObjectType[] = [];
    for (const eachJobsChunk of jobsChunks) {
      // Create Each Corporate Bulk Jd Resumes Chunk in Database
      const jobsCreateResponse: {
        unprocessedItems: ObjectType[];
      } = await companyJobServiceObj.scriptCopyCompanyJobsFromWorkoToJobTable(
        eachJobsChunk
      );

      /**
       * If there are any unprocessed items, add them to the unprocessedItems array,
       * `unprocessedItems` means that the item that are failed to be stored in the database using batch put operation of dynamoose
       */
      if (jobsCreateResponse.unprocessedItems?.length) {
        unprocessedItems.push(...jobsCreateResponse.unprocessedItems);
      }
    }

    return unprocessedItems;
  }

  async scriptInternalUserJobApplicationsWorkoDdbToWorkoJobAppDdb(
    requestBody: any
  ) {
    // log
    global.logger.info(
      `Script to transfer internal user job applications from worko-ddb to worko-job-app-ddb [Script Service]`,
      {
        filePath: __filename,
        methodName: this.scriptWorkoDdbToWorkoJobsOpensearch.name,
      }
    );

    const formattedUserJobApplicationListingArray: UserJobApplicationBulkUploadDto[] =
      requestBody.map((eachInternalUserJobApplication: any) =>
        this.prepareDataToUploadInternalUserJobApplicationsWorkoDdbToWorkoJobAppDdb(
          eachInternalUserJobApplication
        )
      );

    /**
     * Initialize chunk size
     *
     * The chunk size is initialized to 20, which is the maximum number of items that can be stored in a single call to batchPut.
     * In a single call to batchPut, up to 25 items can be put operations.
     */
    const jobApplicationChunkSize: number = 20;

    // Chunk the data into groups of 20
    const jobApplicationChunks: UserJobApplicationBulkUploadDto[][] = [];

    // Iterate and create chunks using chunk size of 20
    for (
      let i = 0;
      i < formattedUserJobApplicationListingArray.length;
      i += jobApplicationChunkSize
    ) {
      /**
       * The slice() method returns selected elements in an array, as a new array.
       * The slice() method selects from a given start, up to a (not inclusive) given end.
       * The slice() method does not change the original array.
       */
      jobApplicationChunks.push(
        formattedUserJobApplicationListingArray.slice(
          i,
          i + jobApplicationChunkSize
        )
      );
    }

    // Process each chunk
    const unprocessedItems: ObjectType[] = [];
    for (const eachJobApplicationChunk of jobApplicationChunks) {
      // Create Each Corporate Bulk Jd Resumes Chunk in Database
      const jobApplicationCreateResponse: {
        unprocessedItems: ObjectType[];
      } =
        await userJobApplicationServiceObj.scriptBatchCreateUserJobApplications(
          eachJobApplicationChunk
        );
      global.logger.info(`Inside iterating each chunk [Script Service]`, {
        jobsCreateResponse: jobApplicationCreateResponse,
      });

      /**
       * If there are any unprocessed items, add them to the unprocessedItems array,
       * `unprocessedItems` means that the item that are failed to be stored in the database using batch put operation of dynamoose
       */
      if (jobApplicationCreateResponse.unprocessedItems?.length) {
        unprocessedItems.push(...jobApplicationCreateResponse.unprocessedItems);
      }
    }

    return unprocessedItems;
  }

  async scriptGetAwsScheduleById(id: string): Promise<PromiseResult<Scheduler.GetScheduleOutput, AWSError>> {
    const getResponse: PromiseResult<Scheduler.GetScheduleOutput, AWSError> = await awsSchedulerClientLibrary.getScheduleById({ Name: id });
    global.logger.info(
      `Get Schedule Job [Script Service]`,
      {
        methodName: this.scriptGetAwsScheduleById.name,
        getResponse,
      }
    )

    return getResponse;
  };


  async scriptDeleteAwsScheduleById(id: string): Promise<PromiseResult<Scheduler.DeleteScheduleOutput, AWSError>> {
    const deleteResponse: PromiseResult<Scheduler.DeleteScheduleOutput, AWSError> = await awsSchedulerClientLibrary.deleteSchedule({ Name: id });
    global.logger.info(
      `Delete Schedule Job [Script Service]`,
      {
        methodName: this.scriptDeleteAwsScheduleById.name,
        deleteResponse,
      }
    )

    return deleteResponse;
  };

  /**
   * scriptToUploadBatchInferenceFilesToS3
   *
   * This is a script to retrieve fantastic jobs and perform batch inference on them
   *
   * @returns {Promise<boolean>} - A promise that resolves to true if the batch inference files were uploaded to S3 successfully.
   */
  async scriptToUploadBatchInferenceFilesToS3(): Promise<boolean> {
    // log
    global.logger.info(
      `Script to upload batch inference files to s3 [Script Service]`,
      {
        filePath: __filename,
        methodName: this.scriptToUploadBatchInferenceFilesToS3.name,
      }
    );

    return fantasticJobServiceObj.initializeTwentyFourHourJobLog();
  }

  /**
   * scriptToRevertInternalJobsToOpensearch
   *
   * Script to revert internal jobs to opensearch
   *
   * @authorisedRoles ["admin"]
   * @returns {Promise<boolean>} A promise that resolves to true if the fantastic jobs were uploaded successfully.
   */
  async scriptToRevertInternalJobsToOpensearch(): Promise<boolean> {
    // Construct the AWS OpenSearch query based on the filter options
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        bool: {
          must: [
            {
              exists: {
                field: "companyId",
              },
            },
          ],
        },
      },
      _source: false, // Only fetch IDs, not the full documents
      size: 500,
    };
    const companyJobsOnOpensearch: Search_Response =
      await awsOpensearchLibrary.opensearchClient.search({
        index: jobDaoObj.IndexName,
        body: awsOpensearchQuery,
      });

    // extract `id` attributes from the search results
    const companyJobIdsOnOpensearch: string[] =
      companyJobsOnOpensearch.body.hits.hits.map((hit: Hit) => hit._id);

    global.logger.debug("companyJobIdsOnOpensearch", {
      length: companyJobIdsOnOpensearch.length,
    });

    const EXCLUDED_JOB_IDS: Set<string> = new Set(companyJobIdsOnOpensearch);

    let query: Query<DbCompanyJobDto> = CompanyJobModel.query("GSI1PK")
      .eq(companyJobDaoObj.GSI1PK)
      .where("GSI1SK")
      .beginsWith(companyJobDaoObj.GSI1SK.strtr({ "{id}": "" }));

    const requestBody: RecordListingFilterOptions = {
      pageSize: 500,
    };

    const totalCompanyJobs: PaginatedResultsWithMatchingConditionsResponse<DbCompanyJobDto> =
      await getPaginatedResultsWithMatchingConditions<
        DbCompanyJobDto,
        RecordListingFilterOptions
      >(query, requestBody);

    // Extract referrals data
    const { lastKey, count, timesQueried, queriedCount, ...companyJobsData } =
      totalCompanyJobs;

    // Convert to array
    const companyJobArray: DbCompanyJobDto[] = Object.values(companyJobsData);

    const filteredJobs: DbCompanyJobDto[] = companyJobArray.filter(
      (item: DbCompanyJobDto) => !EXCLUDED_JOB_IDS.has(item.id)
    );

    global.logger.debug("filteredJobs", {
      length: filteredJobs.length,
    });

    // Only attach company details if there are jobs to process
    if (filteredJobs.length === 0) {
      global.logger.info("No new jobs to add to OpenSearch");
      return true;
    }

    // Attach company details
    const jobsWithCompanyDetails: (DbCompanyJobDto & {
      companyDetails: DbCompanyDetailDto | undefined;
    })[] = await attachCompanyDetails<DbCompanyJobDto>(filteredJobs);

    global.logger.debug("jobsWithCompanyDetails", {
      length: jobsWithCompanyDetails.length,
    });

    return this.scriptWorkoDdbToWorkoJobsOpensearch(jobsWithCompanyDetails);
  }

  async scriptToAddGsi3ToJobApplications(): Promise<{ totalUpdatedCount: number }> {
    // log
    global.logger.info(
      `Script to add gsi3 to job applications [Script Service]`,
      {
        methodName: this.scriptToAddGsi3ToJobApplications.name,
      }
    );

    let lastKey: ObjectType | undefined;
    let totalUpdatedCount: number = 0;

    do {
      let result: ObjectType[] = [];
      let resultQueryResponse = {} as QueryResponse<DbUserJobApplicationDto>;

      // Retry logic for query with exponential backoff
      let queryRetries: number = 0;
      const maxQueryRetries: number = 4;
      let retrievedSuccess: boolean = false;

      while (queryRetries < maxQueryRetries && !retrievedSuccess) {
        try {
          let query: Query<DbUserJobApplicationDto> = UserJobApplicationModel.query("GSI2PK")
            .eq(userJobApplicationDao.GSI2PK)
            .where("GSI2SK")
            .beginsWith("ID#");

          if (lastKey) {
            query = query.startAt(lastKey);
          }

          resultQueryResponse = await query.exec();
          result = resultQueryResponse.toJSON();

          retrievedSuccess = true;
        } catch (error: any) {
          if (
            error.name ===
              ErrorCodeName.PROVISIONED_THROUGHPUT_EXCEEDED_EXCEPTION &&
            queryRetries < maxQueryRetries
          ) {
            queryRetries++;
            const delay: number = Math.pow(2, queryRetries) * 1000; // Exponential backoff
            global.logger.warn(
              `Query throttled, retrying in ${delay}ms (attempt ${queryRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            global.logger.error(`Error retrieving job application details`, {
              error,
              methodName: this.scriptToAddGsi3ToJobApplications.name,
            });

            throw new BaseError(
              "Error retrieving job application details",
              HttpStatusCode.INTERNAL_SERVER_ERROR_500
            );
          }
        }
      }

      if (!retrievedSuccess) {
        global.logger.error(
          `Failed to retrieve job application details after ${maxQueryRetries} retries`,
        );
        throw new BaseError(
          "Failed to retrieve job application details",
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }

      // Process the results with retry logic for updates
      for (const jobApplication of result) {
        try {
          // Skip if already updated
          if (
            jobApplication?.GSI3PK &&
            jobApplication?.GSI3SK 
          ) {
            totalUpdatedCount++;
            continue;
          }

          // Retry logic for update with exponential backoff
          let updateRetries: number = 0;
          const maxUpdateRetries: number = 4;
          let updateSuccess: boolean = false;

          while (updateRetries < maxUpdateRetries && !updateSuccess) {
            try {
              const updatedJobApplicationDetail: DbUserJobApplicationDto =
                await UserJobApplicationModel.update(
                  { PK: jobApplication.PK, SK: jobApplication.SK },
                  {
                    GSI3PK: userJobApplicationDao.GSI3PK.strtr({
                      "{jobId}": jobApplication.jobId,
                    }),
                    GSI3SK: userJobApplicationDao.GSI3SK.strtr({
                      "{id}": jobApplication.id,
                    }),
                  }
                );

              if (updatedJobApplicationDetail?.id) {
                updateSuccess = true;
                totalUpdatedCount++;
              }
            } catch (updateError: any) {
              if (
                updateError.name ===
                  ErrorCodeName.PROVISIONED_THROUGHPUT_EXCEEDED_EXCEPTION &&
                updateRetries < maxUpdateRetries
              ) {
                global.logger.warn(
                  `Update throttled for user job application ${jobApplication.PK}`
                );
                updateRetries++;
                const delay: number = Math.pow(2, updateRetries) * 1000; // Exponential backoff
                global.logger.warn(
                  `Update throttled for user job application ${jobApplication.PK}, retrying in ${delay}ms (attempt ${updateRetries})`
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
              } else {
                global.logger.error(
                  `Other Error while updating user job application: ${jobApplication.PK}`,
                  {
                    error: updateError,
                  }
                );
                updateRetries = maxUpdateRetries;
              }
            }

            if (!updateSuccess) {
              global.logger.warn(
                `Max retries reached for user job application ${jobApplication.PK}`
              );
            }
          }
        } catch (error) {
          global.logger.error(
            `Failed to update user job application with PK: ${jobApplication.PK} at main catch block`,
            {
              error,
            }
          );
        }
      }

      lastKey = resultQueryResponse.lastKey;

      // Add delay between pages to avoid overwhelming DynamoDB
      if (lastKey) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } while (lastKey);

    return {
      totalUpdatedCount,
    };
  }
}

// Export the ScriptService class and its instance
const scriptServiceObj = new ScriptService();
export { scriptServiceObj, ScriptService };
