
// Import constants
import APP_CONSTANTS from "../configs/constants.config";
import { BRIGHT_DATA_JOB_GCP_BATCH_INFERENCE_APP_CONSTANTS } from "../configs/constants/BrightDataJobGcpBatchInference.constant";
import { BRIGHT_DATA_JOB_APP_CONSTANTS } from "../configs/constants/BrightDataJob.constant";

// Import dtos
import { BrightDataJobApiResponse } from "../dtos/BrightDataJob.dto";
import { JobLocationDto } from "../dtos/Common.dto";
import { GcpBatchInferenceModelInput } from "../dtos/GcpBatchInference.dto";

// Import helpers
import { brightDataJobValidateHelperObj } from "../helpers/BrightDataJobValidate.helper";

// Import models
import { DbGcpFirestoreJobDto } from "../db/gcp-firestore-models/GcpFirestoreJob.model";

// Import services
import { commonExternalJobGcpBatchInferenceServiceObj } from "./CommonExternalJobGcpBatchInference.service";
import { gcpFirestoreJobServiceObj } from "./GcpFirestoreJob.service";
import UlidService from "./Ulid.service";

// Import utils
import { fileUtilObj } from "../utils/file.util";
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class BrightDataJobGcpBatchInferenceService {

  private async initBrightDataJobBatchInferenceUploadDirectory(): Promise<string> {
    const uploadDir: string | undefined =
      fileUtilObj.validateAndCreateDirectory(
        "/tmp",
        APP_CONSTANTS.APP_TEMPORARY_FOLDER_NAMES
          .BRIGHT_DATA_JOBS_GCP_BATCH_INFERENCE
      ); // @example: "/tmp/bright-data-jobs-gcp-batch-inference"

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
    jobDetails: {
      jobTitle: string;
      location: JobLocationDto;
      otherRequirements: string;
    }
  ): GcpBatchInferenceModelInput {
    const {
      GENERATION_CONFIG,
      ROLES,
      PROMPT,
    } = BRIGHT_DATA_JOB_GCP_BATCH_INFERENCE_APP_CONSTANTS.BATCH_INFERENCE_MODEL_INPUT;

    const {
      MAX_OUTPUT_TOKENS,
      TEMPERATURE,
      TOP_P,
    } = GENERATION_CONFIG;

    const jsonLObj: GcpBatchInferenceModelInput = {
      custom_id: ulidId,
      request: {
        contents: [
          {
            role: ROLES.USER,
            parts: [
              {
                text: JSON.stringify(jobDetails),
              },
              {
                text: PROMPT.strtr(
                  {
                    "{promptJobDescription}": jobDescription,
                  }
                )                
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: TEMPERATURE,
          topP: TOP_P,
        },
      },
    };

    return jsonLObj;
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

    const { gcpStorageCurrentDate, gcpStorageUlidId, externalJobSource } =
      commonExternalJobGcpBatchInferenceServiceObj.prepareCommonExternalJobBatchInferenceGcpStorageConfig(
        BRIGHT_DATA_JOB_APP_CONSTANTS.GCP_STORAGE_PATH
      );

    // Split the brightDataJobs into chunks of given `batchSize`
    for (let i = 0; i < brightDataJobs.length; i += batchSize) {
      fileJsonlRandomId = UlidService.getUlidId();
      const { fileName, filePath, fileStream } =
        commonExternalJobGcpBatchInferenceServiceObj.initCommonExternalJobBatchInferenceJsonlFileStream(
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

        const jsonlObj: GcpBatchInferenceModelInput =
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

        // End the file stream without uploading bright data jobs details to `GCP Storage Bucket`
        await commonExternalJobGcpBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
          fileStream,
          filePath,
          false,
          gcpStorageCurrentDate,
          gcpStorageUlidId,
          externalJobSource
        );

        return false;
      }

      global.logger.info("Successfully created bulk index jobs in gcp firestore", {
        methodName: this.processBrightDataJobBatchInference.name,
      });

      // End the file stream and upload the brightData jobs details to `GCP Storage Bucket`
      await commonExternalJobGcpBatchInferenceServiceObj.finalizeCommonExternalJobBatchInferenceJsonlFile(
        fileStream,
        filePath,
        true,
        gcpStorageCurrentDate,
        gcpStorageUlidId,
        externalJobSource,
        fileName
      );
    }

    return commonExternalJobGcpBatchInferenceServiceObj.createCommonExternalJobBatchInference(
      gcpStorageCurrentDate,
      gcpStorageUlidId,
      externalJobSource,
    );
  }
}

const brightDataJobGcpBatchInferenceServiceObj: BrightDataJobGcpBatchInferenceService = new BrightDataJobGcpBatchInferenceService();
export {
  BrightDataJobGcpBatchInferenceService,
  brightDataJobGcpBatchInferenceServiceObj,
};