// import dynamoose
import * as dynamoose from "dynamoose";

// Import aws bedrock client types
import {
  CreateModelInvocationJobCommandInput,
  CreateModelInvocationJobCommandOutput,
} from "@aws-sdk/client-bedrock";

// import constants
import { DB_CONSTANTS } from "../DB.constants";

// Import enums 
import {
  BatchInferenceLogModelInvocationJobStatusEnum,
  BatchInferenceLogPostProcessStatusEnum,
} from "../../enums/BatchInferenceLog.enum";

// import models
import { BaseDbDto } from "./Base.model";

/**
 * This model is used tracking batch inference activity
 */
class DbBatchInferenceLogDto extends BaseDbDto {
  /**
   * @reference "Job Name" in ["Amazon Bedrock > Batch inference"] and this `id` attribute are same.
   */
  id!: string;

  /*
  @example:
    {
      "inputDataConfig": {
        "s3InputDataConfig": {
          "s3BucketOwner": "211125353899",
          "s3InputFormat": "JSONL",
          "s3Uri": "s3://worko-batch-inference-dev/input/21-05-2025/"
        }
      },
      "jobName": "01JVS7G04QZW8C650H5BDPDJMR",
      "modelId": "arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
      "outputDataConfig": {
          "s3OutputDataConfig": {
              "s3BucketOwner": "211125353899",
              "s3Uri": "s3://worko-batch-inference-dev/output/21-05-2025/"
          }
      },
      "roleArn": "arn:aws:iam::211125353899:role/service-role/worko-batch-inference-role",
      "timeoutDurationInHours": 24
    }
  */
  createModelInvocationJobInput!: CreateModelInvocationJobCommandInput;

  /*
  @example:
    {
      "$metadata": {
        "attempts": 1,
        "httpStatusCode": 200,
        "requestId": "fd32bed6-9aae-42a6-8ed8-e36a7815e245",
        "totalRetryDelay": 0
      },
      "jobArn": "arn:aws:bedrock:ap-south-1:211125353899:model-invocation-job/isca01eb90hh"
    }
  */
  createModelInvocationJobOutput?: CreateModelInvocationJobCommandOutput;

  /**
   * @example "arn:aws:bedrock:ap-south-1:211125353899:model-invocation-job/isca01eb90hh"
   */
  jobArn?: string;

  statusCode?: number;

  errorDetails?: object;

  /**
   * Whenever the Batch inference job is created in the
   * ["Amazon Bedrock > Batch inference"] then, we will use
   * this field to store the status of the model invocation job
   */
  modelInvocationJobStatus!: BatchInferenceLogModelInvocationJobStatusEnum;

  /**
   * As of now this field is used whenever the Batch inference job is created in the
   * ["Amazon Bedrock > Batch inference"] then that inference job
   * will trigger "worko-job-batch-inference-update-function" lambda and if all
   * the processing is done then this field will be updated accordingly.
   */
  postProcessStatus!: BatchInferenceLogPostProcessStatusEnum;
}

// Define the BatchInferenceLogSchema for DynamoDB
const BatchInferenceLogSchema = new dynamoose.Schema(
  {
    ...DB_CONSTANTS.WORKO_PK_SK,
    id: {
      type: String,
      required: true,
    },
    createModelInvocationJobInput: {
      type: Object,
      required: true,
    },
    createModelInvocationJobOutput: {
      type: Object,
      required: false,
    },
    jobArn: {
      type: String,
      required: false,
    },
    statusCode: {
      type: Number,
      required: false,
    },
    errorDetails: {
      type: Object,
      required: false,
    },
    modelInvocationJobStatus: {
      type: String,
      enum: Object.values(BatchInferenceLogModelInvocationJobStatusEnum),
      required: true,
    },
    postProcessStatus: {
      type: String,
      enum: Object.values(BatchInferenceLogPostProcessStatusEnum),
      required: true,
    },
  },
  {
    ...DB_CONSTANTS.WORKO_MODEL_SCHEMA_OPTIONS,
  }
);

// Define the "BatchInferenceLogModel"
const BatchInferenceLogModel = dynamoose.model<DbBatchInferenceLogDto>(
  "BatchInferenceLog",
  BatchInferenceLogSchema
);

// Export the "DbBatchInferenceLogDto" and the "BatchInferenceLogModel" for use in other files
export { BatchInferenceLogModel, DbBatchInferenceLogDto };
