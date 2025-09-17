
// Import aws lambda related libraries
import { APIGatewayProxyResult } from "aws-lambda";

// Import luxon
import { DateTime } from "luxon";

// Import daos
import { userMatchingScoreJobDaoObj } from "../daos/UserMatchingScoreJob.dao";

// Import dtos
import {
  UserMatchingScoreJobListingFilterOptions,
  UserMatchingScoreJobUpdateApiDTO,
  UserMatchingScoreJobUpdateDto,
} from "../dtos/UserMatchingScoreJob.dto";
import { AwsOpensearchRecordListingResponseDTO } from "../dtos/Common.aws-opensearch.dto";

// Import models
import { DbUserMatchingScoreJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchUserMatchingScoreJob.model";

// Import services
import InvokeLambdaService from "../services/InvokeLambda.service";
import UlidService from "./Ulid.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * UserMatchingScoreJobService
 *
 * Service for handling user matching score job-related operations
 */
class UserMatchingScoreJobService {
  /**
   * getUserMatchingScoreJobByUserIdAndJobId
   *
   * Retrieves the matching score for the user with the specified "userId" and job with the specified "jobId".
   *
   * @param {string} userId - The user ID.
   * @param {string} jobId - The job ID.
   * @returns {Promise<DbUserMatchingScoreJobAwsOpensearchDto | undefined>} A promise that resolves to the matching score of the user
   */
  async getUserMatchingScoreJobByUserIdAndJobId(
    userId: string,
    jobId: string
  ): Promise<DbUserMatchingScoreJobAwsOpensearchDto | undefined> {
    global.logger.info(
      `Get user matching score by userId and jobId [SERVICE]`,
      {
        methodName: this.getUserMatchingScoreJobByUserIdAndJobId.name,
        userId: userId,
        jobId: jobId,
      }
    );

    return userMatchingScoreJobDaoObj.getUserMatchingScoreJobByUserIdAndJobId(
      userId,
      jobId
    );
  }

  /**
   * getAllUserMatchingScoreJobByUserId
   *
   * Retrieves the all user matching scores for the user with the specified "userId" and list of jobIds.
   *
   * @param {UserMatchingScoreJobListingFilterOptions} userMatchingScoreJobRequestOptions - The filter options for retrieving the user matching scores.
   * @returns {Promise<AwsOpensearchRecordListingResponseDTO<DbUserMatchingScoreJobAwsOpensearchDto[]>>} A promise that resolves to the list of matching scores of the user.
   */
  async getAllUserMatchingScoreJobByUserId(
    userMatchingScoreJobRequestOptions: UserMatchingScoreJobListingFilterOptions
  ): Promise<
    AwsOpensearchRecordListingResponseDTO<
      DbUserMatchingScoreJobAwsOpensearchDto[]
    >
  > {
    global.logger.info(
      `Get all user matching score by userId and list of jobIds [SERVICE]`,
      {
        methodName: this.getAllUserMatchingScoreJobByUserId.name,
      }
    );

    return userMatchingScoreJobDaoObj.getAllUserMatchingScoreJobByUserId(
      userMatchingScoreJobRequestOptions
    );
  }

  /**
   * updateUserMatchingScoreJobById
   *
   * Updates a user matching score job by its ID.
   *
   * @param {string} id - The ID of the user matching score job to update.
   * @param {UserMatchingScoreJobUpdateDto} updateUserMatchingScoreJob - The user matching score job object with the updated details.
   */
  async updateUserMatchingScoreJobById(
    id: string,
    updateUserMatchingScoreJob: UserMatchingScoreJobUpdateDto
  ) {
    global.logger.info(`Update user matching score by id [SERVICE]`, {
      methodName: this.updateUserMatchingScoreJobById.name,
      id,
    });

    return userMatchingScoreJobDaoObj.updateUserMatchingScoreJobById(
      id,
      updateUserMatchingScoreJob
    );
  }

  /**
   * invokeLambdaToMatchUserResumeWithJobsAndJds
   *
   * Invokes the AWS Lambda function to update the user matching score job by userId and list of jobIds.
   *
   * @param {string} userId - The ID of the user for whom the matching score jobs are being updated.
   * @param {string[]} jobIds - The array of jobIds for which the user matching score jobs are being updated.
   * @returns {Promise<boolean>} A promise that resolves to `true` if all the lambda function invocations are completed, `false` otherwise.
   */
  async invokeLambdaToMatchUserResumeWithJobsAndJds(
    userId: string,
    jobIds: string[]
  ): Promise<boolean> {
    global.logger.info(
      `Invoking lambda for all user matching score job by userId and list of jobIds [SERVICE]`,
      {
        methodName: this.invokeLambdaToMatchUserResumeWithJobsAndJds.name,
        userId: userId,
        jobIds: jobIds,
      }
    );

    /**
     * Iterate over the filtered jobIds array and invoke the lambda function with each (`filteredJobId` and `userId`) as parameter
     * Await for all the lambda function invocations
     *
     * @todo: We are not sure whether all the lambda function invocations are completed or not,
     *        We need to handle the case where some of the lambda function invocations fail.
     */
    const invokeLambdaArray: APIGatewayProxyResult[] = await Promise.all(
      jobIds.map((eachJobId: string) => {
        return InvokeLambdaService.triggerLambdaToMatchUserResumeWithJobAndJd(
          userId,
          eachJobId
        );
      })
    );

    // If the number of lambda function invocations is less than the number of jobIds, then return false
    if (invokeLambdaArray.length < jobIds.length) {
      global.logger.error(
        `Some of the lambda function invocations failed [SERVICE]`,
        {
          methodName: this.invokeLambdaToMatchUserResumeWithJobsAndJds.name,
          userId: userId,
          jobIds: jobIds,
          invokedLambdaResultsLength: invokeLambdaArray.length,
        }
      );

      return false;
    }

    return true;
  }

  /**
   * bulkCreateUserMatchingScoreJobWithJobIds
   *
   * Bulk indexes the user matching score jobs to the OpenSearch index with the given userId and list of jobIds.
   *
   * This asynchronous method sends a bulk request to the OpenSearch client
   * to perform index actions, which create a document if it doesn’t exist
   * and replace it if it does. Each operation in the `bulkData` array can
   * either be a new user matching score job entry or an index action with
   * metadata specifying the job's index and ID.
   *
   * The method returns a promise that resolves to an array of user matching score job documents
   * if all operations in the bulk request succeed, or rejects with an error if any operation fails.
   *
   * @param {string} userId - The ID of the user for whom the user matching score jobs are being created.
   * @param {string[]} jobIds - The array of jobIds for which the user matching score jobs are being created.
   * @param {boolean} [invokeLambdaToMatchUserResumeWithJobsAndJds=true] - Whether to invoke the lambda function to update the user matching scores after creating the documents.
   *
   * @returns {Promise<DbUserMatchingScoreJobAwsOpensearchDto[]>} - A promise that resolves to an array of user matching score job documents
   * if all operations in the bulk request succeed, or rejects with an error if any operation fails.
   */
  async bulkCreateUserMatchingScoreJobWithJobIds(
    userId: string,
    jobIds: string[],
    invokeLambdaToMatchUserResumeWithJobsAndJds: boolean = true
  ): Promise<DbUserMatchingScoreJobAwsOpensearchDto[]> {
    global.logger.info(
      `Bulk index user matching score job with jobIds [SERVICE]`,
      {
        userId: userId,
        methodName: this.bulkCreateUserMatchingScoreJobWithJobIds.name,
      }
    );
    // Define the batch size
    const batchSize = 500;

    let bulkFinalResult: DbUserMatchingScoreJobAwsOpensearchDto[] = [];

    // Split the jobIds into chunks of 500
    for (let i = 0; i < jobIds.length; i += batchSize) {
      const batch: string[] = jobIds.slice(i, i + batchSize);

      // Transform the batch into the format required by the bulk API
      // The | symbol in TypeScript represents a union type.
      const bulkData: (
        | DbUserMatchingScoreJobAwsOpensearchDto
        | {
            index: {
              _index: string;
              _id: string;
            };
          }
      )[] = batch.flatMap((eachJobId: string) => {
        // Generate a unique ID
        const ulidId: string = UlidService.getUlidId();

        // Prepare the data required to create a new user matching score job
        const newUserMatchingScoreJob: DbUserMatchingScoreJobAwsOpensearchDto =
          {
            id: ulidId,
            createdAt: DateTime.now().toISO(),
            updatedAt: DateTime.now().toISO(),
            userId: userId,
            jobId: eachJobId,

            /**
             * We are marking the user matching score job as triggered
             * before triggering the lambda function
             *
             * @todo: Need to find ideal way without disturbing old data on production by discussing with team lead.
             */
            isTriggered: true,
          };

        bulkFinalResult.push(newUserMatchingScoreJob);

        return [
          {
            index: {
              _index: userMatchingScoreJobDaoObj.IndexName,
              _id: ulidId,
            },
          },
          newUserMatchingScoreJob,
        ];
      });

      // Bulk index the current batch of user matching score jobs
      const success: boolean =
        await userMatchingScoreJobDaoObj.bulkCreateUserMatchingScoreJobWithJobIds(
          bulkData
        );

      // If any batch fails, return false
      if (!success) {
        throw new BaseError(
          `Failed to create new user matching scores documents for the list of jobs.`,
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }
    }

    // Trigger the lambda function for the jobIds if required
    if (invokeLambdaToMatchUserResumeWithJobsAndJds) {
      // Invoke the lambda function for the jobIds
      await this.invokeLambdaToMatchUserResumeWithJobsAndJds(userId, jobIds);
    }

    return bulkFinalResult;
  }

  /**
   * createAllUserMatchingScoreJobByUserId
   *
   * This service is responsible for creating the "UserMatchingScoreJob" model
   * for a specific "userId" and list of "jobIds". It also handles the case
   * if the user matching scores are already present in the database and
   * retrieves the existing matching scores and returns the same.
   *
   * @param {string} userId - The ID of the user for whom the matching scores are being retrieved.
   * @param {UserMatchingScoreJobUpdateApiDTO} requestBody - The request body containing the list of job IDs.
   * @returns {Promise<AwsOpensearchRecordListingResponseDTO<DbUserMatchingScoreJobAwsOpensearchDto[]>>} A promise that resolves to the list of matching scores of the user.
   */
  async createAllUserMatchingScoreJobByUserId(
    userId: string,
    requestBody: UserMatchingScoreJobUpdateApiDTO
  ): Promise<
    AwsOpensearchRecordListingResponseDTO<
      DbUserMatchingScoreJobAwsOpensearchDto[]
    >
  > {
    global.logger.info(
      `Update all user matching scores by userId for list of job ids [SERVICE]`,
      {
        methodName: this.createAllUserMatchingScoreJobByUserId.name,
        userId,
        requestBody,
      }
    );

    // Initailize request job ids and requested page size
    const requestedJobIds: string[] = requestBody.jobIds;
    const requestedPageSize: number = requestedJobIds.length;

    // Prepare filter options to retrieve existing user matching scores for list of job ids
    const filterOptions: UserMatchingScoreJobListingFilterOptions = {
      userId: userId,
      jobIds: requestedJobIds,
      pageSize: requestedPageSize,
    };

    // retrieve existing user matching scores for list of job ids
    const existingScoresResponse: AwsOpensearchRecordListingResponseDTO<
      DbUserMatchingScoreJobAwsOpensearchDto[]
    > = await userMatchingScoreJobDaoObj.getAllUserMatchingScoreJobByUserId(
      filterOptions
    );

    // Parsed existing user matching scores for list of job ids
    const existingMatchingScoresData: DbUserMatchingScoreJobAwsOpensearchDto[] =
      existingScoresResponse.data;

    // Initialize missing Job Ids
    let missingJobIds: string[];

    // If existing user matching scores are not present then all the requested job ids are new
    if (existingScoresResponse.data.length === 0) {
      missingJobIds = requestedJobIds;
    }
    // If existing user matching scores and requested job ids length are same then there are no missing job ids
    else if (existingScoresResponse.data.length === requestedJobIds.length) {
      missingJobIds = [];
    }
    // If few are existing user matching scores and few are missing job ids then retrieve only missing job ids
    else {
      const existingJobIdSet: Set<string> = new Set(
        existingMatchingScoresData.map(
          (score: DbUserMatchingScoreJobAwsOpensearchDto) => score.jobId
        )
      );

      missingJobIds = requestedJobIds.filter(
        (jobId: string) => !existingJobIdSet.has(jobId)
      );
    }

    global.logger.debug(`missingJobIds:`, { missingJobIds });

    const bulkCreatedScores: DbUserMatchingScoreJobAwsOpensearchDto[] =
      missingJobIds.length
        ? await this.bulkCreateUserMatchingScoreJobWithJobIds(
            userId,
            missingJobIds
          )
        : [];

    const allScores: DbUserMatchingScoreJobAwsOpensearchDto[] = [
      ...bulkCreatedScores,
      ...existingMatchingScoresData,
    ];

    // If all the requested job ids are new then return the created response
    if (existingMatchingScoresData.length === 0) {
      return {
        data: allScores,
        pagination: {
          count: allScores.length,
          pageSize: requestedPageSize,
        },
      };
    }

    // Filter for scores with undefined matching score
    const scoresWithUndefined: DbUserMatchingScoreJobAwsOpensearchDto[] =
      allScores.filter(
        (score: DbUserMatchingScoreJobAwsOpensearchDto) =>
          score.matchingScore === undefined
      );

    // If all the documents contains matching score then return all existing user matching scores
    if (scoresWithUndefined.length === 0) {
      global.logger.info(`Scores with undefined matching scores not found.`);

      return {
        data: allScores,
        pagination: {
          count: allScores.length,
          pageSize: requestedJobIds.length,
        },
      };
    }

    // Identify scores older than 15 minutes
    const scoresOlderThan15Min: DbUserMatchingScoreJobAwsOpensearchDto[] =
      scoresWithUndefined.filter(
        (score: DbUserMatchingScoreJobAwsOpensearchDto) => {
          const differenceInMinutes: number = DateTime.now().diff(
            DateTime.fromISO(score.updatedAt),
            "minutes"
          ).minutes;

          global.logger.debug(`differenceInMinutes`, {
            differenceInMinutes,
          });

          return differenceInMinutes > 15;
        }
      );

    if (scoresOlderThan15Min.length > 0) {
      const jobIdsToReTrigger: string[] = scoresOlderThan15Min.map(
        (score: DbUserMatchingScoreJobAwsOpensearchDto) => score.jobId
      );
      await this.invokeLambdaToMatchUserResumeWithJobsAndJds(
        userId,
        jobIdsToReTrigger
      );
    }

    // If all the requested job ids are new then return the created response
    if (
      existingMatchingScoresData.length > 0 &&
      existingMatchingScoresData.length < requestedJobIds.length
    ) {
      return {
        data: allScores,
        pagination: {
          count: allScores.length,
          pageSize: requestedPageSize,
        },
      };
    }

    return userMatchingScoreJobDaoObj.getAllUserMatchingScoreJobByUserId(
      filterOptions
    );
  }
}

// Create an instance of UserMatchingScoreJobService
const userMatchingScoreJobServiceObj = new UserMatchingScoreJobService();

// Export class and instance object
export { UserMatchingScoreJobService, userMatchingScoreJobServiceObj };
