// Import AWS Lambda types
import { Context } from "aws-lambda";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";

// Import logger library
import "./libraries/logger.library";

// Import database configuration
import DBConfig from "./db/DB.config";

// import dtos
import { ScheduleUserJobApplicationStatusUpdateToRejectedInputDto } from "./dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobType } from "./enums/ScheduleJob.enum";

// Import models
import { DbScheduleJobDto } from "./db/models/ScheduleJob.model";

// Import services
import scheduleJobService from "./services/ScheduleJob.service";
import { userJobApplicationServiceObj } from "./services/UserJobApplication.service";

// Import error handling utilities
import { BaseError } from "./utils/errors.util";
import HttpStatusCode from "./utils/http-codes.util";
import { responseHandlerUtilObj } from "./utils/response-handler.util";

/**
 * Initializes the database configuration.
 */
const initDatabaseConfig = () => {
  // Create a new database configuration instance
  const dbConf = new DBConfig();

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
 * @param {ScheduledEvent} event - The scheduled event object containing job details.
 * @param {Context} context - The AWS Lambda context object.
 * @return {Promise<object>} A promise that resolves with the response object.
 */
export const handler = async (
  event: any,
  context: Context
): Promise<object> => {
  try {
    // Log the receipt of the event
    global.logger.info(
      "App scheduler handler: Received event from scheduler: ",
      {
        filePath: __filename,
        methodName: "handler",
        event: JSON.stringify(event),
        eventTypeOf: typeof event,
        context: JSON.stringify(context),
      }
    );

    // Extract scheduleJobId from the event object
    const scheduleJobId = event.scheduleJobId;

    // Fetch the scheduled job by its ID and validate its existence
    const scheduleJob: DbScheduleJobDto =
      await scheduleJobService.getScheduleJobById(scheduleJobId);
    if (!scheduleJob) {
      throw new BaseError(
        `The schedule job with the provided ID "${scheduleJobId}" was not found.`
      );
    }

    global.logger.info("App scheduler handler: scheduleJob input details: ", {
      filePath: __filename,
      methodName: "handler",
      scheduledJob: scheduleJob,
    });

    // Process the scheduled job based on its type
    if (
      scheduleJob.type === ScheduleJobType.USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED
    ) {
      // scheduleJob input
      const userJobApplicationRejectedStatusInputDetails =
        scheduleJob.input as ScheduleUserJobApplicationStatusUpdateToRejectedInputDto;

      // logger
      global.logger.info(
        `Processing scheduled job for updating job application status [app scheduler handler]`,
        {
          filePath: __filename,
          methodName: "handler",
          userJobApplicationRejectedStatusInputDetails,
          scheduleJobType: ScheduleJobType.USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED,
        }
      );

      const userJobApplicationId: string =
        userJobApplicationRejectedStatusInputDetails["userJobApplicationId"];
      const userEmail: string =
        userJobApplicationRejectedStatusInputDetails["userEmail"];

      const updatedDetails: boolean =
        await userJobApplicationServiceObj.prepareUserJobApplicationUpdateDtoToRejectAfterXHours(
          userJobApplicationId,
          userEmail
        );
      if (!updatedDetails) {
        global.logger.error(`Failed to update user job application status`, {
          methodName: "handler",
          scheduleJobType: ScheduleJobType.USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED,
          userJobApplicationId,
          userEmail,
        });
      }

      // logger
      global.logger.info(
        `Completed processing scheduled job for updating job application status [app scheduler handler]`,
        {
          methodName: "handler",
          userJobApplicationRejectedStatusInputDetails,
          scheduleJobType: ScheduleJobType.USER_JOB_APPLICATION_STATUS_UPDATE_TO_REJECTED,
        }
      );
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
