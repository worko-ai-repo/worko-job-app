
// Import daos
import BaseDao from "./Base.dao";

// Import dtos
import { FantasticJobLogCommonUpdateDto, FantasticJobLogCreateDto } from "../dtos/FantasticJobLog.dto";

// Import models
import { DbFantasticJobLogDto, FantasticJobLogModel } from "../db/models/FantasticJobLog.model";

// Import services
import UlidService from "../services/Ulid.service";

/**
 * FantasticJobLogDao
 */
class FantasticJobLogDao implements BaseDao {
  modelName: string = "FantasticJobLog";
  partitianKey: string = "FANTASTIC#JOB#LOG#";
  sortKeys = {
    SK_FANTASTIC_JOB_INIT: "ID#{id}",
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
      SK: this.sortKeys.SK_FANTASTIC_JOB_INIT.strtr({
        "{id}": id,
      }),
    };
  }

  /**
   * createFantasticJobLog
   *
   * Creates a new fantastic job log entry in the database.
   *
   * @param {FantasticJobLogCreateDto} fantasticJobLogParam - The data required to create a fantastic job log.
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the created fantastic job log entry.
   */
  async createFantasticJobLog(
    fantasticJobLogParam: FantasticJobLogCreateDto
  ): Promise<DbFantasticJobLogDto> {
    global.logger.info(`Creating Fantastic Job Log [Dao]`, {
      methodName: this.createFantasticJobLog.name,
    });

    // Generate a unique ID
    const ulidId: string = UlidService.getUlidId();

    // Prepare PK and SK
    const { PK, SK } = this.preparePKAndSKForQuery(ulidId);

    // Create Fantastic Job Final object
    const createFantasticJobLogDto = {
      ...fantasticJobLogParam,
      PK: PK,
      SK: SK,
      id: ulidId,
    };

    return FantasticJobLogModel.create(createFantasticJobLogDto);
  }

  /**
   * updateFantasticJobLogById
   *
   * Updates an existing fantastic job log entry in the database.
   *
   * @param {string} id - The ID of the fantastic job log entry to be updated.
   * @param {Partial<FantasticJobLogCommonUpdateDto>} fantasticJobLogUpdateParam - The data to be updated.
   *
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the updated fantastic job log entry.
   */
  async updateFantasticJobLogById(
    id: string,
    fantasticJobLogUpdateParam: Partial<FantasticJobLogCommonUpdateDto>
  ): Promise<DbFantasticJobLogDto> {
    global.logger.info(`Updating Fantastic Job Log [Dao]`, {
      methodName: this.updateFantasticJobLogById.name,
    });

    return FantasticJobLogModel.update(
      this.preparePKAndSKForQuery(id),
      fantasticJobLogUpdateParam
    );
  }
}

const fantasticJobLogDaoObj: FantasticJobLogDao = new FantasticJobLogDao();
export { fantasticJobLogDaoObj, FantasticJobLogDao };
