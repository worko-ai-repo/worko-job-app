// Import configs
import { awsS3ClientLibrary } from "../configs/aws-sdk.config";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import helpers
import { dateHelperObj } from "../helpers/date.helper";

// Import utils
import { fileUtilObj } from "../utils/file.util";

/**
 * FileService
 *
 * Class responsible for managing file related operations
 */
class FileService {
  /**
   * uploadJsonlFileToS3
   * 
   * Uploads a JSONL file to S3 bucket.
   * 
   * @param {string} filePath - The path of the JSONL file to be uploaded.
   * @param {string} fileName - The name of the JSONL file to be uploaded.
   * @returns {Promise<boolean>}
   */
  async uploadJsonlFileToS3(filePath: string, fileName: string): Promise<boolean> {
    try {
      global.logger.info("Uploading file to S3", {
        filePath,
        fileName,
      });

      const fileBuffer: Buffer<ArrayBufferLike> = fileUtilObj.getFileBufferByFilePath(filePath);

      const bucketName: string | undefined = process.env.APP_AWS_S3_BUCKET_WORKO_BATCH_INFERENCE;
      if (!bucketName) {
        global.logger.error("S3 bucket name not found in environment variables.", {
          filePath,
          fileName,
        });

        return false;
      }

      const currentDate: string = dateHelperObj.getCurrentDayMonthYearFormattedDate();
      global.logger.info("currentDate", {
        currentDate,
      });

      /**
       * @example
       *    input/13-05-2025/
       */
      const s3PathPrefix: string =
        APP_CONSTANTS.AWS_S3_DIR_PATHS.BATCH_INFERENCE_INPUT.strtr({
          "{date}": currentDate,
        });
      global.logger.info("s3PathPrefix", {
        s3PathPrefix,
      });

      /**
       * @example
       *    input/13-05-2025/file-1.jsonl
       */
      const s3Key: string = `${s3PathPrefix}${fileName}`;
      global.logger.info("s3Key", {
        s3Key,
      });

      await awsS3ClientLibrary.uploadObject(
        bucketName,
        s3Key,
        fileBuffer,
        { ContentType: "application/jsonl" }
      );

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
}

// Create an instance of the class
const fileServiceObj = new FileService();

// Export the class
export { FileService, fileServiceObj };
