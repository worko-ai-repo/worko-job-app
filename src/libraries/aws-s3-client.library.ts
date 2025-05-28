// NPM packages
import AWS from "aws-sdk";

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
  private s3: AWS.S3;

  /**
   * constructor
   *
   * @param {AWS.S3.ClientConfiguration} config
   */
  constructor(private config: AWS.S3.ClientConfiguration) {
    this.s3 = new AWS.S3(this.config);

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
   * @param {AWS.S3.ClientConfiguration} config
   * @returns {void}
   */
  updateConfig(config: AWS.S3.ClientConfiguration): void {
    this.config = config;
    this.s3 = new AWS.S3(config);
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
      await this.s3
        .createBucket({
          Bucket: bucketName,
        })
        .promise();
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
  async listBuckets(): Promise<AWS.S3.Bucket[]> {
    try {
      const response = await this.s3.listBuckets().promise();
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
    return this.s3
      .headObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise()
      .then(() => {
        return true;
      })
      .catch((error: any) => {
        if (error.code === "NotFound") {
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
      });
  }

  /**
   * uploadObject
   *
   * Upload an object to an S3 bucket
   *
   * @NOTE: This "uploadObject" method uses aws v2 SDK. If you want to use
   * aws v3 SDK discuss with `CTO` and refer: @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html
   *
   * @param {string} bucketName
   * @param {string} key Complete file path along with filename/key
   * @param {Buffer<ArrayBufferLike>} data
   * @param {any} params [OPTIONAL] Any additional parameter if you want to pass
   * @returns {Promise<void>}
   */
  async uploadObject(
    bucketName: string,
    key: string,
    data: Buffer<ArrayBufferLike>,
    params: any = {}
  ): Promise<void> {
    try {
      await this.s3
        .upload({
          ...params,
          Bucket: bucketName,
          Key: key,
          Body: data,
        })
        .promise();
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
      await this.s3
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
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
    return this.s3.getSignedUrlPromise("getObject", {
      Bucket: bucketName,
      Key: key,
      Expires: expiresInSecs,
    });
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
    return this.s3.getSignedUrlPromise("putObject", {
      ...params,
      Bucket: bucketName,
      Key: key,
      Expires: expiresInSecs,
    });
  }
}

export { AwsS3ClientLibrary };
