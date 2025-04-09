// Import Aws opensearch client
import { awsOpensearchLibrary } from "../configs/aws-sdk.config";

// Import opensearch types
import {
  Search_RequestBody,
  Search_Response,
  Update_Response,
} from "@opensearch-project/opensearch/api";

// Import dtos
import {
  UserMatchingScoreJobListingFilterOptions,
  UserMatchingScoreJobUpdateDto,
} from "../dtos/UserMatchingScoreJob.dto";
import { AwsOpensearchRecordListingResponseDTO } from "../dtos/Common.aws-opensearch.dto";

// Import enums
import { AwsOpensearchSortOrderTypeEnum } from "../enums/Common.aws-opensearch.enum";

// Import models
import { DbUserMatchingScoreJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchUserMatchingScoreJob.model";

/**
 * UserMatchingScoreJobDao
 * 
 * Class responsible for managing user matching score job related operations
 */
class UserMatchingScoreJobDao {
  IndexName = "worko-user-matching-score-job";

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
    // Logger
    global.logger.info(
      `Get all user matching scores by userId for list of job ids [DAO]`,
      {
        methodName: this.getAllUserMatchingScoreJobByUserId.name,
      }
    );

    // Construct the AWS OpenSearch query based on the filter options
    let awsOpensearchQuery: Search_RequestBody = {
      query: {
        bool: {
          must: [
            {
              term: {
                "userId.keyword": {
                  value: userMatchingScoreJobRequestOptions.userId,
                },
              },
            }, // Uses `value`
            {
              terms: {
                "jobId.keyword": userMatchingScoreJobRequestOptions.jobIds,
              },
            }, // Uses an array directly
          ],
        },
      },
      size:
        userMatchingScoreJobRequestOptions.pageSize ??
        userMatchingScoreJobRequestOptions.jobIds.length,
      sort: [
        {
          createdAt:
            userMatchingScoreJobRequestOptions.sortOrder ??
            AwsOpensearchSortOrderTypeEnum.DESCENDING,
          _id:
            userMatchingScoreJobRequestOptions.sortOrder ??
            AwsOpensearchSortOrderTypeEnum.DESCENDING,
        },
      ],
    };

    // return the paginated result
    return awsOpensearchLibrary.getDocuments<
      DbUserMatchingScoreJobAwsOpensearchDto,
      UserMatchingScoreJobListingFilterOptions
    >(this.IndexName, awsOpensearchQuery, userMatchingScoreJobRequestOptions);
  }

  /**
   * getUserMatchingScoreJobByUserIdAndJobId
   *
   * Retrieves a user matching score job by userId and jobId.
   *
   * @param {string} userId - The ID of the user for whom the matching score is being retrieved.
   * @param {string} jobId - The ID of the job for which the matching score is being retrieved.
   * @returns {Promise<DbUserMatchingScoreJobAwsOpensearchDto | undefined>} A promise that resolves with the user matching score job details.
   */
  async getUserMatchingScoreJobByUserIdAndJobId(
    userId: string,
    jobId: string
  ): Promise<DbUserMatchingScoreJobAwsOpensearchDto | undefined> {
    global.logger.info(`Get user matching score by userId and jobId [DAO]`, {
      methodName: this.getUserMatchingScoreJobByUserIdAndJobId.name,
      userId: userId,
      jobId: jobId,
    });

    const awsOpensearchGetDocumentByFieldsBody: Search_RequestBody =
      {
        query: {
          bool: {
            must: [
              { term: { "userId.keyword": { value: userId } } },
              { term: { "jobId.keyword": { value: jobId } } },
            ],
          },
        },
      };

    // Execute the search query on AWS OpenSearch
    const awsOpensearchResponse: Search_Response =
      await awsOpensearchLibrary.opensearchClient.search({
        index: this.IndexName,
        body: awsOpensearchGetDocumentByFieldsBody,
      });

    return (awsOpensearchResponse.body?.hits?.hits[0]?._source ?? undefined) as
      | DbUserMatchingScoreJobAwsOpensearchDto
      | undefined;
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
  ): Promise<Update_Response> {
    // Logger
    global.logger.info(`Update user matching score by id [DAO]`, {
      methodName: this.updateUserMatchingScoreJobById.name,
      id,
    });

    return awsOpensearchLibrary.updateDocumentById<UserMatchingScoreJobUpdateDto>(
      id,
      this.IndexName,
      updateUserMatchingScoreJob
    );
  }

  /**
   * bulkCreateUserMatchingScoreJobWithJobIds
   * 
   * Bulk indexes user matching score jobs to the OpenSearch index.
   *
   * This asynchronous method sends a bulk request to the OpenSearch client
   * to perform index actions, which create a document if it doesn’t exist
   * and replace it if it does. Each operation in the `bulkData` array can
   * either be a new user matching score job entry or an index action with
   * metadata specifying the job's index and ID.
   *
   * The method returns a promise that resolves to `true` if all operations
   * in the bulk request succeed, or `false` if any operation fails.
   * 
   * @see https://opensearch.org/docs/latest/api-reference/document-apis/bulk/#index
   *
   * @param {(DbUserMatchingScoreJobAwsOpensearchDto | {index: {_index: string; _id: string;}})[]} bulkData - An array of user matching score job data
   * and index actions to be processed in the bulk request.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations in the bulk request succeed, or `false` if any operation fails.
   */
  async bulkCreateUserMatchingScoreJobWithJobIds(
    bulkData: (
      | DbUserMatchingScoreJobAwsOpensearchDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ): Promise<boolean> {
    return awsOpensearchLibrary.bulkCreateDocument(bulkData);
  }
}

// Create an instance of the UserMatchingScoreJobDao class
const userMatchingScoreJobDaoObj = new UserMatchingScoreJobDao();

// Export an instance of the UserMatchingScoreJobDao class and the UserMatchingScoreJobDao class
export { UserMatchingScoreJobDao, userMatchingScoreJobDaoObj };