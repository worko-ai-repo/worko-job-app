
// Imports the Google Cloud client library
import {Bucket, SaveData, SaveOptions, Storage, StorageOptions} from '@google-cloud/storage';

// Imports configs
import { awsClientSecretsManagerLibrary } from "../configs/aws-sdk.config";

// Imports dtos
import { GcpStorageSecretResponseDto } from "../dtos/Common.gcp-storage.dto";

// Imports utils
import { BaseError } from '../utils/errors.util';
import HttpStatusCode from '../utils/http-codes.util';

class GcpStorageLibrary {
  private storageClient?: Storage;

  constructor() {
    if (
      !process.env.APP_GCP_PROJECT_ID ||
      !process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE
    ) {
      global.logger.error(
        `PROJECT_ID or AWS_SECRETS_MANAGER is not defined in .env file.`,
        {
          projectId: process.env.APP_GCP_PROJECT_ID,
          awsSecretsManager: process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE,
        }
      );
      throw new BaseError(
        "PROJECT_ID or AWS_SECRETS_MANAGER is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  async initStorageArguments(): Promise<StorageOptions> {
    const credentials: GcpStorageSecretResponseDto =
      await awsClientSecretsManagerLibrary.getParsedSecret<GcpStorageSecretResponseDto>(
        /**
         * @todo: Update secret name on `aws secrets` to a generic one and give permissions to it
         */
        process.env.APP_AWS_SECRETS_MANAGER_GCP_FIRESTORE as string
      );

    const config: StorageOptions = {
      projectId: process.env.APP_GCP_PROJECT_ID,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    };

    return config;
  }

  async getStorageClient(): Promise<Storage> {
    const config = await this.initStorageArguments();
    this.storageClient = new Storage(config);
    return this.storageClient;
  }

  /**
   * Upload object from memory
   * @see https://docs.cloud.google.com/storage/docs/samples/storage-file-upload-from-memory
   */
  async uploadFromMemory(
    bucketName: string, // @example: "worko-batch-inference-dev"
    prefixPath: string, // @example: "input/bright-data-external-jobs/27-07-2025/01K155VTHQBQDTDYE3WPXWAY87"
    fileName: string, // @example: "file-XXXX.jsonl"
    dataToUpload: SaveData,
    options?: SaveOptions
  ): Promise<boolean> {
    try {
      /*
      {
        "bucketName": "worko-batch-inference-file-dev",
        "fileName": "file-01KM0C85M9KBJ62PC1JJQ9E8Y0.jsonl",
        "prefixPath": "input/bright-data-external-jobs/18-03-2026/01KM0C85M78M46S5PF0H5R7X4J"
      }
      */
      global.logger.info("Uploading file to GCP Storage", {
        bucketName,
        fileName,
        prefixPath,
        options,
        dataToUploadType: typeof dataToUpload,
      });

      const storageClient: Storage = await this.getStorageClient();
      const bucket: Bucket = storageClient.bucket(bucketName);
      const file = await bucket.file(`${prefixPath}/${fileName}`);
      const uploadResponse: void = await file.save(dataToUpload, options);

      global.logger.info("File uploaded to GCP Storage", {
        uploadResponse,
        bucketName,
        fileName,
        prefixPath,
      });

      return true;
    } catch (error) {
      global.logger.error("Failed to upload file to GCP Storage", {
        error,
        bucketName,
        fileName,
        dataToUploadType: typeof dataToUpload,
        dataToUpload
      });
      return false;
    }
  }
}

export { GcpStorageLibrary };