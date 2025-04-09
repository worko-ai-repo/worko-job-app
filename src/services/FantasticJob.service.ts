
// Import luxon date time
import { DateTime } from "luxon";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import { ScheduleJobCreateDto, ScheduleJobFantasticJobTwentyFourHourInputDto } from "../dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobStatus, ScheduleJobType } from "../enums/ScheduleJob.enum";

// Import models
import { DbScheduleJobDto } from "../db/models/ScheduleJob.model";

// Import services
import ScheduleJobService from "./ScheduleJob.service";

/**
 * FantasticJobService
 */
class FantasticJobService {
  /**
   * scheduleDelayedFantasticJobTwentyFourHour
   *
   * This function is used to create a delayed scheduled job for retrieving external jobs which are posted during the last twenty four hours.
   * The job is scheduled to run after a certain delay hours, which is set in the APP_CONSTANTS.FANTASTIC_JOB_TWENTY_FOUR_HOURS_AFTER_X_HOURS constant.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the scheduled job was created successfully.
   */
  async scheduleDelayedFantasticJobTwentyFourHour(): Promise<boolean> {
    // Log the attempt to create a delayed twenty four hour jobs
    global.logger.info(`Attempting to create delayed twenty four hour jobs`, {
      filePath: __filename,
      methodName: this.scheduleDelayedFantasticJobTwentyFourHour.name,
    });

    // Calculate the schedule time based on the delay hours constant
    const delayHours: number =
      APP_CONSTANTS.FANTASTIC_JOB_TWENTY_FOUR_HOURS_AFTER_X_HOURS;

    // Prepare input details
    let scheduleJobExternalJobTwentyFourHourInput: ScheduleJobFantasticJobTwentyFourHourInputDto =
      {};

    // Prepare the payload for the scheduled job
    const scheduleJobPayload: ScheduleJobCreateDto = {
      type: ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS,
      scheduleTime: DateTime.now()
        .plus({ hours: delayHours })
        .toUTC()
        .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      input: scheduleJobExternalJobTwentyFourHourInput,
      desc: `Get Twenty four hours jobs`,
      status: ScheduleJobStatus.SCHEDULED,
    };
    global.logger.info(`scheduleJobPayload`, {
      scheduleJobPayload,
    });

    // Create the scheduled job
    let scheduleJobCreated: DbScheduleJobDto =
      await ScheduleJobService.createScheduleJob(scheduleJobPayload);

    // Log the result of the scheduled job creation
    if (scheduleJobCreated) {
      global.logger.info(
        `Scheduled job created for retrieving twenty four hour jobs `,
        {
          filePath: __filename,
          methodName: this.scheduleDelayedFantasticJobTwentyFourHour.name,
        }
      );
      return true;
    } else {
      global.logger.error(
        `Failed to create scheduled job for retrieving twenty four hour jobs`
      );
      return false;
    }
  }
}

const fantasticJobServiceObj = new FantasticJobService();
export { fantasticJobServiceObj, FantasticJobService };