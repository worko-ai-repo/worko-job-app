
// Import dtos
import { batchInferenceLogDaoObj } from "../daos/BatchInferenceLog.dao";
import { BatchInferenceLogCommonUpdateDto, BatchInferenceLogCreateDto } from "../dtos/BatchInferenceLog.dto";

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