// Import file related libraries
import { WriteStream } from "node:fs";

// Import AWS SDK V3 packages
import {
  CreateModelInvocationJobCommandInput,
  CreateModelInvocationJobCommandOutput,
  ModelInvocationJobS3InputDataConfig,
  ModelInvocationJobS3OutputDataConfig,
} from "@aws-sdk/client-bedrock";

// Import constants and configs
import { awsBedrockClientLibrary } from "../configs/aws-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";
import { BATCH_INFERENCE_APP_CONSTANTS } from "../configs/constants/BatchInference.constant";

// Import dtos
import { BatchInferenceModelInput } from "../dtos/BatchInference.dto";
import { FantasticJobApiResponse } from "../dtos/FantasticJob.dto";
import { FantasticJobLogCommonUpdateDto } from "../dtos/FantasticJobLog.dto";
import { BatchInferenceLogCommonUpdateDto, BatchInferenceLogCreateDto } from "../dtos/BatchInferenceLog.dto";

// Import enums
import { FantasticJobLogJobsDbStoredStatusEnum } from "../enums/FantasticJobLog.enum";
import { BatchInferenceLogModelInvocationJobStatusEnum, BatchInferenceLogPostProcessStatusEnum } from "../enums/BatchInferenceLog.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { DbFantasticJobLogDto } from "../db/models/FantasticJobLog.model";
import { DbBatchInferenceLogDto } from "../db/models/BatchInferenceLog.model";

// Import services
import { fileServiceObj } from "./File.service";
import { jobServiceObj } from "./Job.service";
import UlidService from "./Ulid.service";
import { fantasticJobLogServiceObj } from "./FantasticJobLog.service";
import { batchInferenceLogServiceObj } from "./BatchInferenceLog.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import { fileUtilObj } from "../utils/file.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * BatchInferenceService
 * 
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference.html
 */
class BatchInferenceService {
  /**
   * buildBatchInferenceRecord
   *
   * Transforms a job description into a BatchInferenceModelInput object formatted as a JSONL line.
   *
   * This function takes a unique identifier and a job description string, then constructs
   * a BatchInferenceModelInput object which includes the record ID and model input details
   * suitable for inference processing. The model input includes versioning, token limits,
   * and user messages, which contain the job description details.
   *
   * @param {string} ulidId - A unique identifier for the job record.
   * @param {string} jobDescription - The job description to be included in the model input.
   * @returns {BatchInferenceModelInput} - The formatted JSONL object for batch inference.
   */
  private buildBatchInferenceRecord(
    ulidId: string,
    jobDescription: string
  ): BatchInferenceModelInput {
    // Prepare JSONL line for model input
    const jsonlObj: BatchInferenceModelInput = {
      recordId: ulidId, // `id` attribute of `OpenSearchJob.model.ts`
      modelInput: {
        anthropic_version:
          BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT
            .ANTHROPIC_VERSION,
        max_tokens:
          BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT.MAX_TOKENS,
        messages: [
          {
            role: BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT
              .ROLES.USER,
            content: [
              {
                type: BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT
                  .CONTENT_TYPES.TEXT,
                text: BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT.PROMPT.strtr(
                  {
                    "{promptJobDescription}": jobDescription,
                  }
                ),
              },
            ],
          },
        ],
      },
    };

    return jsonlObj;
  }

