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
import { awsBedrockClientLibrary, awsS3ClientLibrary } from "../configs/aws-sdk.config";
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import {
  BatchInferenceLogCreateDto,
} from "../dtos/BatchInferenceLog.dto";

// Import enums
import {
  BatchInferenceLogModelInvocationJobStatusEnum,
  BatchInferenceLogPostProcessStatusEnum,
} from "../enums/BatchInferenceLog.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models
import { DbBatchInferenceLogDto } from "../db/models/BatchInferenceLog.model";

// Import services
import UlidService from "./Ulid.service";
import { batchInferenceLogServiceObj } from "./BatchInferenceLog.service";

// Import utils
import { fileUtilObj } from "../utils/file.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * CommonExternalJobAwsBatchInferenceService
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference.html
 */
class CommonExternalJobAwsBatchInferenceService {
  /**
   * prepareCommonExternalJobBatchInferenceS3Config
   *
   * Prepares the S3 configuration details required for a batch inference job.
   * This includes generating the current date in a specific format, a unique ULID identifier,
   * and specifying the external job source path for S3.
   *
   * @param {string} externalJobSource - The source of the external job.
   * @returns {Object} An object containing:
   * - `s3CurrentDate`: A formatted string representing the current date.
   * - `s3UlidId`: A unique ULID identifier for the job.
   * - `externalJobSource`: The provided external job source.
   */
  prepareCommonExternalJobBatchInferenceS3Config(externalJobSource: string): {
    s3CurrentDate: string;
    s3UlidId: string;
    externalJobSource: string;
  } {
    return {
      s3CurrentDate: dateHelperObj.getCurrentDayMonthYearFormattedDate(),
      s3UlidId: UlidService.getUlidId(),
      externalJobSource: externalJobSource,
    };
  }

  /**
   * Initializes a JSONL file stream for batch inference jobs.
   *
   * This method creates a JSONL file stream at the specified directory path with a unique file identifier.
   * It constructs the file name and path, logs the file path, and returns an object containing the file
   * name, path, and writable stream.
   *
   * @param {string} directoryPath - The path of the directory where the JSONL file will be created.
   * @param {string} fileJsonlRandomId - The unique identifier for the JSONL file.
   * @returns {{ fileName: string; filePath: string; fileStream: WriteStream }} - An object containing the
   *   file name, file path, and a writable file stream.
   */
  initCommonExternalJobBatchInferenceJsonlFileStream(
    directoryPath: string, // @example: "/tmp/fantastic-jobs-batch-inference" or "/tmp/bright-data-jobs-batch-inference"
    fileJsonlRandomId: string
  ): { fileName: string; filePath: string; fileStream: WriteStream } {
    const fileName: string = `file-${fileJsonlRandomId}.jsonl`;

    /**
     * @example
     *  1. "/tmp/fantastic-jobs-batch-inference/file-67fv9y8gi.jsonl"
     *  2. "/tmp/bright-data-jobs-batch-inference/file-67fg8gvi9y8gi.jsonl"
     */
    const filePath: string = fileUtilObj.createPath(directoryPath, fileName);

    global.logger.info("filePath", {
      methodName: this.initCommonExternalJobBatchInferenceJsonlFileStream.name,
    });

    // This is used to write to the file
    const fileStream: WriteStream = fileUtilObj.createFileWriteStream(filePath);

    return { fileName, filePath, fileStream };
  }

