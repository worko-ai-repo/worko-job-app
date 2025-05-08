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

// Import constants
import APP_CONSTANTS from "./configs/constants.config";
import { FANTASTIC_JOB_APP_CONSTANTS } from "./configs/constants/FantasticJob.constant";

// import dtos
import {
  FantasticJobCloudApiDto,
  FantasticJobApiResponse,
} from "./dtos/FantasticJob.dto";
import { ScheduledEventDto } from "./dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobType } from "./enums/ScheduleJob.enum";

// Import helpers
import { jobDescriptionValidatorHelperObj } from "./helpers/jobDescriptionValidator.helper";

// Import libraries
import { fantasticJobCloudApiLibraryObj } from "./libraries/FantasticJobCloudApi.library";

// Import services
import { jobServiceObj } from "./services/Job.service";

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
     * Use type guard to check if the scheduleJob is present in the event and if it has the expected type then process it.
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
            `Processing scheduled job for external job twenty four hours [app scheduler handler]`,
            {
              filePath: __filename,
              methodName: "handler",
              scheduleJobType: ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS,
            }
          );

          // External job API call with pagination
          const externalJobDetails: FantasticJobApiResponse[] = [];
          let offset = 0;
          const limit = 100; // Each request fetches 100 jobs

          // This is custom variable which will use for debugging how many external jobs get called.
          let externalTwentyFourHourJobApiCallsCount = 0;

          while (true) {
            // Prepare Argument for external job API call
            const externalJobArgument: FantasticJobCloudApiDto = {
              offSet: offset,
              descriptionType:
                FANTASTIC_JOB_APP_CONSTANTS.HTML_DESCRIPTION_TYPE,
            };

            // Check if we have already fetched some jobs from external api. Break the loop if dev stage
            if (process.env.APP_STAGE === APP_CONSTANTS.STAGES.DEV) {
              global.logger.info("App scheduler handler: Dev stage");
              if (externalJobDetails?.length > 0) {
                global.logger.info(
                  "App scheduler handler: Dev stage, breaking the loop because already fetched some jobs from external api"
                );
                break;
              }

              global.logger.info(
                "App scheduler handler: Dev stage, fetching jobs from external api"
              );
            }

            // Fetch jobs with the current offset
            const jobs: FantasticJobApiResponse[] =
              await fantasticJobCloudApiLibraryObj.getFantasticJobTwentyFourHours(
                externalJobArgument
              );
            externalTwentyFourHourJobApiCallsCount += 1;

            // If no more jobs, stop the loop
            if (!jobs || jobs?.length === 0) {
              break;
            }

            // Filter jobs with empty description
            const filteredJobs: FantasticJobApiResponse[] = jobs.filter(
              (eachExternalJob: FantasticJobApiResponse) => {
                const givenJobDescription: string | undefined =
                  eachExternalJob.description_text ||
                  eachExternalJob.description_html;

                /**
                 * NOTE: The job description validation is happening on `html` description.
                 */
                const isValidDescription: boolean | "" | undefined =
                  givenJobDescription &&
                  jobDescriptionValidatorHelperObj.isValidDescription(
                    givenJobDescription
                  );

                return isValidDescription;
              }
            );

            // Add fetched jobs to the array
            externalJobDetails.push(...filteredJobs);

            // Increment the offset
            offset += limit;
          }

          global.logger.info(`Job retrival details`, {
            filePath: __filename,
            methodName: "handler",
            externalTwentyFourHourJobApiCallsCount, // @todo: Think and discuss with Team lead or CTO to create a tracking for this api call count in database.
            externalFilteedJobDetailsLength: externalJobDetails?.length,
          });

          // Bulk index jobs in opensearch
          await jobServiceObj.createBulkJobsInOpensearch(externalJobDetails);
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