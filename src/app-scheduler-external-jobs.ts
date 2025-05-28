// Import AWS Lambda types
import { Context, ScheduledEvent } from "aws-lambda";

// Import opensearch related types
import { DeleteByQuery_Response, UpdateByQuery_Response } from "@opensearch-project/opensearch/api";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";

// Import logger library
import "./libraries/logger.library";

// Import database configuration
import DBConfig from "./db/DB.config";

import { ScheduledEventDto } from "./dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobType } from "./enums/ScheduleJob.enum";
import { FantasticJobLogApiTypeEnum, FantasticJobLogJobsRetrievedStatusEnum } from "./enums/FantasticJobLog.enum";

// Import models
import { DbFantasticJobLogDto } from "./db/models/FantasticJobLog.model";

// Import services
import { jobServiceObj } from "./services/Job.service";
import { fantasticJobServiceObj } from "./services/FantasticJob.service";
import { fantasticJobLogServiceObj } from "./services/FantasticJobLog.service";

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
        filePath: __filename,
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
        case ScheduleJobType.FANTASTIC_JOB_HARD_AND_SOFT_DELETE_OLD_JOBS_AND_OLD_INITIAL_MATCHING_SCORE_JOBS: {
          // Logger for Hard and soft delete old jobs
          global.logger.info(
            `Processing scheduled job for hard and soft deleting old jobs and old initial matching score jobs [app scheduler handler]`,
            {
              filePath: __filename,
              methodName: "handler",
              scheduleJobType:
                ScheduleJobType.FANTASTIC_JOB_HARD_AND_SOFT_DELETE_OLD_JOBS_AND_OLD_INITIAL_MATCHING_SCORE_JOBS,
            }
          );

          // Hard Delete old jobs
          const deleteOldUnappliedExternalJobsResult: DeleteByQuery_Response =
            await jobServiceObj.deleteOldUnappliedExternalJobs();
          global.logger.info(
            "App scheduler handler: Old jobs hard deleted successfully: ",
            {
              filePath: __filename,
              methodName: "handler",
              deleteOldUnappliedExternalJobsResult: deleteOldUnappliedExternalJobsResult,
            }
          );

          // Soft Delete old jobs
          const softDeleteOldAppliedExternalJobsResult: UpdateByQuery_Response =
            await jobServiceObj.softDeleteOldAppliedExternalJobs();
          global.logger.info(
            "App scheduler handler: Old jobs soft deleted successfully: ",
            {
              filePath: __filename,
              methodName: "handler",
              softDeleteOldAppliedExternalJobsResult: softDeleteOldAppliedExternalJobsResult,
            }
          );

          break;
        }

        case ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS: {
          global.logger.info(
            `Processing scheduled job for fantastic job twenty four hours [app scheduler handler]`,
            {
              filePath: __filename,
              methodName: "handler",
              scheduleJobType: ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS,
            }
          );

          const fantasticJobProcessingResult: boolean = await fantasticJobServiceObj.initializeTwentyFourHourJobLog();
          if(!fantasticJobProcessingResult) {
            global.logger.error(
              `Fantastic job processing failed [app scheduler handler]`,
              {
                filePath: __filename,
                methodName: "handler",
                scheduleJobType: ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS,
              }
            );

            throw new BaseError(`The Fantastic jobs processing failed.`, HttpStatusCode.INTERNAL_SERVER_ERROR_500);
          }

          global.logger.info(
            `Fantastic job processing completed successfully [app scheduler handler]`,
            {
              filePath: __filename,
              methodName: "handler",
              scheduleJobType: ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS,
            }
          );

          break;
        }

        default: {
          global.logger.error(
            `No schedule found for job type [app scheduler handler]`,
            {
              filePath: __filename,
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
      filePath: __filename,
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