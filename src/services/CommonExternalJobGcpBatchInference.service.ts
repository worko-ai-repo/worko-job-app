// Import file related libraries
import { WriteStream } from "node:fs";

// Import aiplatform related libraries
import { protos } from "@google-cloud/aiplatform";

// Import constants and configs
import {
  gcpAiPlatformBatchInferenceLibrary,
  gcpStorageLibrary,
} from "../configs/gcp-sdk.config";

import APP_CONSTANTS from "../configs/constants.config";

// Import enums
import { BatchInferenceLogDbJobStatusEnum } from "../enums/GcpFirestoreBatchInferenceLog.enum";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import models

// Import services
import UlidService from "./Ulid.service";
import { gcpFirestoreBatchInferenceLogServiceObj } from "./GcpFirestoreBatchInferenceLog.service";

// Import utils
import { fileUtilObj } from "../utils/file.util";

class CommonExternalJobGcpBatchInferenceService {
  prepareCommonExternalJobBatchInferenceGcpStorageConfig(externalJobSource: string): {
    gcpStorageCurrentDate: string;
    gcpStorageUlidId: string;
    externalJobSource: string;
  } {
    return {
      gcpStorageCurrentDate: dateHelperObj.getCurrentDayMonthYearFormattedDate(),
      gcpStorageUlidId: UlidService.getUlidId(),
      externalJobSource: externalJobSource,
    };
  }

  initCommonExternalJobBatchInferenceJsonlFileStream(
    directoryPath: string, // @example: "/tmp/bright-data-jobs-batch-inference"
    fileJsonlRandomId: string
  ): { fileName: string; filePath: string; fileStream: WriteStream } {
    const fileName: string = `file-${fileJsonlRandomId}.jsonl`;

    /**
     * @example
     *  2. "/tmp/bright-data-jobs-batch-inference/file-{ulidId}.jsonl"
     */
    const filePath: string = fileUtilObj.createPath(directoryPath, fileName);

    global.logger.info("filePath", {
      filePath,
      directoryPath,
      fileJsonlRandomId,
      methodName: this.initCommonExternalJobBatchInferenceJsonlFileStream.name,
    });

    // This is used to write to the file
    const fileStream: WriteStream = fileUtilObj.createFileWriteStream(filePath);

    return { fileName, filePath, fileStream };
  }