  /**
   * uploadCommonExternalJobBatchInferenceJsonlFileToS3
   *
   * Uploads a JSONL file to AWS S3 using the given parameters to construct the S3 key.
   *
   * This method retrieves the file buffer from the specified file path,
   * constructs the S3 key using the provided external job source, date, and ULID,
   * and uploads the file to the S3 bucket defined in the environment variables.
   *
   * Logs the progress and outcome of the upload operation.
   * If the bucket name is not found or the upload fails, it logs an error and returns false.
   *
   * @param {string} filePath - The path of the file to be uploaded to S3.
   * @param {string} fileName - The name of the JSONL file to be uploaded to S3.
   * @param {string} externalJobSource - The source of the external job.
   * @param {string} s3CurrentDate - The current date for S3 upload in "DD-MM-YYYY" format.
   * @param {string} s3UlidId - The unique ULID identifier for S3 upload.
   * @returns {Promise<boolean>} - A promise that resolves to true if the upload is successful,
   *   or false if it fails.
   */
  async uploadCommonExternalJobBatchInferenceJsonlFileToS3(
    filePath: string,
    fileName: string,
    externalJobSource: string,
    s3CurrentDate: string,
    s3UlidId: string
  ): Promise<boolean> {
    try {
      global.logger.info("Uploading file to S3", {
        filePath,
        fileName,
        externalJobSource,
        s3CurrentDate,
        s3UlidId,
        methodName:
          this.uploadCommonExternalJobBatchInferenceJsonlFileToS3.name,
      });

      const fileBuffer: Buffer<ArrayBufferLike> =
        fileUtilObj.getFileBufferByFilePath(filePath);

      const bucketName: string | undefined =
        process.env.APP_AWS_S3_BUCKET_WORKO_BATCH_INFERENCE;
      if (!bucketName) {
        global.logger.error(
          "S3 bucket name not found in environment variables.",
          {
            filePath,
            fileName,
          }
        );

        return false;
      }

      /**
       * @example
       *  1. "input/bright-data-external-jobs/27-07-2025/01K155VTHQBQDTDYE3WPXWAY92/"
       *  2. "input/fantastic-external-jobs/27-07-2025/01K155VTHQBQDTDYE3WPXWAY87/"
       */
      const s3PathPrefix: string =
        APP_CONSTANTS.AWS_S3_DIR_PATHS.BATCH_INFERENCE_INPUT.strtr({
          "{externalJobSource}": externalJobSource,
          "{date}": s3CurrentDate,
          "{ulidId}": s3UlidId,
        });
      global.logger.info("s3PathPrefix", {
        s3PathPrefix,
      });

      const s3Key: string = `${s3PathPrefix}${fileName}`;
      global.logger.info("s3Key", {
        s3Key,
      });

      await awsS3ClientLibrary.uploadObject(bucketName, s3Key, fileBuffer, {
        ContentType: "application/jsonl",
      });

      global.logger.debug(`Uploaded ${fileName} to S3 is successful.`, {
        filePath,
      });

      return true;
    } catch (error) {
      global.logger.error(`Failed to upload ${fileName} to S3`, {
        filePath,
        error,
      });

      return false;
    }
  }

