// import dynamoose
import * as dynamoose from "dynamoose";

// import constants
import { DB_CONSTANTS } from "../DB.constants";

// Import enums
import { FantasticJobLogApiTypeEnum, FantasticJobLogJobsDbStoredStatusEnum, FantasticJobLogJobsRetrievedStatusEnum } from "../../enums/FantasticJobLog.enum";

// import models
import { BaseDbDto } from "./Base.model";

/**
 * DbFantasticJobLogDto
 * 
 * This "FantasticJobLog" is responsible for tracking below details:
 *  1. Api calls tracking for fantastic job api.
 *     1. If failed to fetch then those error details will be stored in the database.
 *  2. Whether Retrieved jobs are stored in the database(Opensearch as of now) or not.
 *     1. If failed to store then those error details will be stored in the database.
 */
class DbFantasticJobLogDto extends BaseDbDto {
  // ids
  id!: string;

  /**
   * apiType
   *
   * The type of the API call which was used to fetch jobs.
   */
  apiType!: FantasticJobLogApiTypeEnum;

  /**
   * The total number of API calls made to fetch jobs.
   */
  apiCallTotalCount!: number;

  /**
   * The total number of jobs retrieved from all the API calls which were successful.
   */
  jobsRetrievedTotalCount!: number;

  /**
   * The status of jobs retrieved from all the API calls.
   */
  jobsRetrievedStatus!: FantasticJobLogJobsRetrievedStatusEnum;

  /**
   * After retrieving all the jobs from all the API calls,
   * we are validating the jobs and storing them in the database.
   * The "jobsValidatedTotalCount" is used to track the total number of jobs which were validated and used to store in the database.
   */
  jobsValidatedTotalCount!: number;

  /**
   * The total number of jobs which were stored in the database.
   * As of now we are using "Opensearch" as the database.
   */
  jobsDbStoredTotalCount!: number;

  /**
   * The status of jobs stored in the database.
   */
  jobsDbStoredStatus!: FantasticJobLogJobsDbStoredStatusEnum;

  errorDetails?: object;
}

// Define the FantasticJobLogSchema for DynamoDB
const FantasticJobLogSchema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    apiType: {
      type: String,
      required: true,
    },
    apiCallTotalCount: {
      type: Number,
      required: true,
    },
    jobsRetrievedTotalCount: {
      type: Number,
      required: true,
    },
    jobsRetrievedStatus: {
      type: String,
      required: true,
    },
    jobsValidatedTotalCount: {
      type: Number,
      required: true,
    },
    jobsDbStoredTotalCount: {
      type: Number,
      required: true,
    },
    jobsDbStoredStatus: {
      type: String,
      required: true,
    },
    errorDetails: {
      type: Object,
      required: false,
    }
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Define the "FantasticJobLogModel"
const FantasticJobLogModel = dynamoose.model<DbFantasticJobLogDto>(
  "FantasticJobLog",
  FantasticJobLogSchema
);

// Export the "DbFantasticJobLogDto" and the "FantasticJobLogModel" for use in other files
export { FantasticJobLogModel, DbFantasticJobLogDto };