  async uploadCommonExternalJobBatchInferenceJsonlFileToGcpStorage(
    filePath: string,
    fileName: string, // file-${fileJsonlRandomId}.jsonl
    externalJobSource: string,
    gcpStorageCurrentDate: string,
    gcpStorageUlidId: string
  ): Promise<boolean> {
    try {
      global.logger.info("Uploading file to GCP Storage bucket", {
        filePath,
        fileName,
        externalJobSource,
        gcpStorageCurrentDate,
        gcpStorageUlidId,
        methodName:
          this.uploadCommonExternalJobBatchInferenceJsonlFileToGcpStorage.name,
      });

      const fileBuffer: Buffer<ArrayBufferLike> =
        fileUtilObj.getFileBufferByFilePath(filePath);

      const bucketName: string | undefined =
        process.env.APP_GCP_STORAGE_BUCKET_WORKO_BATCH_INFERENCE;
      if (!bucketName) {
        global.logger.error(
          "GCP Storage bucket name not found in environment variables.",
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
      const gcpStoragePathPrefix: string =
        APP_CONSTANTS.GCP_STORAGE_DIR_PATHS.BATCH_INFERENCE_INPUT.strtr({
          "{externalJobSource}": externalJobSource, // "bright-data-external-jobs"
          "{date}": gcpStorageCurrentDate,
          "{ulidId}": gcpStorageUlidId,
        });
      global.logger.info("gcpStoragePathPrefix", {
        gcpStoragePathPrefix,
      });

      return gcpStorageLibrary.uploadFromMemory(
        bucketName,
        gcpStoragePathPrefix,
        fileName,
        fileBuffer,
        {
          resumable: false,
        }
      );
    } catch (error) {
      global.logger.error(
        `Failed to upload ${fileName} to GCP Storage bucket`,
        {
          filePath,
          error,
        }
      );

      return false;
    }
  }

  async finalizeCommonExternalJobBatchInferenceJsonlFile(
    fileStream: WriteStream,
    filePath: string,
    uploadToGcpStorageBucket: boolean,
    gcpStorageCurrentDate: string,
    gcpStorageUlidId: string,
    externalJobSource: string,
    fileName?: string // file-${fileJsonlRandomId}.jsonl
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fileStream.end(async () => {
        try {
          if (uploadToGcpStorageBucket && fileName) {
            global.logger.info("Uploading JSONL file to GCP Storage bucket.", {
              filePath,
              fileName,
            });

            await this.uploadCommonExternalJobBatchInferenceJsonlFileToGcpStorage(
              filePath,
              fileName,
              externalJobSource,
              gcpStorageCurrentDate,
              gcpStorageUlidId
            );
          }

          // Delete the local JSONL file
          await fileUtilObj.deleteFileFromPath(filePath);
          global.logger.info("Deleted local JSONL file after successfull.", {
            filePath,
          });

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

  async createCommonExternalJobBatchInference(
    gcpStorageCurrentDate: string,
    gcpStorageUlidId: string,
    externalJobSource: string
  ): Promise<boolean> {
    const batchInferenceLogId: string = UlidService.getUlidId();
    global.logger.info("Create batch inference", {
      batchInferenceLogId,
      gcpStorageCurrentDate,
      externalJobSource,
    });

    try {
      const batchPredictionJobResult: {
        input: protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest;
        output: [protos.google.cloud.aiplatform.v1.IBatchPredictionJob, (protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest | undefined), {} | undefined];
      } =
        await gcpAiPlatformBatchInferenceLibrary.createBatchPredictionJob(
          `gs://${
            process.env.APP_GCP_STORAGE_BUCKET_WORKO_BATCH_INFERENCE
          }/${APP_CONSTANTS.GCP_STORAGE_DIR_PATHS.BATCH_INFERENCE_INPUT.strtr({
            "{externalJobSource}": externalJobSource,
            "{date}": gcpStorageCurrentDate,
            "{ulidId}": gcpStorageUlidId,
          })}/*`,
          `gs://${
            process.env.APP_GCP_STORAGE_BUCKET_WORKO_BATCH_INFERENCE
          }/${APP_CONSTANTS.GCP_STORAGE_DIR_PATHS.BATCH_INFERENCE_OUTPUT.strtr({
            "{externalJobSource}": externalJobSource,
            "{date}": gcpStorageCurrentDate,
            "{ulidId}": gcpStorageUlidId,
          })}/`,
          batchInferenceLogId,
          `publishers/google/models/${process.env.APP_GCP_AI_PLATFORM_BATCH_INFERENCE_MODEL_NAME}`,
        );
      if(batchPredictionJobResult.output[0].error || batchPredictionJobResult.output[0].state!=="JOB_STATE_PENDING") {
        global.logger.error("Failed to create batch prediction job in GCP AI Platform. [service]", {
          batchPredictionJobResult,
          batchInferenceLogId,
        });
        const failedDate: string = dateHelperObj.getISODate();
        await gcpFirestoreBatchInferenceLogServiceObj.createBatchInferenceLog<
          protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest,
          [protos.google.cloud.aiplatform.v1.IBatchPredictionJob, (protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest | undefined), {} | undefined]
        >({
          id: batchInferenceLogId,
          createdAt: failedDate,
          updatedAt: failedDate,
          createBatchInferenceJobInput: batchPredictionJobResult.input,
          createBatchInferenceJobOutput: batchPredictionJobResult.output,
          createBatchInferenceJobStatus: BatchInferenceLogDbJobStatusEnum.FAILED,
          errorDetails: {
            error: batchPredictionJobResult.output[0].error,
            methodName: this.createCommonExternalJobBatchInference.name,
            className: CommonExternalJobGcpBatchInferenceService.name,
          },
        })

        return false;
      }

      const successDate: string = dateHelperObj.getISODate();
      await gcpFirestoreBatchInferenceLogServiceObj.createBatchInferenceLog<
        protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest,
        [protos.google.cloud.aiplatform.v1.IBatchPredictionJob, (protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest | undefined), {} | undefined]
      >({
        id: batchInferenceLogId,
        createdAt: successDate,
        updatedAt: successDate,
        createBatchInferenceJobInput: batchPredictionJobResult.input,
        createBatchInferenceJobOutput: batchPredictionJobResult.output,
        createBatchInferenceJobStatus: BatchInferenceLogDbJobStatusEnum.IN_PROGRESS,
      })

      return true;
    } catch (error: any) {
      global.logger.error(
        `Failed to create batch inference job in GCP. [service]`,
        {
          methodName: this.createCommonExternalJobBatchInference.name,
          error,
        }
      );

      const failedDate: string = dateHelperObj.getISODate();
      await gcpFirestoreBatchInferenceLogServiceObj.createBatchInferenceLog<
        protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest,
        [protos.google.cloud.aiplatform.v1.IBatchPredictionJob, (protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest | undefined), {} | undefined]
      >({
        id: batchInferenceLogId,
        createdAt: failedDate,
        updatedAt: failedDate,
        createBatchInferenceJobInput: {},
        createBatchInferenceJobStatus: BatchInferenceLogDbJobStatusEnum.FAILED,
        errorDetails: {
          error,
          batchInferenceLogId,
          methodName: this.createCommonExternalJobBatchInference.name,
          className: CommonExternalJobGcpBatchInferenceService.name,
        },
      })

      return false;
    }
  }
}

const commonExternalJobGcpBatchInferenceServiceObj: CommonExternalJobGcpBatchInferenceService =
  new CommonExternalJobGcpBatchInferenceService();
export {
  commonExternalJobGcpBatchInferenceServiceObj,
  CommonExternalJobGcpBatchInferenceService,
};
