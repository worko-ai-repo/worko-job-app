
// Import constants and configs
import APP_CONSTANTS from "../configs/constants.config";
import { FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS } from "../configs/constants/FantasticJobBatchInference.constant";
import { FANTASTIC_JOB_APP_CONSTANTS } from "../configs/constants/FantasticJob.constant";

// Import dtos
import { BatchInferenceModelInput } from "../dtos/BatchInference.dto";
import { FantasticJobApiResponse } from "../dtos/FantasticJob.dto";
import { FantasticJobLogCommonUpdateDto } from "../dtos/FantasticJobLog.dto";

// Import enums
import { FantasticJobLogJobsDbStoredStatusEnum } from "../enums/FantasticJobLog.enum";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";
import { DbFantasticJobLogDto } from "../db/models/FantasticJobLog.model";

// Import services
import { commonExternalJobBatchInferenceServiceObj } from "./CommonExternalJobBatchInference.service";
import { jobServiceObj } from "./Job.service";
import UlidService from "./Ulid.service";
import { fantasticJobLogServiceObj } from "./FantasticJobLog.service";

// Import utils
import { BaseError } from "../utils/errors.util";
import { fileUtilObj } from "../utils/file.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * FantasticJobBatchInferenceService
 * 
 * NOTE: This is used for "Fantastic Job Batch Inference".
 * 
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/batch-inference.html
 */
class FantasticJobBatchInferenceService {
  /**
   * buildFantasticJobBatchInferenceRecord
   *
   * Transforms a job description into a BatchInferenceModelInput object formatted as a JSONL line.
   *
   * This function takes a unique identifier and a job description string, then constructs
   * a BatchInferenceModelInput object which includes the record ID and model input details
   * suitable for inference processing. The model input includes versioning, token limits,
   * and user messages, which contain the job description details.
   *
   * @param {string} fantasticJobId - A unique identifier for the job record.
   * @param {string} jobDescription - The job description to be included in the model input.
   * @returns {BatchInferenceModelInput} - The formatted JSONL object for batch inference.
   */
  private buildFantasticJobBatchInferenceRecord(
    fantasticJobId: string,
    jobDescription: string
  ): BatchInferenceModelInput {
    // Prepare JSONL line for model input
    const jsonlObj: BatchInferenceModelInput = {
      recordId: fantasticJobId, // `id` attribute of `OpenSearchJob.model.ts`
      modelInput: {
        anthropic_version:
          FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT
            .ANTHROPIC_VERSION,
        max_tokens:
          FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT.MAX_TOKENS,
        messages: [
          {
            role: FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT
              .ROLES.USER,
            content: [
              {
                type: FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT
                  .CONTENT_TYPES.TEXT,
                text: FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT.PROMPT.strtr(
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
            className: FantasticJobBatchInferenceService.name,
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
   * initFantasticJobBatchInferenceUploadDirectory
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
  private async initFantasticJobBatchInferenceUploadDirectory(
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
        methodName: this.updateFantasticJobLogForBulkCreate.name,
        className: FantasticJobBatchInferenceService.name,
      };
    }

    const updatedLog: DbFantasticJobLogDto =
      await fantasticJobLogServiceObj.updateFantasticJobLogById(
        fantasticJobLogId,
        updateData
      );
    global.logger.info(`Fantastic job retrieval logs:`, {
      updatedLog,
      methodName: this.processFantasticJobBatchInference.name,
    });

    return updatedLog;
  }

  /**
   * processFantasticJobBatchInference
   *
   * @param {string} fantasticJobLogId - `id` attribute of `FantasticJobLog.model.ts` table in dynamodb
   * @param {FantasticJobApiResponse[]} bulkJobDetails - An array of fantastic job details to be indexed in the OpenSearch index and uploaded to `S3`.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all operations in the bulk request succeed, or `false` if any operation fails.
   */
  async processFantasticJobBatchInference(
    fantasticJobLogId: string,
    bulkJobDetails: FantasticJobApiResponse[]
  ): Promise<boolean> {
    // global logger
    global.logger.debug(
      `Process batch inference for fantastic jobs [SERVICE]`,
      {
        fantasticJobLogId,
        lengthOfBulkJobDetails: bulkJobDetails.length,
        methodName: this.processFantasticJobBatchInference.name,
      }
    );

    // Initialize the upload directory
    const uploadDir: string = await this.initFantasticJobBatchInferenceUploadDirectory(fantasticJobLogId);

    /**
     * This is the maximum number of jobs that can be indexed in a single bulk request to the OpenSearch index
     * and write to single JSONL file.
     */
    const batchSize: number = APP_CONSTANTS.AWS_OPENSEARCH_BULK_CREATE_COUNT;

    // Initialize a counter for creating JSONL files
    let fileJsonlRandomId: string = "";

    // Initialize a counter for storing jobs in db
    let openSearchDbStoredCount: number = 0;

    const { s3CurrentDate, s3UlidId, externalJobSource } =
      commonExternalJobBatchInferenceServiceObj.prepareCommonExternalJobBatchInferenceS3Config(
        FANTASTIC_JOB_APP_CONSTANTS.AWS_S3_PATH
      );

    // Split the bulkJobDetails into chunks of given `batchSize`
    for (let i = 0; i < bulkJobDetails.length; i += batchSize) {
      fileJsonlRandomId = UlidService.getUlidId();
      const { fileName, filePath, fileStream } =
        commonExternalJobBatchInferenceServiceObj.initCommonExternalJobBatchInferenceJsonlFileStream(
          uploadDir,
          fileJsonlRandomId
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
        const fantasticJobId: string = UlidService.getUlidId();

        const transformFantasticJob: DbJobAwsOpensearchDto =
          jobServiceObj.transformFantasticJobToAwsOpensearchJobDto(
            fantasticJobId,
            eachFantasticJob
          );

        // Push the job data to the bulk data array
        bulkJobData.push(
          {
            index: {
              _index: jobServiceObj.getIndexName(),
              _id: fantasticJobId,
            },
          },
          transformFantasticJob
        );

        const jsonlObj: BatchInferenceModelInput =
          this.buildFantasticJobBatchInferenceRecord(
            fantasticJobId,
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
          methodName: this.processFantasticJobBatchInference.name,
        });

        // End the file stream without uploading fantastic jobs details to `S3`
        await commonExternalJobBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
          fileStream,
          filePath,
          false,
          s3CurrentDate,
          s3UlidId,
          externalJobSource
        );

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
      await commonExternalJobBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
        fileStream,
        filePath,
        true,
        s3CurrentDate,
        s3UlidId,
        externalJobSource,
        fileName,
      );
    }

    // Update the fantastic job log for success status
    await this.updateFantasticJobLogForBulkCreate(
      fantasticJobLogId,
      openSearchDbStoredCount,
      false
    );

    return commonExternalJobBatchInferenceServiceObj.createCommonExternalJobBatchInference(
      s3CurrentDate,
      s3UlidId,
      externalJobSource,
      FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_AWS_BEDROCK_ARNS.MODEL,
      FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_AWS_BEDROCK_ARNS.SERVICE_ROLE,
      FANTASTIC_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_TIME_OUT_DURATION_IN_HOURS.MIN,
    );
  }
}

const fantasticJobBatchInferenceServiceObj: FantasticJobBatchInferenceService = new FantasticJobBatchInferenceService();
export {
  fantasticJobBatchInferenceServiceObj,
  FantasticJobBatchInferenceService,
};