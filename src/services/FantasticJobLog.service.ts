
// Import dtos
import { FantasticJobLogCommonUpdateDto, FantasticJobLogCreateDto } from "../dtos/FantasticJobLog.dto";

// Import daos
import { fantasticJobLogDaoObj } from "../daos/FantasticJobLog.dao";

// Import enums
import { FantasticJobLogApiTypeEnum, FantasticJobLogJobsDbStoredStatusEnum, FantasticJobLogJobsRetrievedStatusEnum } from "../enums/FantasticJobLog.enum";

// Import models
import { DbFantasticJobLogDto } from "../db/models/FantasticJobLog.model";

/**
 * FantasticJobLogService
 *
 * This class is used to handle all the operations related to Fantastic Job api Logs
 */
class FantasticJobLogService {
  /**
   * prepareAndCreateFantasticJobLog
   *
   * This method prepares the data required to store fantastic job api logs and then
   * calls the "createFantasticJobLog" method to store the log in the database.
   * Initially, the "jobDbStoredTotalCount" is set to 0 and "jobDbStoredStatus" is set to
   * "IN_PROGRESS". Once the jobs are stored in the database, the "jobDbStoredTotalCount"
   * will be updated and the "jobDbStoredStatus" will be updated to "SUCCESS" or "FAILED"
   * based on the outcome of the job storage operation.
   *
   * @param {FantasticJobLogApiTypeEnum} apiType The type of the fantastic job api
   * that was called.
   * @param {number} fantasticTwentyFourHourJobApiCallsCount The number of times
   * the fantastic job api was called.
   * @param {number} fantasticTwentyFourHourJobsRetrievedCount The number of jobs
   * retrieved from the fantastic job api.
   * @param {FantasticJobLogJobsRetrievedStatusEnum} jobsRetrievedStatus The status
   * of the job retrieval operation from the fantastic job api.
   * @param {number} fantasticTwentyFourHourJobsValidatedCount The number of jobs
   * validated from the fantastic job api.
   *
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the
   * created fantastic job api log.
   */
  async prepareAndCreateFantasticJobLog(
    apiType: FantasticJobLogApiTypeEnum,
    fantasticTwentyFourHourJobApiCallsCount: number,
    fantasticTwentyFourHourJobsRetrievedCount: number,
    jobsRetrievedStatus: FantasticJobLogJobsRetrievedStatusEnum,
    fantasticTwentyFourHourJobsValidatedCount: number 
  ): Promise<DbFantasticJobLogDto> {
    // Prepare the data to store fantastic job api logs
    const fantasticJobLogArgument: FantasticJobLogCreateDto = {
      apiType: apiType,
      apiCallTotalCount: fantasticTwentyFourHourJobApiCallsCount,
      jobsRetrievedTotalCount: fantasticTwentyFourHourJobsRetrievedCount,
      jobsRetrievedStatus: jobsRetrievedStatus,
      jobsValidatedTotalCount: fantasticTwentyFourHourJobsValidatedCount,

      /**
       * Initially set the "jobDbStoredTotalCount" to 0 and "jobDbStoredStatus" to "IN_PROGRESS"
       * because these will be updated once the jobs are stored in the database.
       */
      jobsDbStoredTotalCount: 0,
      jobsDbStoredStatus: FantasticJobLogJobsDbStoredStatusEnum.IN_PROGRESS,
    };

    return this.createFantasticJobLog(
      fantasticJobLogArgument
    );
  }

  /**
   * createFantasticJobLog
   *
   * This method creates a new fantastic job log entry in the database.
   *
   * @param {FantasticJobLogCreateDto} fantasticJobLogParam - The data required to create a fantastic job log.
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the created fantastic job log entry.
   */
  async createFantasticJobLog(fantasticJobLogParam: FantasticJobLogCreateDto): Promise<DbFantasticJobLogDto> {
    global.logger.info(`Creating Fantastic Job Log [Service]`, {
      methodName: this.createFantasticJobLog.name,
    });

    return fantasticJobLogDaoObj.createFantasticJobLog(fantasticJobLogParam);
  }

  /**
   * updateFantasticJobLogById
   *
   * Updates an existing fantastic job log entry in the database.
   *
   * @param {string} id - The ID of the fantastic job log entry to be updated.
   * @param {Partial<FantasticJobLogCommonUpdateDto>} fantasticJobLogUpdateParam - The data to be updated.
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the updated fantastic job log entry.
   */
  async updateFantasticJobLogById(
    id: string,
    fantasticJobLogUpdateParam: Partial<FantasticJobLogCommonUpdateDto>
  ): Promise<DbFantasticJobLogDto> {
    global.logger.info(`Updating Fantastic Job Log [Dao]`, {
      methodName: this.updateFantasticJobLogById.name,
    });

    return fantasticJobLogDaoObj.updateFantasticJobLogById(id, fantasticJobLogUpdateParam);
  }
}

const fantasticJobLogServiceObj = new FantasticJobLogService();

export { FantasticJobLogService, fantasticJobLogServiceObj };
