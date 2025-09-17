// Import file related libraries
import {
  existsSync,
  mkdirSync,
  promises,
  createWriteStream,
  WriteStream,
  readFileSync,
} from "node:fs";

// Import path related libraries
import path from "path";

/**
 * FileUtil
 *
 * Utility class for file-related operations.
 */
class FileUtil {
  /**
   * createPath
   *
   * Creates a path by joining a base path with a name.
   *
   * @example
   *  1. If `basePath` is "/tmp" and `name` is "fantastic-jobs-batch-inference", this will return "/tmp/fantastic-jobs-batch-inference".
   *  2. If `basePath` is "/tmp/fantastic-jobs-batch-inference" and `name` is "file-1.jsonl", this will return "/tmp/fantastic-jobs-batch-inference/file-1.jsonl".
   *
   * @param {string} basePath - The base path of the file or directory.
   * @param {string} name - The name of the file or directory.
   * @returns {string} - A string that represents the path by joining the base path and the name.
   */
  createPath(basePath: string, name: string): string {
    return path.join(basePath, name);
  }

  /**
   * createFileWriteStream
   *
   * Creates a writable file stream at the specified file path.
   * 
   * This function opens a file for writing. If the file exists, its contents are replaced.
   *
   * @param {string} filePath - The path of the file to write to.
   * @returns {fs.WriteStream} - A writable stream for the specified file.
   */
  createFileWriteStream(filePath: string): WriteStream {
    return createWriteStream(filePath, {
      flags: "w",
    });
  }

  /**
   * validateAndCreateDirectory
   *
   * Validates and creates a directory.
   *
   * If the directory does not exist, creates it.
   *
   * @param {string} basePath - The base path of the directory.
   * @param {string} folderName - The name of the directory.
   * @returns {string | undefined} - The path of the directory if it was created, undefined otherwise.
   */
  validateAndCreateDirectory(
    basePath: string,
    folderName: string
  ): string | undefined {
    try {
      // Create the directory path
      const dirPath: string = this.createPath(basePath, folderName);

      // If the directory does not exist, create it
      if (!existsSync(dirPath)) {
        global.logger.info("Creating directory", {
          dirPath,
          methodName: this.validateAndCreateDirectory.name,
        });

        const createdDir: string | undefined = mkdirSync(dirPath, {
          recursive: true,
        });

        if (!createdDir) {
          return undefined;
        }

        global.logger.info("Created directory", {
          createdDir,
          methodName: this.validateAndCreateDirectory.name,
        });
      }

      return dirPath;
    } catch (error) {
      global.logger.error("Error during directory creation", {
        error,
        methodName: this.validateAndCreateDirectory.name,
      });

      /**
       * If the directory creation fails, return undefined,
       */
      return undefined;
    }
  }

  /**
   * getAllFilesFromDirPath
   *
   * Retrieves all files present in the given directory path.
   *
   * @example
   *  If `dirPath` is "/tmp/fantastic-jobs-batch-inference", this will retrieve all files present in that directory.
   *
   * @param {string} dirPath - The path of the directory from which all files need to be retrieved.
   * @returns {Promise<string[]>} - A promise that resolves with an array of file names present in the directory.
   */
  async getAllFilesFromDirPath(dirPath: string): Promise<string[]> {
    return promises.readdir(dirPath);
  }

  /**
   * getFileBufferByFilePath
   * 
   * Retrieves the contents of a file as a Buffer.
   *
   * @example
   *  If `filePath` is "/tmp/fantastic-jobs-batch-inference/file-1.jsonl", this will retrieve the contents of the "file-1.jsonl" file.
   *
   * @param {string} filePath - The path of the file whose contents need to be retrieved.
   * @returns {Buffer<ArrayBufferLike>} - A Buffer containing the contents of the file.
   */
  getFileBufferByFilePath(filePath: string): Buffer<ArrayBufferLike> {
    return readFileSync(filePath);
  }

  /**
   * deleteFileFromPath
   *
   * Deletes a file from the given path.
   *
   * @example
   *  If `filePath` is "/tmp/fantastic-jobs-batch-inference/file-1.jsonl", this will delete the "file-1.jsonl" file.
   *
   * @param {string} filePath - The path of the file to be deleted.
   * @returns {Promise<void>} - A promise that resolves or rejects based on the outcome of the deletion operation.
   */
  async deleteFileFromPath(filePath: string): Promise<void> {
    return promises.unlink(filePath);
  }

  /**
   * deleteMultipleFilesFromPath
   *
   * Deletes multiple files from the specified directory path.
   *
   * @example
   *  If `existingFileNames` contains ["file-1.jsonl", "file-2.jsonl"] and `dirPath` is "/tmp/fantastic-jobs-batch-inference",
   *  this will delete "file-1.jsonl" and "file-2.jsonl" from the directory.
   *
   * @param {string[]} existingFileNames - An array of file names to be deleted.
   * @param {string} dirPath - The directory path where the files are located.
   * @returns {Promise<void[]>} - A promise that resolves when all files have been deleted, or rejects if any deletion fails.
   */
  async deleteMultipleFilesFromPath(
    existingFileNames: string[],
    dirPath: string
  ): Promise<void[]> {
    return Promise.all(
      existingFileNames.map((file: string) => {
        const filePath: string = this.createPath(dirPath, file);
        return this.deleteFileFromPath(filePath);
      })
    );
  }

  /**
   * deleteAllFilesFromDirPath
   *
   * Deletes all files present in the given directory path.
   *
   * This method logs the deletion process and calls the `deleteMultipleFilesFromPath` method
   * to delete all files present in the directory by combining the base path and the file names.
   *
   * @example
   *  If `dirPath` is "/tmp/fantastic-jobs-batch-inference", this will delete all files present in that directory.
   *
   * @param {string} dirPath - The path of the directory from which all files need to be deleted.
   * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating whether the deletion was successful.
   */
  async deleteAllFilesFromDirPath(dirPath: string): Promise<boolean> {
    try {
      const existingFiles: string[] = await this.getAllFilesFromDirPath(
        dirPath
      );
      if (existingFiles.length > 0) {
        global.logger.info("Cleaning up all files in directory", {
          dirPath,
          existingFiles,
          methodName: this.deleteAllFilesFromDirPath.name,
        });
        const deletedFiles: void[] = await this.deleteMultipleFilesFromPath(
          existingFiles,
          dirPath
        );
        global.logger.info("Directory cleanup complete", {
          dirPath,
          deletedFiles, // [LOG]: undefined
          methodName: this.deleteAllFilesFromDirPath.name,
        });
      }

      return true;
    } catch (err) {
      global.logger.error("Error during directory cleanup", {
        dirPath,
        error: err,
      });

      return false;
    }
  }
}

const fileUtilObj = new FileUtil();
export { fileUtilObj, FileUtil };
