// Import AWS Lambda types
import { Context, ScheduledEvent } from "aws-lambda";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";
import "./extensions/array.extension";

// Import logger library
import "./libraries/logger.library";

// Import database configuration
import DBConfig from "./db/DB.config";

// import dtos
import { ScheduledEventDto } from "./dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobType } from "./enums/ScheduleJob.enum";

// Import services
import { candidateJobAlertServiceObj } from "./services/CandidateJobAlert.service";

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
 * Handles scheduled events and processes actions based on the schedule job type.
 *
 * @param {ScheduledEventDto | ScheduledEvent} event - In `serverless.ts` file if no `input` is provided then
 *                                                     the type of "event" will be by default `ScheduledEvent`.
 * @param {Context} context - The AWS Lambda context object.
 * @returns {Promise<object>} A promise that resolves with the response object after processing the scheduled job.
 */
export const handler = async (
  event: ScheduledEventDto | ScheduledEvent,
  context: Context,
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

    /**
     * Use type guard to check if the "scheduleJob" is present in the event and if it has the expected type then process it.
     */
    if ("scheduleJob" in event) {

      global.logger.info(`"scheduleJob" property is present in "event" object`);

      switch (event.scheduleJob?.type) {
        case ScheduleJobType.SEND_CANDIDATE_JOB_ALERT: {
          global.logger.info(
            `Processing scheduled job for send candidate job alert [app scheduler candidate job alert handler]`,
            {
              methodName: "handler",
              scheduleJobType: ScheduleJobType.SEND_CANDIDATE_JOB_ALERT,
            }
          );

          const response: [
            boolean,
            {
              awsMessageId: string | null;
              systemLogId: string | null;
            }[],
          ] =
            await candidateJobAlertServiceObj.retrieveAndSendEmailCandidateJobAlert();
          
          break;
        }

        default: {
          global.logger.error(
            `No schedule found for job type [app scheduler handler]`,
            {
              methodName: "handler",
              event: event,
              context: context
            }
          );

          throw new BaseError(`No schedule found for job type`, HttpStatusCode.BAD_REQUEST_400);
        }
      }
    }

    // Return success response
    return responseHandlerUtilObj.sendSuccess(
      HttpStatusCode.OK_200,
      `Scheduled job processed successfully.`
    );
  } catch (error: any) {
    // Log the error
    global.logger.error("App scheduler handler: ", {

      methodName: "handler",
      error: error,
    });

    // Return error response
    return responseHandlerUtilObj.sendError(
      error,
      error?.errorMsg ??
        error?.message ??
        "An error occurred while processing the scheduled job."
    );
  }
};