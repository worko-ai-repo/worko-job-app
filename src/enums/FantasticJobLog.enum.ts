
/**
 * FantasticJobLogApiTypeEnum
 */
export enum FantasticJobLogApiTypeEnum {
  /**
   * 1. Get Jobs Hourly
   * 2. Includes Jobs discoverd in the last hour.
   */
  ONE_HOUR = "ONE_HOUR",

  /**
   * 1. The Jobs in this API have been indexed by us during the last 24 hours.
   */
  TWENTY_FOUR_HOUR = "TWENTY_FOUR_HOUR",

  /**
   * 1. The Jobs in this API have been indexed by us during the last 7 days.
   */
  SEVEN_DAY = "SEVEN_DAY",

  /**
   * 1. Contains IDs of jobs that were flagged as expired yesterday. Updates once per day at 01:30 UTC
   * 2. Contains all jobs that have been flagged as expired yesterday. Updates once per day
   * 3. The expired job ids are all over world, not just "India" and there is no location filter provided by the API
   */
  EXPIRED = "EXPIRED",
}

/**
 * FantasticJobLogJobsRetrievedStatusEnum
 */
export enum FantasticJobLogJobsRetrievedStatusEnum {
   IN_PROGRESS = "IN_PROGRESS",
   SUCCESS = "SUCCESS",
   FAILED = "FAILED",
}

/**
 * FantasticJobLogJobsDbStoredStatusEnum
 */
export enum FantasticJobLogJobsDbStoredStatusEnum {
   IN_PROGRESS = "IN_PROGRESS",
   SUCCESS = "SUCCESS",
   FAILED = "FAILED",
}