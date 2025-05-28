
// Import AWS SDK V3 packages for AWS Bedrock
import { CreateModelInvocationJobCommandInput, CreateModelInvocationJobCommandOutput } from "@aws-sdk/client-bedrock";

// Import enums
import { BatchInferenceLogModelInvocationJobStatusEnum, BatchInferenceLogPostProcessStatusEnum } from "../enums/BatchInferenceLog.enum";

/**
 * BatchInferenceLogCreateDto
 */
export interface BatchInferenceLogCreateDto {
   id: string,
   createModelInvocationJobInput: CreateModelInvocationJobCommandInput;
   modelInvocationJobStatus: BatchInferenceLogModelInvocationJobStatusEnum;
   postProcessStatus: BatchInferenceLogPostProcessStatusEnum;
}

/**
 * BatchInferenceLogCommonUpdateDto
 */
export interface BatchInferenceLogCommonUpdateDto {
  createModelInvocationJobOutput: CreateModelInvocationJobCommandOutput;

  /**
   * @example "arn:aws:bedrock:ap-south-1:211125353899:model-invocation-job/isca01eb90hh"
   */
  jobArn: string;

  statusCode: number;

  errorDetails: object;

  modelInvocationJobStatus: BatchInferenceLogModelInvocationJobStatusEnum;
}