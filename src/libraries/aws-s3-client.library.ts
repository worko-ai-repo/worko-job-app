// NPM packages
import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  type Bucket,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";

// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import Utils
import { BaseError } from "../utils/errors.util";

/**
 * AwsS3ClientLibrary
 *
 * This library is a wrapper library for AWS S3 service that has methods regularly used.
 * Feel free to enhance this as needed.
 */
class AwsS3ClientLibrary {
  /**
   * s3
   *
   * AWS S3 object to perform s3 related operations.
   */
  private s3: S3Client;

  /**
   * constructor
   *
   * @param {S3ClientConfig} config
   */
  constructor(private config: S3ClientConfig) {
    this.s3 = new S3Client(this.config);

    // Log message
    console.log(`The '${AwsS3ClientLibrary.name}' is initialised."`, {
      filePath: __filename,
    });
  }

  /**
   * updateConfig
   *
   * Update the AWS S3 configuration
   *
   * @param {S3ClientConfig} config
   * @returns {void}
   */
  updateConfig(config: S3ClientConfig): void {
    this.config = config;
    this.s3 = new S3Client(config);
  }

  /**
   * createBucket
   *
   * Create a new S3 bucket
   *
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  async createBucket(bucketName: string): Promise<void> {
    try {
      await this.s3.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );
    } catch (error: any) {
      console.log("Failed to create S3 bucket.", {
        filePath: __filename,
        methodName: this.createBucket.name,
        bucket: bucketName,
        awsS3Exception: error.message,
      });
      throw new BaseError(APP_CONSTANTS.ERROR_MESSAGE_UNKNOWN_EXCEPTION);
    }
  }

  /**
   * listBuckets
   *
   * List all available S3 buckets
   *
   * @returns {Promise<S3.Bucket[]>}
   */
  async listBuckets(): Promise<Bucket[]> {
    try {
      const response = await this.s3.send(new ListBucketsCommand({}));
      return response.Buckets || [];
    } catch (error: any) {
      console.log("Failed to list S3 buckets.", {
        filePath: __filename,
        methodName: this.listBuckets.name,
        awsS3Exception: error.message,
      });
      throw new BaseError(APP_CONSTANTS.ERROR_MESSAGE_UNKNOWN_EXCEPTION);
    }
  }

  /**
   * doesObjectExists
   *
   * Check if an object exists in an S3 bucket
   *
   * @param {string} bucketName
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async doesObjectExists(bucketName: string, key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );
      return true;
    } catch (error: any) {
      if (
        error.name === "NotFound" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      console.log("Error checking object existence in S3.", {
        filePath: __filename,
        methodName: this.doesObjectExists.name,
        bucket: bucketName,
        key: key,
        awsS3Exception: error.message,
      });
      throw new BaseError(APP_CONSTANTS.ERROR_MESSAGE_UNKNOWN_EXCEPTION);
    }
  }

  /**
   * uploadObject
   *
   * Upload an object to an S3 bucket
   *
   * @param {string} bucketName
   * @param {string} key Complete file path along with filename/key
   * @param {Buffer} data
   * @param {any} params [OPTIONAL] Any additional parameter if you want to pass
   * @returns {Promise<void>}
   */
  async uploadObject(
    bucketName: string,
    key: string,
    data: Buffer,
    params: any = {}
  ): Promise<void> {
    try {
      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: data,
          ...params,
        },
      });
      await upload.done();
    } catch (error: any) {
      console.log("Failed to upload object to S3.", {
        filePath: __filename,
        methodName: this.uploadObject.name,
        bucket: bucketName,
        key: key,
        awsS3Exception: error.message,
      });
      throw new BaseError(APP_CONSTANTS.ERROR_MESSAGE_UNKNOWN_EXCEPTION);
    }
  }

  /**
   * deleteObject
   *
   * Delete an object from an S3 bucket
   *
   * @param {string} bucketName
   * @param {string} key
   * @returns {Promise<void>}
   */
  async deleteObject(bucketName: string, key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );
    } catch (error: any) {
      console.log("Failed to delete object from S3.", {
        filePath: __filename,
        methodName: this.deleteObject.name,
        bucket: bucketName,
        key: key,
        awsS3Exception: error.message,
      });
      throw new BaseError(APP_CONSTANTS.ERROR_MESSAGE_UNKNOWN_EXCEPTION);
    }
  }

  /**
   * generateObjectUrl
   *
   * Generate a pre-signed URL to view the object/file for an object in an S3 bucket
   *
   * @param {string} bucketName
   * @param {string} key
   * @param {number} expiresInSecs
   * @returns {string}
   */
  generateObjectUrl(
    bucketName: string,
    key: string,
    expiresInSecs: number = APP_CONSTANTS.AWS_S3_SIGNED_URL_TO_VIEW_FILE_EXPIRY_IN_SECONDS
  ): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
      { expiresIn: expiresInSecs }
    );
  }

  /**
   * getSignedUrlForUploadingObject
   *
   * Generate a signed URL to upload file/object using the generated url
   *
   * @param {string} bucketName
   * @param {string} key -- Complete file path along with filename/key
   * @param {number} expiresInSecs -- Time in seconds when the signed url should be expired
   * @param {any} params [OPTIONAL] Any additional parameter if you want to pass
   * @returns {Promise<string>}
   */
  async getSignedUrlForUploadingObject(
    bucketName: string,
    key: string,
    expiresInSecs: number = APP_CONSTANTS.AWS_S3_SIGNED_URL_TO_UPLOAD_FILE_EXPIRY_IN_SECONDS,
    params: any = {}
  ): Promise<string> {
    return getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ...params,
      }),
      { expiresIn: expiresInSecs }
    );
  }
}

export { AwsS3ClientLibrary };
