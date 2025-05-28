
// Import enums
import { FantasticJobLogApiTypeEnum, FantasticJobLogJobsDbStoredStatusEnum, FantasticJobLogJobsRetrievedStatusEnum } from "../enums/FantasticJobLog.enum";

/**
 * FantasticJobLogCreateDto
 */
export interface FantasticJobLogCreateDto {
  /**
   * apiType
   *
   * The type of the API call which was used to fetch jobs.
   */
  apiType: FantasticJobLogApiTypeEnum;

  /**
   * The total number of API calls made to fetch jobs.
   */
  apiCallTotalCount: number;

  /**
   * The total number of jobs retrieved from all the API calls which were successful.
   */
  jobsRetrievedTotalCount: number;

  /**
   * The status of jobs retrieved from all the API calls.
   */
  jobsRetrievedStatus: FantasticJobLogJobsRetrievedStatusEnum;

  /**
   * After retrieving all the jobs from all the API calls,
   * we are validating the jobs and storing them in the database.
   * The "jobsValidatedTotalCount" is used to track the total number of jobs which were validated and used to store in the database.
   */
  jobsValidatedTotalCount: number;

  /**
   * The total number of jobs which were stored in the database.
   * As of now we are using "Opensearch" as the database.
   */
  jobsDbStoredTotalCount: number;

  /**
   * The status of jobs stored in the database.
   */
  jobsDbStoredStatus: FantasticJobLogJobsDbStoredStatusEnum;
}

/**
 * FantasticJobLogCommonUpdateDto
 */
export interface FantasticJobLogCommonUpdateDto {
  errorDetails: object;

  /**
   * apiType
   *
   * The type of the API call which was used to fetch jobs.
   */
  apiType: FantasticJobLogApiTypeEnum;

  /**
   * The total number of API calls made to fetch jobs.
   */
  apiCallTotalCount: number;

  /**
   * The total number of jobs retrieved from all the API calls which were successful.
   */
  jobsRetrievedTotalCount: number;

  /**
   * The status of jobs retrieved from all the API calls.
   */
  jobsRetrievedStatus: FantasticJobLogJobsRetrievedStatusEnum;

  /**
   * After retrieving all the jobs from all the API calls,
   * we are validating the jobs and storing them in the database.
   * The "jobsValidatedTotalCount" is used to track the total number of jobs which were validated and used to store in the database.
   */
  jobsValidatedTotalCount: number;

  /**
   * The total number of jobs which were stored in the database.
   * As of now we are using "Opensearch" as the database.
   */
  jobsDbStoredTotalCount: number;

  /**
   * The status of jobs stored in the database.
   */
  jobsDbStoredStatus: FantasticJobLogJobsDbStoredStatusEnum;
}