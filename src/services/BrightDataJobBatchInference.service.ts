
// Import constants
import APP_CONSTANTS from "../configs/constants.config";
import { BRIGHT_DATA_JOB_BATCH_INFERENCE_APP_CONSTANTS } from "../configs/constants/BrightDataJobBatchInference.constant";
import { BRIGHT_DATA_JOB_APP_CONSTANTS } from "../configs/constants/BrightDataJob.constant";

// Import dtos
import { BrightDataJobApiResponse } from "../dtos/BrightDataJob.dto";
import { BatchInferenceModelInput } from "../dtos/BatchInference.dto";
import { JobLocationDto } from "../dtos/Common.dto";

// Import helpers
import { brightDataJobValidateHelperObj } from "../helpers/BrightDataJobValidate.helper";

// Import models
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

// Import services
import { commonExternalJobBatchInferenceServiceObj } from "./CommonExternalJobBatchInference.service";
import { gcpFirestoreJobServiceObj } from "./GcpFirestoreJob.service";
import UlidService from "./Ulid.service";

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


  private buildBrightDataBatchInferenceRecord(
    ulidId: string,
    jobDescription: string,
    opensearchJobDetails: {
      jobTitle: string;
      location: JobLocationDto;
      otherRequirements: string;
    }
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
              // location, jobTitle, otherRequirements(as empty string)
            content: [
              {
                type: "text",
                /**
                 * @description 
                 *  First we are storing "Bright data external jobs" in to opensearch,
                 *  next we are storing these job details in to `s3 path` as part of batch inference.
                 *  And we create batch inference in aws bedrock then batch inference will generate output in 
                 *  s3 path and these "opensearchJobDetails" will be used to store in "s3 vector"
                 */
                text: JSON.stringify(opensearchJobDetails),
              },
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

    const batchSize: number = APP_CONSTANTS.GCP_FIRESTORE_BULK_CREATE_COUNT;

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
      const bulkGcpFirestoreJobData: DbGcpFirestoreJobDto[] = [];

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

        const transformedBrightDataJob: DbGcpFirestoreJobDto =
          gcpFirestoreJobServiceObj.transformBrightDataJobToGcpFirestoreJobDto(
            brightDataJobId,
            eachJob
          );

        // Push the job data to the bulk data array
        bulkGcpFirestoreJobData.push(
          transformedBrightDataJob
        );

        const jsonlObj: BatchInferenceModelInput =
          this.buildBrightDataBatchInferenceRecord(
            brightDataJobId,
            transformedBrightDataJob.jobDescription ??
              "Job Description Not Found.",
            {
              jobTitle: transformedBrightDataJob.jobTitle,
              location: transformedBrightDataJob.location ?? {
                city: [],
                state: [],
                country: [],
                fullLocation: [],
              },
              otherRequirements: transformedBrightDataJob.otherRequirements ?? "",
            }
          );

        // Write JSONL line for model input
        fileStream.write(JSON.stringify(jsonlObj) + "\n");
      }

      const success: boolean = await gcpFirestoreJobServiceObj.createBulkJobs(bulkGcpFirestoreJobData);

      // If any batch fails, return false
      if (!success) {
        global.logger.error(`Bulk index jobs in gcp firestore failed`, {
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

      global.logger.info("Successfully created bulk index jobs in gcp firestore", {
        methodName: this.processBrightDataJobBatchInference.name,
      });

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