  /**
   * finalizeCommonExternalJobBatchInferenceJsonlFile
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
   * @param {string} s3CurrentDate - The current date for S3 upload.
   * @param {string} s3UlidId - The unique identifier for S3 upload.
   * @param {string} externalJobSource - The source of the external job (e.g. bright-data-jobs).
   * @param {string} [fileName] - The name of the JSONL file to be uploaded to S3.
   * @returns {Promise<void>} - A promise that resolves or rejects based on the
   *   outcome of the file deletion and potential S3 upload.
   */
  async finalizeCommonExternalJobBatchInferenceJsonlFile(
    fileStream: WriteStream,
    filePath: string,
    uploadToS3: boolean,
    s3CurrentDate: string,
    s3UlidId: string,
    externalJobSource: string,
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

            await this.uploadCommonExternalJobBatchInferenceJsonlFileToS3(
              filePath,
              fileName,
              externalJobSource,
              s3CurrentDate,
              s3UlidId
            );
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
   * createCommonExternalJobBatchInference
   * 
   * Creates a batch inference job in AWS Bedrock for an external job.
   *
   * @param {string} s3CurrentDate - The current date for S3 upload.
   * @param {string} s3UlidId - The unique identifier for S3 upload.
   * @param {string} externalJobSource - The source of the external job (e.g. bright-data-jobs).
   * @param {string} modelId - The ID of the model to use for the inference job.
   * @param {string} roleArn - The IAM role to use for the inference job.
   * @param {number} timeOutDurationInHours - The number of hours after which to force the batch inference job to time out.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the batch inference job is created
   *   successfully, or `false` if an error occurs.
   */
  async createCommonExternalJobBatchInference(
    s3CurrentDate: string,
    s3UlidId: string,
    externalJobSource: string,
    modelId: string,
    roleArn: string,
    timeOutDurationInHours: number,
  ): Promise<boolean> {
    const batchInferenceLogId: string = UlidService.getUlidId();

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
        "{externalJobSource}": externalJobSource,
        "{date}": s3CurrentDate,
        "{ulidId}": s3UlidId,
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
        "{externalJobSource}": externalJobSource,
        "{date}": s3CurrentDate,
        "{ulidId}": s3UlidId,
      })}`,

      /**
       * The ID of the AWS account that owns the S3 bucket containing the input data.
       * Pattern: ^[0-9]{12}$
       */
      s3BucketOwner: process.env.APP_AWS_ACCOUNT_ID,
    };

    /**
     * Prepare the input data for the batch inference job
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
      jobName: batchInferenceLogId,

      /**
       * Pattern: ^(arn:aws(-[^:]+)?:bedrock:[a-z0-9-]{1,20}:(([0-9]{12}:custom-model/[a-z0-9-]{1,63}[.]{1}[a-z0-9-:]{1,63}/[a-z0-9]{12}$)|(:foundation-model/([a-z0-9-]{1,63}[.]{1}[a-z0-9-]{1,63}([.]?[a-z0-9-]{1,63})([:][a-z0-9-]{1,63}){0,2})|(([0-9a-zA-Z][_-]?)+)$)|([0-9]{12}:(inference-profile|application-inference-profile)/[a-zA-Z0-9-:.]+$)))|([a-z0-9-]{1,63}[.]{1}[a-z0-9-]{1,63}([.]?[a-z0-9-]{1,63})([:][a-z0-9-]{1,63}){0,2})|(([0-9a-zA-Z][_-]?)+)$
       */
      modelId: modelId,

      outputDataConfig: {
        s3OutputDataConfig: s3OutputDataConfig,
      },

      /**
       * Pattern: ^arn:aws(-[^:]+)?:iam::([0-9]{12})?:role/.+$
       */
      roleArn: roleArn,

      /**
       * The number of hours after which to force the batch inference job to time out.
       * Valid Range: Minimum value of 24. Maximum value of 168.
       */
      timeoutDurationInHours: timeOutDurationInHours,
    };

    // Prepare batch inference create log data
    const createBatchInferenceLogDto: BatchInferenceLogCreateDto = {
      id: batchInferenceLogId,
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
            methodName: this.createCommonExternalJobBatchInference.name,
            modelInvocationJobResult,
          }
        );

        await batchInferenceLogServiceObj.updateBatchInferenceLogForCreateModelInvocationJob(
          createBatchInferenceLogResult.id,
          true,
          modelInvocationJobResult,
          {
            error: {
              errorMessage:
                "Failed to create model invocation job in AWS Bedrock.",
            },
            methodName: this.createCommonExternalJobBatchInference.name,
            className: CommonExternalJobAwsBatchInferenceService.name,
          }
        );

        return false;
      }

      await batchInferenceLogServiceObj.updateBatchInferenceLogForCreateModelInvocationJob(
        createBatchInferenceLogResult.id,
        false,
        modelInvocationJobResult,
        undefined
      );

      return true;
    } catch (error: any) {
      await batchInferenceLogServiceObj.updateBatchInferenceLogForCreateModelInvocationJob(
        createBatchInferenceLogResult.id,
        true,
        undefined,
        {
          error: error,
          methodName: this.createCommonExternalJobBatchInference.name,
          className: CommonExternalJobAwsBatchInferenceService.name,
        }
      );

      return false;
    }
  }
}

const commonExternalJobAwsBatchInferenceServiceObj: CommonExternalJobAwsBatchInferenceService = new CommonExternalJobAwsBatchInferenceService();
export {
  commonExternalJobAwsBatchInferenceServiceObj,
  CommonExternalJobAwsBatchInferenceService,
};
