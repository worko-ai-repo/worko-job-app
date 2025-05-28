
/**
 * BatchInferenceLogModelInvocationJobStatusEnum
 */
export enum BatchInferenceLogModelInvocationJobStatusEnum {
  IN_PROGRESS = "IN_PROGRESS",

  /**
   * Whenever the model invocation job is created successfully in AWS Bedrock(Batch Inference)
   */
  COMPLETED = "COMPLETED",

  /**
   * Whenever the model invocation job fails to create in AWS Bedrock(Batch Inference)
   */
  FAILED = "FAILED",
}

/**
 * BatchInferenceLogPostProcessStatusEnum
 */
export enum BatchInferenceLogPostProcessStatusEnum {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}