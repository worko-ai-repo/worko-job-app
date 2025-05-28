
// Import daos
import BaseDao from "./Base.dao";

// Import dtos
import { BatchInferenceLogCommonUpdateDto, BatchInferenceLogCreateDto } from "../dtos/BatchInferenceLog.dto";

// Import models
import { BatchInferenceLogModel, DbBatchInferenceLogDto } from "../db/models/BatchInferenceLog.model";

/**
 * BatchInferenceLogDao
 */
class BatchInferenceLogDao implements BaseDao {
  modelName: string = "BatchInferenceLog";
  partitianKey: string = "BATCH#INF#LOG#";
  sortKeys = {
    SK_BATCH_INFERENCE_INIT: "ID#{id}",
  };

  /**
   * preparePKAndSKForQuery
   *
   * Prepares the partition key and sort key for a query.
   *
   * @param {string} id - The id of the fantastic job log.
   * @returns {{PK: string, SK: string}} - An object containing the partition key and sort key.
   */
  preparePKAndSKForQuery(id: string): {
    PK: string;
    SK: string;
  } {
    return {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_BATCH_INFERENCE_INIT.strtr({
        "{id}": id,
      }),
    };
  }

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
    global.logger.info("Create Batch Inference Log [Dao]", {
      methodName: this.createBatchInferenceLog.name,
    });

    const { PK, SK } = this.preparePKAndSKForQuery(
      createBatchInferenceLogDto.id
    );

    const createData = {
      ...createBatchInferenceLogDto,
      PK: PK,
      SK: SK,
    };

    return BatchInferenceLogModel.create(createData);
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
    global.logger.info(`Updating Batch Inference Log [Dao]`, {
      methodName: this.updateBatchInferenceLogById.name,
    });

    return BatchInferenceLogModel.update(
      this.preparePKAndSKForQuery(id),
      batchInferenceLogUpdateParam
    );
  }
}

const batchInferenceLogDaoObj = new BatchInferenceLogDao();
export { batchInferenceLogDaoObj, BatchInferenceLogDao };
