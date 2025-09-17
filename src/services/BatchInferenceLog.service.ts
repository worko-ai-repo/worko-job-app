
// Import bedrock packages
import { CreateModelInvocationJobCommandOutput } from "@aws-sdk/client-bedrock";

// Import dtos
import { batchInferenceLogDaoObj } from "../daos/BatchInferenceLog.dao";
import { BatchInferenceLogCommonUpdateDto, BatchInferenceLogCreateDto } from "../dtos/BatchInferenceLog.dto";

// Import enums
import { BatchInferenceLogModelInvocationJobStatusEnum } from "../enums/BatchInferenceLog.enum";

// Import models
import { DbBatchInferenceLogDto } from "../db/models/BatchInferenceLog.model";

/**
 * BatchInferenceLogService
 */
class BatchInferenceLogService {
  /**
   * createBatchInferenceLog
   *
   * Creates a new batch inference log entry in DynamoDB.
   *
   * @param {BatchInferenceLogCreateDto} createBatchInferenceLogDto - The data to create the batch inference log entry.
   * @returns {Promise<DbBatchInferenceLogDto>} - A promise that resolves to the created batch inference log entry.
   */
  async createBatchInferenceLog(
    createBatchInferenceLogDto: BatchInferenceLogCreateDto
  ): Promise<DbBatchInferenceLogDto> {
    global.logger.info("Create Batch Inference Log [Service]", {
      methodName: this.createBatchInferenceLog.name,
    });

    return batchInferenceLogDaoObj.createBatchInferenceLog(
      createBatchInferenceLogDto
    );
  }

  /**
   * updateBatchInferenceLogForCreateModelInvocationJob
   * 
   * Updates the batch inference log entry in DynamoDB with the results of a model invocation job.
   * 
   * This method updates the status of the job to "COMPLETED" or "FAILED" based on whether an error occurred.
   * If the job was successful, it records the output details, job ARN, and status code.
   * In the event of an error, it logs the error details.
   *
   * @param {string} batchInferenceLogId - The unique identifier of the batch inference log entry to be updated.
   * @param {boolean} isError - Flag indicating if an error occurred during the model invocation job.
   * @param {CreateModelInvocationJobCommandOutput | undefined} [modelInvocationJobResult] - The result of the model invocation job if successful.
   * @param {any | undefined} [errorDetails] - Additional error details if an error occurred.
   * @returns {Promise<DbBatchInferenceLogDto>} - A promise resolving to the updated batch inference log entry.
   */
  async updateBatchInferenceLogForCreateModelInvocationJob(
    batchInferenceLogId: string,
    isError: boolean,
    modelInvocationJobResult?: CreateModelInvocationJobCommandOutput,
    errorDetails?: any
  ): Promise<DbBatchInferenceLogDto> {
    // Prepate update data for success
    const updateData: Partial<BatchInferenceLogCommonUpdateDto> = {
      modelInvocationJobStatus: isError
        ? BatchInferenceLogModelInvocationJobStatusEnum.FAILED
        : BatchInferenceLogModelInvocationJobStatusEnum.COMPLETED,
    };

    if (modelInvocationJobResult) {
      updateData.createModelInvocationJobOutput = modelInvocationJobResult;
      updateData.jobArn = modelInvocationJobResult.jobArn;
      updateData.statusCode = modelInvocationJobResult.$metadata.httpStatusCode;
    }

    if (isError) {
      updateData.errorDetails = errorDetails;
    }

    const updatedBatchInferenceLog: DbBatchInferenceLogDto =
      await this.updateBatchInferenceLogById(
        batchInferenceLogId,
        updateData
      );
    global.logger.debug("updatedBatchInferenceLog for success", {
      updatedBatchInferenceLog,
    });

    return updatedBatchInferenceLog;
  }

  /**
   * updateBatchInferenceLogById
   *
   * Updates an existing batch inference log entry in DynamoDB with the specified parameters.
   *
   * @param {string} id - The unique identifier of the batch inference log entry to be updated.
   * @param {Partial<BatchInferenceLogCommonUpdateDto>} batchInferenceLogUpdateParam - Partial data to update the batch inference log entry.
   * @returns {Promise<DbBatchInferenceLogDto>} - A promise that resolves to the updated batch inference log entry.
   */
  async updateBatchInferenceLogById(
    id: string,
    batchInferenceLogUpdateParam: Partial<BatchInferenceLogCommonUpdateDto>
  ): Promise<DbBatchInferenceLogDto> {
    global.logger.info(`Updating Fantastic Job Log [Dao]`, {
      methodName: this.updateBatchInferenceLogById.name,
    });

    return batchInferenceLogDaoObj.updateBatchInferenceLogById(
      id,
      batchInferenceLogUpdateParam
    );
  }
}

const batchInferenceLogServiceObj = new BatchInferenceLogService();
export { batchInferenceLogServiceObj, BatchInferenceLogService };