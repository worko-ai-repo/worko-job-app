// Import AWS Lambda types
import {
  Context,
  // ScheduledEvent // NOTE: This is the by default type of "event" object in handler function.
} from "aws-lambda";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";
import "./extensions/array.extension";

// Import logger library
import "./libraries/logger.library";

// Import database configuration
import DBConfig from "./db/DB.config";

// import dtos
import { ScheduleBrightDataJobToRetrieveInputDto } from "./dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobType } from "./enums/ScheduleJob.enum";

// Import models
import { DbScheduleJobDto } from "./db/models/ScheduleJob.model";

// Import services
import scheduleJobService from "./services/ScheduleJob.service";
import { brightDataJobServiceObj } from "./services/BrightDataJob.service";

// Import error handling utilities
import { BaseError } from "./utils/errors.util";
import HttpStatusCode from "./utils/http-codes.util";
import { responseHandlerUtilObj } from "./utils/response-handler.util";

/**
 * Initializes the database configuration.
 */
const initDatabaseConfig = () => {
  // Create a new database configuration instance
  const dbConf: DBConfig = new DBConfig();

  // Initialize the database configuration
  dbConf.init();
};

// Initialize the database configuration
initDatabaseConfig();

/**
 * handler
 *
 * Handles the scheduled event and processes actions based on the schedule job type.
 *
 * @param {ScheduleBrightDataJobToRetrieveInputDto} event - The scheduled event object containing job details.
 * @param {Context} context - The AWS Lambda context object.
 * @return {Promise<object>} A promise that resolves with the response object.
 */
export const handler = async (
  event: ScheduleBrightDataJobToRetrieveInputDto,
  context: Context
): Promise<object> => {
  try {
    // Log the receipt of the event
    global.logger.info(
      "App scheduler handler: Received event from scheduler: ",
      {
        methodName: "handler",
        event: event,
        context: context,
      }
    );

    if(!event?.scheduleJobId) {
      throw new BaseError("The schedule job ID not found.", HttpStatusCode.BAD_REQUEST_400);
    }

    // Extract scheduleJobId from the event object
    const scheduleJobId: string = event.scheduleJobId;

    // Fetch the scheduled job by its ID and validate its existence
    const scheduleJob: DbScheduleJobDto = await scheduleJobService.getScheduleJobById(scheduleJobId);
    if (!scheduleJob?.id) {
      throw new BaseError(
        `The schedule job with the provided ID "${scheduleJobId}" was not found.`
      );
    }

    global.logger.info("App scheduler handler: scheduleJob input details: ", {
      methodName: "handler",
      scheduledJob: scheduleJob,
    });

    // Process the scheduled job based on its type
    if (
      scheduleJob.type === ScheduleJobType.BRIGHT_DATA_JOB_TO_RETRIEVE
    ) {
      // scheduleJob input
      const scheduleBrightDataJobToRetrieveInputDetails = scheduleJob.input as ScheduleBrightDataJobToRetrieveInputDto;

      // logger
      global.logger.info(
        `Processing scheduled job for retrieving bright data job [app scheduler bright data external job handler]`,
        {
          methodName: "handler",
          scheduleBrightDataJobToRetrieveInputDetails,
          scheduleJobType: ScheduleJobType.BRIGHT_DATA_JOB_TO_RETRIEVE,
        }
      );

      const snapshotId: string = scheduleBrightDataJobToRetrieveInputDetails["snapshotId"];

      // Process the scheduled job
      const isBrightDataJobProcessed: boolean = await brightDataJobServiceObj.getAndProcessBatchInferenceForBrightDataJobs(
        snapshotId
      );
      if (!isBrightDataJobProcessed) {
        // Mark the scheduled job as completed
        await scheduleJobService.completeScheduleJob(scheduleJobId);

        throw new BaseError(
          `Failed to process scheduled job for retrieving bright data job.`,
          HttpStatusCode.INTERNAL_SERVER_ERROR_500
        );
      }

    } else {
      throw new BaseError(
        `No schedule found for job type: ${scheduleJob.type}`
      );
    }

    // Mark the scheduled job as completed
    await scheduleJobService.completeScheduleJob(scheduleJobId);

    // Return success response
    return responseHandlerUtilObj.sendSuccess(
      HttpStatusCode.OK_200,
      `Scheduled job ${scheduleJobId} processed successfully.`
    );
  } catch (error: any) {
    // Return error response
    return responseHandlerUtilObj.sendError(
      error,
      error?.errorMsg ??
        error?.message ??
        "An error occurred while processing the scheduled job."
    );
  }
};
