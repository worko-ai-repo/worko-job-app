export enum BatchInferenceLogDbJobStatusEnum {
  /**
   * @description
   *  1. For example, If batch inference job created successfully in "Gcp vertex ai batch inference"
   *     then we will store the status as "IN_PROGRESS"
   */
  IN_PROGRESS = "IN_PROGRESS",

  /**
   * @description
   *  1. For example, If batch inference job is successfully created in "Gcp vertex ai batch inference"
   *     then the status will be "IN_PROGRESS" and once the job is completed then we will update the status from "IN_PROGRESS" to "COMPLETED".
   */
  COMPLETED = "COMPLETED",

  /**
   * @description
   *  1. For example, If batch inference job failed to create in "Gcp vertex ai batch inference"
   *     then we will store the status as "FAILED"
   *  2. For example, If batch inference job is successfully created in "Gcp vertex ai batch inference"
   *     but failed to complete the job then we will update the status from "IN_PROGRESS" to "FAILED".
   */
  FAILED = "FAILED",
}