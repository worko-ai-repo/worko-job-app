
// Import constants
import APP_CONSTANTS from "../configs/constants.config";
import { BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS } from "../configs/constants/BrightDataJobBatchInference.constant";
import { BRIGHT_DATA_JOB_APP_CONSTANTS } from "../configs/constants/BrightDataJob.constant";

// Import dtos
import { BrightDataJobApiResponse } from "../dtos/BrightDataJob.dto";
import { BatchInferenceModelInput } from "../dtos/BatchInference.dto";
import { AwsS3VectorJobCreateOrUpdateJobDataDto, AwsS3VectorJobCreateOrUpdateParsedResponseDto } from "../dtos/AwsS3VectorJob.dto";

// Import helpers
import { brightDataJobValidateHelperObj } from "../helpers/BrightDataJobValidate.helper";

// Import models
import { DbJobAwsOpensearchDto } from "../db/OpenSearch-models/OpenSearchJob.model";

// Import services
import { commonExternalJobBatchInferenceServiceObj } from "./CommonExternalJobBatchInference.service";
import { jobServiceObj } from "./Job.service";
import UlidService from "./Ulid.service";
import { awsS3VectorJobServiceObj } from "./AwsS3VectorJob.service";

// Import utils
import { fileUtilObj } from "../utils/file.util";
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class BrightDataJobBatchInferenceService {
  /**
   * initBrightDataJobBatchInferenceUploadDirectory
   *
   * Initializes the upload directory for batch inference processing.
   *
   * This method validates and creates a temporary directory used for
   * storing batch inference files. It ensures the directory exists
   * and deletes any existing files within it. If directory creation
   * or file deletion fails, it throws an exception
   * with the appropriate error details and HTTP status code.
   *
   * @returns {Promise<string>} - A promise that resolves to the path of the upload directory.
   * @throws {BaseError} - Throws an error if directory creation or file deletion fails.
   */
  private async initBrightDataJobBatchInferenceUploadDirectory(): Promise<string> {
    const uploadDir: string | undefined =
      fileUtilObj.validateAndCreateDirectory(
        "/tmp",
        APP_CONSTANTS.APP_TEMPORARY_FOLDER_NAMES
          .BRIGHT_DATA_JOBS_BATCH_INFERENCE
      ); // @example: "/tmp/bright-data-jobs-batch-inference"

    if (!uploadDir) {
      throw new BaseError(
        `Failed to validate and create directory.`,
        HttpStatusCode.BAD_REQUEST_400
      );
    }

    const deletedFilesStatus: boolean =
      await fileUtilObj.deleteAllFilesFromDirPath(uploadDir);

    if (!deletedFilesStatus) {
      throw new BaseError(
        `Something went wrong while checking and deleting old files.`,
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    return uploadDir;
  }

  /**
   * buildBrightDataBatchInferenceRecord
   *
   * Constructs a BatchInferenceModelInput object from a job description for batch inference.
   *
   * This method takes a unique identifier and a job description string, then creates
   * a BatchInferenceModelInput object. The object contains the record ID and model input
   * details, including versioning, token limits, and user messages with the job description
   * embedded in a specific prompt format.
   *
   * @param {string} ulidId - A unique identifier for the job record.
   * @param {string} jobDescription - The job description to include in the model input.
   * @returns {BatchInferenceModelInput} - The formatted JSONL object for batch inference.
   */
  private buildBrightDataBatchInferenceRecord(
    ulidId: string,
    jobDescription: string
  ): BatchInferenceModelInput {
    // Prepare JSONL line for model input
    const jsonlObj: BatchInferenceModelInput = {
      recordId: ulidId, // `id` attribute of `OpenSearchJob.model.ts`
      modelInput: {
        anthropic_version:
          BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
            .BATCH_INFERENCE_MODEL_INPUT.ANTHROPIC_VERSION,
        max_tokens:
          BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
            .BATCH_INFERENCE_MODEL_INPUT.MAX_TOKENS,
        messages: [
          {
            role: BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
              .BATCH_INFERENCE_MODEL_INPUT.ROLES.USER,
            content: [
              {
                type: BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
                  .BATCH_INFERENCE_MODEL_INPUT.CONTENT_TYPES.TEXT,
                text: BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT.PROMPT.strtr(
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

  async processBrightDataJobBatchInference(
    brightDataJobs: BrightDataJobApiResponse[]
  ) {
    global.logger.info("Processing BrightData Jobs [Service]", {
      methodName: this.processBrightDataJobBatchInference.name,
      totalLengthOfBrightDataJobs: brightDataJobs.length,
    });

    // Initialize the upload directory
    const uploadDir: string = await this.initBrightDataJobBatchInferenceUploadDirectory();

    /**
     * This is the maximum number of jobs that can be indexed in a single bulk request to the OpenSearch index,s3 vector
     * and write to single JSONL file.
     */
    const batchSize: number = APP_CONSTANTS.AWS_OPENSEARCH_AND_S3_VECTOR_BULK_CREATE_COUNT;

    // Initialize a counter for creating JSONL files
    let fileJsonlRandomId: string = "";

    const { s3CurrentDate, s3UlidId, externalJobSource } =
      commonExternalJobBatchInferenceServiceObj.prepareCommonExternalJobBatchInferenceS3Config(
        BRIGHT_DATA_JOB_APP_CONSTANTS.AWS_S3_PATH
      );

    // Split the brightDataJobs into chunks of given `batchSize`
    for (let i = 0; i < brightDataJobs.length; i += batchSize) {
      fileJsonlRandomId = UlidService.getUlidId();
      const { fileName, filePath, fileStream } =
        commonExternalJobBatchInferenceServiceObj.initCommonExternalJobBatchInferenceJsonlFileStream(
          uploadDir,
          fileJsonlRandomId
        );

      // Get the current batch
      const batch: BrightDataJobApiResponse[] = brightDataJobs.slice(
        i,
        i + batchSize
      );

      // Initialize an empty array to hold the bulk job data
      const bulkJobData: (
        | DbJobAwsOpensearchDto
        | {
            index: {
              _index: string;
              _id: string;
            };
          }
      )[] = [];

      /**
       * Initialize an empty array to hold the jobs data to create in aws S3 vector 
       */
      const bulkS3VectorCreateJobData: AwsS3VectorJobCreateOrUpdateJobDataDto[] = [];

      // Loop through the current batch of jobs
      for (const eachJob of batch) {
        const validateCompanyName: boolean = brightDataJobValidateHelperObj.validateBrightDataJobCompanyName(
          eachJob.company_name,
        );
        
        if(!validateCompanyName) {
          continue;
        }

        // Generate a unique ULID ID
        const brightDataJobId: string = UlidService.getUlidId();

        const transformedBrightDataJob: DbJobAwsOpensearchDto =
          jobServiceObj.transformBrightDataJobToAwsOpensearchJobDto(
            brightDataJobId,
            eachJob
          );

        // Push the job data to the bulk data array
        bulkJobData.push(
          {
            index: {
              _index: jobServiceObj.getIndexName(),
              _id: brightDataJobId,
            },
          },
          transformedBrightDataJob
        );

        bulkS3VectorCreateJobData.push(
          awsS3VectorJobServiceObj.prepareAwsS3VectorJobsDataCreateOrUpdateDto(
            awsS3VectorJobServiceObj.getAwsS3VectorJobIndexName(),
            transformedBrightDataJob
          )
        );

        const jsonlObj: BatchInferenceModelInput =
          this.buildBrightDataBatchInferenceRecord(
            brightDataJobId,
            transformedBrightDataJob.jobDescription ??
              "Job Description Not Found."
          );

        // Write JSONL line for model input
        fileStream.write(JSON.stringify(jsonlObj) + "\n");
      }

      // Run bulk operations in parallel
      const [success, successAwsS3VectorJobCreate] = await Promise.all([
        jobServiceObj.createBulkJobs(bulkJobData),
        awsS3VectorJobServiceObj.createBulkAwsS3VectorJobs({
          jobData: bulkS3VectorCreateJobData,
          indexName: awsS3VectorJobServiceObj.getAwsS3VectorJobIndexName(),
        })
      ]);

      global.logger.debug(
        `Bulk index jobs in aws opensearch success status [SERVICE]`,
        { success }
      );

      // If any batch fails, return false
      if (!success) {
        global.logger.error(`Bulk index jobs in aws opensearch failed`, {
          methodName: this.processBrightDataJobBatchInference.name,
        });

        // End the file stream without uploading bright data jobs details to `S3`
        await commonExternalJobBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
          fileStream,
          filePath,
          false,
          s3CurrentDate,
          s3UlidId,
          externalJobSource
        );

        return false;
      }

      if(successAwsS3VectorJobCreate?.results?.success !== bulkS3VectorCreateJobData.length) {
        global.logger.error(`AwsS3VectorJob create failed`, {
          methodName: this.processBrightDataJobBatchInference.name,
          successAwsS3VectorJobCreate,
        });

        /**
         * @todo: Need to think how to handle the failure and implement rollback
         */

        // End the file stream without uploading bright data jobs details to `S3`
        await commonExternalJobBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
          fileStream,
          filePath,
          false,
          s3CurrentDate,
          s3UlidId,
          externalJobSource
        );

        return false;
      }

      // End the file stream and upload the brightData jobs details to `S3`
      await commonExternalJobBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
        fileStream,
        filePath,
        true,
        s3CurrentDate,
        s3UlidId,
        externalJobSource,
        fileName
      );
    }

    return commonExternalJobBatchInferenceServiceObj.createCommonExternalJobBatchInference(
      s3CurrentDate,
      s3UlidId,
      externalJobSource,
      BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
        .BATCH_INFERENCE_AWS_BEDROCK_ARNS.MODEL,
      BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
        .BATCH_INFERENCE_AWS_BEDROCK_ARNS.SERVICE_ROLE,
      BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS
        .BATCH_INFERENCE_TIME_OUT_DURATION_IN_HOURS.MIN
    );
  }
}

const brightDataJobBatchInferenceServiceObj: BrightDataJobBatchInferenceService = new BrightDataJobBatchInferenceService();
export {
   BrightDataJobBatchInferenceService,
   brightDataJobBatchInferenceServiceObj
};