  /**
   * finalizeJsonlFile
   *
   * Handles closing a file stream and optionally uploads the file to S3
   *
   * This method is called when the file stream is closed or finished writing.
   * If `uploadToS3` is true and `fileName` is provided, it will upload the file
   * to S3. Afterwards, it deletes the local JSONL file.
   *
   * @param {WriteStream} fileStream - The file stream to be closed.
   * @param {string} filePath - The path of the file that was written to.
   * @param {boolean} uploadToS3 - Whether to upload the file to S3.
   * @param {string} [fileName] - The name of the JSONL file to be uploaded to S3.
   * @returns {Promise<void>} - A promise that resolves or rejects based on the
   *   outcome of the file deletion and potential S3 upload.
   */
  private async finalizeJsonlFile(
    fileStream: WriteStream,
    filePath: string,
    uploadToS3: boolean,
    fileName?: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fileStream.end(async () => {
        try {
          if (uploadToS3 && fileName) {
            global.logger.info("Uploading JSONL file to S3", {
              filePath,
              fileName,
            });

            await fileServiceObj.uploadJsonlFileToS3(filePath, fileName);
          }

          // Delete the local JSONL file
          await fileUtilObj.deleteFileFromPath(filePath);
          global.logger.info(
            "Deleted local JSONL file after successfull S3 upload",
            {
              filePath,
            }
          );

          resolve(); // done successfully
        } catch (error) {
          global.logger.error("Failed to delete JSONL file", {
            filePath,
            error,
          });

          reject(error); // pass the error
        }
      });
    });
  }

  /**
   * initializeJsonlFileStream
   *
   * Creates a JSONL file stream at the specified directory path and file number.
   *
   * @param {string} directoryPath - The path of the directory where the JSONL file will be created.
   * @param {number} fileNumber - The number of the JSONL file to be created.
   * @returns {{ fileName: string; filePath: string; fileStream: WriteStream }} - An object containing the file name, file path, and a writable file stream.
   */
  private initializeJsonlFileStream(
    directoryPath: string, // @example: "/tmp/fantastic-jobs-batch-inference"
    fileNumber: number
  ): { fileName: string; filePath: string; fileStream: WriteStream } {
    const fileName: string = `file-${fileNumber}.jsonl`;

    /**
     * @example "/tmp/fantastic-jobs-batch-inference/file-1.jsonl"
     */
    const filePath: string = fileUtilObj.createPath(directoryPath, fileName);

    global.logger.info("filePath", {
      filePath,
      methodName: this.initializeJsonlFileStream.name,
    });

    // This is used to write to the file
    const fileStream: WriteStream = fileUtilObj.createFileWriteStream(filePath);

    return { fileName, filePath, fileStream };
  }

  /**
   * updateFantasticJobLogAndThrowError
   *
   * Updates the fantastic job log with the given error details and throws an error
   * with the given status code.
   *
   * @param {string} fantasticJobLogId - The ID of the fantastic job log to be updated.
   * @param {string} message - The error message to be logged.
   * @param {HttpStatusCode} statusCode - The HTTP status code of the error.
   * @returns {Promise<never>} - A promise that never resolves and always throws an error.
   */
  private async updateFantasticJobLogAndThrowError(
    fantasticJobLogId: string,
    message: string,
    statusCode: HttpStatusCode
  ): Promise<never> {
    const updatedLog: DbFantasticJobLogDto =
      await fantasticJobLogServiceObj.updateFantasticJobLogById(
        fantasticJobLogId,
        {
          errorDetails: {
            error: {
              errorMessage: message,
            },
            className: BatchInferenceService.name,
            methodName: this.updateFantasticJobLogAndThrowError.name,
          },
        }
      );

    global.logger.info("Updated Fantastic Job Log", {
      updatedLog,
      methodName: this.updateFantasticJobLogAndThrowError.name,
    });

    throw new BaseError(message, statusCode);
  }

  /**
   * initializeUploadDirectoryForFantasticJob
   *
   * Initializes the upload directory for batch inference processing.
   *
   * This method validates and creates a temporary directory used for
   * storing batch inference files. It ensures the directory exists
   * and deletes any existing files within it. If directory creation
   * or file deletion fails, it logs the error and throws an exception
   * with the appropriate error details and HTTP status code.
   *
   * @param {string} fantasticJobLogId - The ID of the fantastic job log used for error reporting.
   * @returns {Promise<string>} - A promise that resolves to the path of the upload directory.
   * @throws {BaseError} - Throws an error if directory creation or file deletion fails.
   */
  private async initializeUploadDirectoryForFantasticJob(
    fantasticJobLogId: string
  ): Promise<string> {
    const uploadDir: string | undefined =
      fileUtilObj.validateAndCreateDirectory(
        "/tmp",
        APP_CONSTANTS.APP_TEMPORARY_FOLDER_NAMES.FANTASTIC_JOBS_BATCH_INFERENCE
      );

    if (!uploadDir) {
      await this.updateFantasticJobLogAndThrowError(
        fantasticJobLogId,
        `Failed to validate and create directory.`, // error message
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    const deletedFilesStatus: boolean =
      await fileUtilObj.deleteAllFilesFromDirPath(uploadDir!);

    if (!deletedFilesStatus) {
      await this.updateFantasticJobLogAndThrowError(
        fantasticJobLogId,
        `Something went wrong while checking and deleting old files.`, // error message
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return uploadDir!;
  }

  /**
   * updateBatchInferenceLogForCreateModelInvocationJob
   *
   * Updates the batch inference log entry in DynamoDB with the results of a model invocation job.
   * It updates the status of the job to either "COMPLETED" or "FAILED" based on the error flag.
   * If the job was successful, it stores the job output, ARN, and status code.
   * In case of an error, it logs the error details.
   *
   * @param {string} batchInferenceLogId - The ID of the batch inference log entry to be updated.
   * @param {boolean} isError - Whether an error occurred during the model invocation job.
   * @param {CreateModelInvocationJobCommandOutput | undefined} [modelInvocationJobResult] - The result of the model invocation job if successful.
   * @param {any | undefined} [errorDetails] - Additional error details if an error occurred.
   * @returns {Promise<DbBatchInferenceLogDto>} - A promise that resolves to the updated batch inference log entry.
   */
  private async updateBatchInferenceLogForCreateModelInvocationJob(
    batchInferenceLogId: string,
    isError: boolean,
    modelInvocationJobResult?: CreateModelInvocationJobCommandOutput,
    errorDetails?: any
  ): Promise<DbBatchInferenceLogDto> {
    // Prepate update data for success
    const updateData: Partial<BatchInferenceLogCommonUpdateDto> = {
      modelInvocationJobStatus: isError
        ? BatchInferenceLogModelInvocationJobStatusEnum.FAILED
        : BatchInferenceLogModelInvocationJobStatusEnum.COMPLETED,
    };

    if (modelInvocationJobResult) {
      updateData.createModelInvocationJobOutput = modelInvocationJobResult;
      updateData.jobArn = modelInvocationJobResult.jobArn;
      updateData.statusCode = modelInvocationJobResult.$metadata.httpStatusCode;
    }

    if (isError) {
      updateData.errorDetails = errorDetails;
    }

    const updatedBatchInferenceLog: DbBatchInferenceLogDto =
      await batchInferenceLogServiceObj.updateBatchInferenceLogById(
        batchInferenceLogId,
        updateData
      );
    global.logger.debug("updatedBatchInferenceLog for success", {
      updatedBatchInferenceLog,
    });

    return updatedBatchInferenceLog;
  }

  /**
   * createBatchInference
   *
   * Initiates a batch inference job by configuring input and output data locations in S3,
   * and creates a model invocation job in AWS Bedrock. It logs the progress of the job and
   * updates the batch inference log with the job's status.
   *
   * The method prepares S3 configurations for input and output, sets up job parameters,
   * and creates a batch inference log entry. It then attempts to create the model invocation
   * job and updates the log with the job's result or any errors encountered during the process.
   *
   * @returns {Promise<boolean>} - A promise that resolves to true if the batch inference job
   *   was created successfully, or false if an error occurred.
   */
  private async createBatchInference(): Promise<boolean> {
    const currentDate: string =
      dateHelperObj.getCurrentDayMonthYearFormattedDate();

    const ulidId: string = UlidService.getUlidId();

    /**
     * Configuration of the S3 location of the input data.
     *  @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_ModelInvocationJobInputDataConfig.html
     *  @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_ModelInvocationJobS3InputDataConfig.html#API_ModelInvocationJobS3InputDataConfig_Contents
     */
    const s3InputDataConfig: ModelInvocationJobS3InputDataConfig = {
      /**
       * Pattern: "s3://<bucketName>/<path-to-your-data>/"
       */
      s3Uri: `s3://${
        process.env.APP_AWS_S3_BUCKET_WORKO_BATCH_INFERENCE
      }/${APP_CONSTANTS.AWS_S3_DIR_PATHS.BATCH_INFERENCE_INPUT.strtr({
        "{date}": currentDate,
      })}`,

      /**
       * The ID of the AWS account that owns the S3 bucket containing the input data.
       * Pattern: ^[0-9]{12}$
       */
      s3BucketOwner: process.env.APP_AWS_ACCOUNT_ID,

      /**
       * The format of the input data.
       */
      s3InputFormat: "JSONL",
    };

    /**
     * Configuration of the S3 location of the output data.
     * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_ModelInvocationJobS3OutputDataConfig.html
     */
    const s3OutputDataConfig: ModelInvocationJobS3OutputDataConfig = {
      /**
       * Pattern: "s3://<bucketName>/<path-to-your-data>/"
       */
      s3Uri: `s3://${
        process.env.APP_AWS_S3_BUCKET_WORKO_BATCH_INFERENCE
      }/${APP_CONSTANTS.AWS_S3_DIR_PATHS.BATCH_INFERENCE_OUTPUT.strtr({
        "{date}": currentDate,
      })}`,

      /**
       * The ID of the AWS account that owns the S3 bucket containing the input data.
       * Pattern: ^[0-9]{12}$
       */
      s3BucketOwner: process.env.APP_AWS_ACCOUNT_ID,
    };

    /**
     * // Prepare the input data for the batch inference job
     * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_CreateModelInvocationJob.html#API_CreateModelInvocationJob_RequestBody
     */
    const modelInvocationJobInput: CreateModelInvocationJobCommandInput = {
      inputDataConfig: {
        s3InputDataConfig: s3InputDataConfig,
      },

      /**
       * A name to give the batch inference job.
       * Pattern: ^[a-zA-Z0-9]{1,63}(-*[a-zA-Z0-9\+\-\.]){0,63}$
       */
      jobName: ulidId,

      /**
       * Pattern: ^(arn:aws(-[^:]+)?:bedrock:[a-z0-9-]{1,20}:(([0-9]{12}:custom-model/[a-z0-9-]{1,63}[.]{1}[a-z0-9-:]{1,63}/[a-z0-9]{12}$)|(:foundation-model/([a-z0-9-]{1,63}[.]{1}[a-z0-9-]{1,63}([.]?[a-z0-9-]{1,63})([:][a-z0-9-]{1,63}){0,2})|(([0-9a-zA-Z][_-]?)+)$)|([0-9]{12}:(inference-profile|application-inference-profile)/[a-zA-Z0-9-:.]+$)))|([a-z0-9-]{1,63}[.]{1}[a-z0-9-]{1,63}([.]?[a-z0-9-]{1,63})([:][a-z0-9-]{1,63}){0,2})|(([0-9a-zA-Z][_-]?)+)$
       */
      modelId:
        BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_AWS_BEDROCK_ARNS.MODEL,

      outputDataConfig: {
        s3OutputDataConfig: s3OutputDataConfig,
      },

      /**
       * Pattern: ^arn:aws(-[^:]+)?:iam::([0-9]{12})?:role/.+$
       */
      roleArn:
        BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_AWS_BEDROCK_ARNS
          .SERVICE_ROLE,

      /**
       * The number of hours after which to force the batch inference job to time out.
       * Valid Range: Minimum value of 24. Maximum value of 168.
       */
      timeoutDurationInHours:
        BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_TIME_OUT_DURATION_IN_HOURS
          .MIN,
    };

    // Prepare batch inference create log data
    const createBatchInferenceLogDto: BatchInferenceLogCreateDto = {
      id: ulidId,
      createModelInvocationJobInput: modelInvocationJobInput,
      modelInvocationJobStatus:
        BatchInferenceLogModelInvocationJobStatusEnum.IN_PROGRESS,
      postProcessStatus: BatchInferenceLogPostProcessStatusEnum.IN_PROGRESS,
    };

    const createBatchInferenceLogResult: DbBatchInferenceLogDto =
      await batchInferenceLogServiceObj.createBatchInferenceLog(
        createBatchInferenceLogDto
      );
    global.logger.debug("createBatchInferenceLogResult", {
      createBatchInferenceLogResult,
    });

    try {
      /*
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
      const modelInvocationJobResult: CreateModelInvocationJobCommandOutput =
        await awsBedrockClientLibrary.createModelInvocationJob(
          modelInvocationJobInput
        );
      global.logger.debug("modelInvocationJobResult ", {
        modelInvocationJobResult,
      });

      if (
        modelInvocationJobResult.$metadata.httpStatusCode !==
        HttpStatusCode.OK_200
      ) {
        global.logger.error(
          `Failed to create model invocation job in AWS Bedrock. [service]`,
          {
            methodName: this.createBatchInference.name,
            modelInvocationJobResult,
          }
        );

        await this.updateBatchInferenceLogForCreateModelInvocationJob(
          createBatchInferenceLogResult.id,
          true,
          modelInvocationJobResult,
          {
            error: {
              errorMessage:
                "Failed to create model invocation job in AWS Bedrock.",
            },
            methodName: this.createBatchInference.name,
            className: BatchInferenceService.name,
          }
        );

        return false;
      }

      await this.updateBatchInferenceLogForCreateModelInvocationJob(
        ulidId,
        false,
        modelInvocationJobResult,
        undefined
      );

      return true;
    } catch (error: any) {
      await this.updateBatchInferenceLogForCreateModelInvocationJob(
        createBatchInferenceLogResult.id,
        true,
        undefined,
        {
          error: error,
          methodName: this.createBatchInference.name,
          className: BatchInferenceService.name,
        }
      );

      return false;
    }
  }

  /**
   * updateFantasticJobLogForBulkCreate
   *
   * Updates the fantastic job log with the results of the bulk create operation
   * in the OpenSearch database. It logs the total number of jobs stored and the
   * status of the operation, marking it as either "SUCCESS" or "FAILED" based
   * on the presence of an error. If an error occurred, it logs the error details
   * including the error message, method name, and class name.
   *
   * @param {string} fantasticJobLogId - The ID of the fantastic job log to be updated.
   * @param {number} openSearchDbStoredCount - The number of jobs successfully stored in OpenSearch.
   * @param {boolean} isError - Whether an error occurred during the bulk create operation.
   * @param {string} [errorMessage] - The error message if an error occurred.
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the updated fantastic job log.
   */
  private async updateFantasticJobLogForBulkCreate(
    fantasticJobLogId: string,
    openSearchDbStoredCount: number,
    isError: boolean,
    errorMessage?: string
  ): Promise<DbFantasticJobLogDto> {
    // Prepare the update data for fantastic job log
    const updateData: Partial<FantasticJobLogCommonUpdateDto> = {
      jobsDbStoredTotalCount: openSearchDbStoredCount,
      jobsDbStoredStatus: isError
        ? FantasticJobLogJobsDbStoredStatusEnum.FAILED
        : FantasticJobLogJobsDbStoredStatusEnum.SUCCESS,
    };

    if (isError) {
      updateData.errorDetails = {
        error: {
          errorMessage: errorMessage,
        },
        methodName: this.processBatchInferenceForFantasticJobs.name,
        className: BatchInferenceService.name,
      };
    }

    const updatedLog: DbFantasticJobLogDto =
      await fantasticJobLogServiceObj.updateFantasticJobLogById(
        fantasticJobLogId,
        updateData
      );
    global.logger.info(`Fantastic job retrieval logs:`, {
      updatedLog,
      methodName: this.processBatchInferenceForFantasticJobs.name,
    });

    return updatedLog;
  }

  /**
   * processBatchInferenceForFantasticJobs
   *
   * @todo: Need to Investigate and find an ideal way by discussing with `CTO` to:
   *   1. write multiple records in single ".jsonl" file.
   *   2. store multiple ".jsonl" files in S3.
   *
   * @param {string} fantasticJobLogId - `id` attribute of `FantasticJobLog.model.ts` table in dynamodb
   * @param {FantasticJobApiResponse[]} bulkJobDetails - An array of fantastic job details to be indexed in the OpenSearch index and uploaded to `S3`.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations in the bulk request succeed, or `false` if any operation fails.
   */
  async processBatchInferenceForFantasticJobs(
    fantasticJobLogId: string,
    bulkJobDetails: FantasticJobApiResponse[]
  ): Promise<boolean> {
    // global logger
    global.logger.debug(
      `Process batch inference for fantastic jobs [SERVICE]`,
      {
        fantasticJobLogId,
        lengthOfBulkJobDetails: bulkJobDetails.length,
        methodName: this.processBatchInferenceForFantasticJobs.name,
      }
    );

    // Initialize the upload directory
    const uploadDir: string =
      await this.initializeUploadDirectoryForFantasticJob(fantasticJobLogId);

    /**
     * This is the maximum number of jobs that can be indexed in a single bulk request to the OpenSearch index
     * and write to single JSONL file.
     */
    const batchSize: number = APP_CONSTANTS.AWS_OPENSEARCH_BULK_CREATE_COUNT;

    // Initialize a counter for creating JSONL files
    let fileJsonlNumber: number = 0;

    // Initialize a counter for storing jobs in db
    let openSearchDbStoredCount: number = 0;

    // Split the bulkJobDetails into chunks of given `batchSize`
    for (let i = 0; i < bulkJobDetails.length; i += batchSize) {
      fileJsonlNumber += 1;
      const { fileName, filePath, fileStream } = this.initializeJsonlFileStream(
        uploadDir,
        fileJsonlNumber
      );

      // Get the current batch
      const batch: FantasticJobApiResponse[] = bulkJobDetails.slice(
        i,
        i + batchSize
      );

      // Initialize an empty array to hold the bulk job data
      let bulkJobData: (
        | DbJobAwsOpensearchDto
        | {
            index: {
              _index: string;
              _id: string;
            };
          }
      )[] = [];

      // Loop through the current batch of jobs
      for (const eachFantasticJob of batch) {
        // Generate a unique ULID ID
        const ulidId: string = UlidService.getUlidId();

        const transformFantasticJob: DbJobAwsOpensearchDto =
          jobServiceObj.transformFantasticJobToAwsOpensearchJobDto(
            ulidId,
            eachFantasticJob
          );

        // Push the job data to the bulk data array
        bulkJobData.push(
          {
            index: { _index: jobServiceObj.getIndexName(), _id: ulidId },
          },
          transformFantasticJob
        );

        const jsonlObj: BatchInferenceModelInput =
          this.buildBatchInferenceRecord(
            ulidId,
            transformFantasticJob.jobDescription ?? "Job Description Not Found."
          );

        // Write JSONL line for model input
        fileStream.write(JSON.stringify(jsonlObj) + "\n");
      }

      // Bulk index the current batch of jobs
      const success: boolean = await jobServiceObj.createBulkJobs(bulkJobData);
      global.logger.debug(
        `Bulk index jobs in aws opensearch success status [SERVICE]`,
        { success }
      );

      // If any batch fails, return false
      if (!success) {
        global.logger.error(`Bulk index jobs in aws opensearch failed`, {
          filePath: __filename,
          methodName: this.processBatchInferenceForFantasticJobs.name,
        });

        // End the file stream without uploading fantastic jobs details to `S3`
        await this.finalizeJsonlFile(fileStream, filePath, false);

        await this.updateFantasticJobLogForBulkCreate(
          fantasticJobLogId,
          openSearchDbStoredCount,
          true,
          "Bulk index jobs in aws opensearch failed."
        );

        return false;
      }

      // If batch is successful then increment the `openSearchDbStoredCount`
      openSearchDbStoredCount += batch.length;

      // End the file stream and upload the fantastic jobs details to `S3`
      await this.finalizeJsonlFile(fileStream, filePath, true, fileName);
    }

    // Update the fantastic job log for success status
    await this.updateFantasticJobLogForBulkCreate(
      fantasticJobLogId,
      openSearchDbStoredCount,
      false
    );

    return this.createBatchInference();
  }
}

const batchInferenceServiceObj: BatchInferenceService = new BatchInferenceService();
export { batchInferenceServiceObj, BatchInferenceService };
