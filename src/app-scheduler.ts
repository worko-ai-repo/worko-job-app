// Import AWS Lambda types
import { Context } from "aws-lambda";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";

// Import logger library
import "./libraries/logger.library";

// Import database configuration
import DBConfig from "./db/DB.config";

// Import constants
import APP_CONSTANTS from "./configs/constants.config";
import { FANTASTIC_JOB_APP_CONSTANTS } from "./configs/constants/ExternalJob.constant";

// import dtos
import { ScheduleUserJobApplicationStatusUpdateToRejectedInputDto } from "./dtos/ScheduleJob.dto";
import { FantasticJobCloudApiDto, FantasticJobApiResponse } from "./dtos/FantasticJob.dto";

// Import enums
import { ScheduleJobType } from "./enums/ScheduleJob.enum";

// Import helpers
import { jobDescriptionValidatorHelperObj } from "./helpers/jobDescriptionValidator.helper";

// Import libraries
import { fantasticJobCloudApiLibraryObj } from "./libraries/FantasticJobCloudApi.library";

// Import models
import { DbScheduleJobDto } from "./db/models/ScheduleJob.model";

// Import services
import { fantasticJobServiceObj } from "./services/FantasticJob.service";
import scheduleJobService from "./services/ScheduleJob.service";
import { jobServiceObj } from "./services/Job.service";
import { userJobApplicationServiceObj } from "./services/UserJobApplication.service";

// Import error handling utilities
import { BaseError } from "./utils/errors.util";
import HttpStatusCode from "./utils/http-codes.util";

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
 * Sends an error response.
 *
 * @param {any} error - The error object.
 * @param {string} message - The error message to return in the response.
 * @param {boolean} [consoleResponse=true] - Whether to log the error response to the console.
 * @returns {Promise<object>} The formatted error response object.
 */
const sendErrResponse = async (
  error: any,
  message: string,
  consoleResponse: boolean = true
): Promise<object> => {
  // Prepare the error response
  const response = {
    statusCode: error.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR_500,
    body: JSON.stringify({
      message: message,
      error: error.message ?? "Internal Server Error",
    }),
  };

  // Log the response if required
  if (consoleResponse) {
    global.logger.info("sendErrResponse: ", {
      filePath: __filename,
      methodName: "sendErrResponse",
      response: JSON.stringify(response),
    });
  }

  return response;
};

/**
 * Sends a success response.
 *
 * @param {number} statusCode - The HTTP status code to return.
 * @param {string} message - The success message to return in the response.
 * @param {boolean} [consoleResponse=true] - Whether to log the success response to the console.
 * @returns {Promise<object>} The formatted success response object.
 */
const sendSuccessResponse = async (
  statusCode: HttpStatusCode,
  message: string,
  consoleResponse: boolean = true
): Promise<object> => {
  // Prepare the success response
  const response = {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
    }),
  };

  // Log the response if required
  if (consoleResponse) {
    global.logger.info("sendSuccessResponse: ", {
      filePath: __filename,
      methodName: "sendSuccessResponse",
      response: response,
    });
  }

  return response;
};

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
    if (scheduleJob.type === ScheduleJobType.FANTASTIC_JOB_TWENTY_FOUR_HOURS) {
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
            descriptionType: FANTASTIC_JOB_APP_CONSTANTS.HTML_DESCRIPTION_TYPE,
          };

        // Break the loop if dev stage
        if(process.env.APP_STAGE === APP_CONSTANTS.STAGES.DEV) {
          global.logger.info("App scheduler handler: Dev stage");
          if(externalJobDetails.length > 0) {
            global.logger.info("App scheduler handler: Dev stage, breaking the loop because already fetched some jobs from external api");
            break;
          }
        }

        // Fetch jobs with the current offset
        const jobs: FantasticJobApiResponse[] =
          await fantasticJobCloudApiLibraryObj.getFantasticJobTwentyFourHours(
            externalJobArgument
          );
        externalTwentyFourHourJobApiCallsCount += 1;

        // If no more jobs, stop the loop
        if (!jobs || jobs.length === 0) {
          break;
        }

        // Filter jobs with empty description
        const filteredJobs: FantasticJobApiResponse[] = jobs.filter(
          (eachExternalJob: FantasticJobApiResponse) => {
            const givenJobDescription: string | undefined = eachExternalJob.description_text || eachExternalJob.description_html;

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
        externalTwentyFourHourJobApiCallsCount, // @todo: Need to create a tracking for this api call count in database
        externalFilteedJobDetailsLength: externalJobDetails.length,
      });

      // Bulk index jobs in opensearch
      await jobServiceObj.createBulkJobsInOpensearch(externalJobDetails);

      // If the stage is production then schedule delayed external job
      if (process.env.APP_STAGE === APP_CONSTANTS.STAGES.PROD) {
        global.logger.info(`Schedule delayed external job in production environment.`);

        // Schedule delayed external job
        await fantasticJobServiceObj.scheduleDelayedFantasticJobTwentyFourHour();
      }
    } else if (
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
    return sendSuccessResponse(
      HttpStatusCode.OK_200,
      `Scheduled job ${scheduleJobId} processed successfully.`
    );
  } catch (error: any) {
    // Return error response
    return sendErrResponse(
      error,
      error?.errorMsg ??
        error?.message ??
        "An error occurred while processing the scheduled job."
    );
  }
};
