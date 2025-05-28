
// Import constant and configs
import APP_CONSTANTS from "../configs/constants.config";
import { FANTASTIC_JOB_APP_CONSTANTS } from "../configs/constants/FantasticJob.constant";

// Import dtos
import { FantasticJobApiResponse, FantasticJobCloudApiDto } from "../dtos/FantasticJob.dto";
import { FantasticJobLogCommonUpdateDto } from "../dtos/FantasticJobLog.dto";

// Import enums
import { FantasticJobLogApiTypeEnum, FantasticJobLogJobsRetrievedStatusEnum } from "../enums/FantasticJobLog.enum";

// Import helpers
import { jobDescriptionValidatorHelperObj } from "../helpers/jobDescriptionValidator.helper";

// Import libraries
import { fantasticJobCloudApiLibraryObj } from "../libraries/FantasticJobCloudApi.library";

// Import models
import { DbFantasticJobLogDto } from "../db/models/FantasticJobLog.model";

// Import services
import { batchInferenceServiceObj } from "./BatchInference.service";
import { fantasticJobLogServiceObj } from "./FantasticJobLog.service";

/**
 * FantasticJobService
 *
 * Class responsible for managing fantastic job related operations
 */
class FantasticJobService {
  /**
   * initializeTwentyFourHourJobLog
   *
   * This method is called at the start of every day to
   * initialize a new log for the 24 hour job fetch.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the
   * log was created successfully and the getAndProcessFantasticJobs
   * method was called successfully.
   */
  async initializeTwentyFourHourJobLog(): Promise<boolean> {
    const fantasticJobLogDetails: DbFantasticJobLogDto =
      await fantasticJobLogServiceObj.prepareAndCreateFantasticJobLog(
        FantasticJobLogApiTypeEnum.TWENTY_FOUR_HOUR,
        0,
        0,
        FantasticJobLogJobsRetrievedStatusEnum.IN_PROGRESS,
        0
      );
    global.logger.info(`Created fantastic job log:`, {
      fantasticJobLogDetails,
      methodName: "handler",
    });

    return this.getAndProcessFantasticJobs(
      fantasticJobLogDetails.id
    );
  }
  
  /**
   * prepareAndGetTwentyFourHourJobs
   *
   * Prepares argument for "getFantasticJobTwentyFourHours" method of
   * "FantasticJobCloudApiLibrary" and fetches jobs with the given offset.
   *
   * @param {number} offset - The offset value for fetching jobs from
   * the fantastic job cloud api.
   * @returns {Promise<FantasticJobApiResponse[]>} A promise that resolves to
   * an array of fantastic job API responses.
   */
  private async prepareAndGetTwentyFourHourJobs(
    offset: number
  ): Promise<FantasticJobApiResponse[]> {
    // Prepare Argument for external job API call
    const fantasticJobCloudApiArgument: FantasticJobCloudApiDto = {
      offSet: offset,
      descriptionType: FANTASTIC_JOB_APP_CONSTANTS.HTML_DESCRIPTION_TYPE, // @NOTE: In near future this may be dynamically passed
    };

    // Fetch jobs with the current offset
    return fantasticJobCloudApiLibraryObj.getFantasticJobTwentyFourHours(
      fantasticJobCloudApiArgument
    );
  }

  /**
   * validateAndFilterFantasticJobs
   *
   * Validates the given array of fantastic job API responses using the
   * "jobDescriptionValidatorHelperObj" and filters out jobs with invalid
   * descriptions.
   *
   * @param {FantasticJobApiResponse[]} jobs - The array of fantastic job API
   * responses to be validated and filtered.
   * @returns {FantasticJobApiResponse[]} An array of valid fantastic job API
   * responses.
   */
  private validateAndFilterFantasticJobs(jobs: FantasticJobApiResponse[]): FantasticJobApiResponse[] {
    return jobs.filter((eachExternalJob: FantasticJobApiResponse) => {
      const givenJobDescription: string | undefined =
        eachExternalJob.description_text || eachExternalJob.description_html;

      /**
       * NOTE: The job description validation is happening on `html` description.
       */
      const isValidDescription: boolean | "" | undefined =
        givenJobDescription &&
        jobDescriptionValidatorHelperObj.isValidDescription(
          givenJobDescription
        );

      return isValidDescription;
    });
  }

  /**
   * updateRetrievedFantasticJobLog
   *
   * Updates the fantastic job log with the given job retrieval details.
   *
   * @param {boolean} isError - Whether an error occurred while retrieving jobs.
   * @param {string} fantasticJobLogId - The ID of the fantastic job log to be updated.
   * @param {number} fantasticTwentyFourHourJobApiCallsCount - The number of times the fantastic job api was called.
   * @param {number} fantasticTwentyFourHourJobsRetrievedCount - The number of jobs retrieved from the fantastic job api.
   * @param {number} fantasticTwentyFourHourJobsValidatedCount - The number of jobs validated from the fantastic job api.
   * @param {any | undefined} [error] - The error object if any error occurred during job retrieval.
   * @returns {Promise<DbFantasticJobLogDto>} A promise that resolves to the updated fantastic job log.
   */
  private async updateRetrievedFantasticJobLog(
    isError: boolean,
    fantasticJobLogId: string,
    fantasticTwentyFourHourJobApiCallsCount: number,
    fantasticTwentyFourHourJobsRetrievedCount: number,
    fantasticTwentyFourHourJobsValidatedCount: number,
    error?: any,
  ): Promise<DbFantasticJobLogDto> {
    // Prepare the update data for fantastic job log
    const updateData: Partial<FantasticJobLogCommonUpdateDto> = {
      apiCallTotalCount: fantasticTwentyFourHourJobApiCallsCount,
      jobsRetrievedTotalCount: fantasticTwentyFourHourJobsRetrievedCount,
      jobsRetrievedStatus: isError
        ? FantasticJobLogJobsRetrievedStatusEnum.FAILED
        : FantasticJobLogJobsRetrievedStatusEnum.SUCCESS,
      jobsValidatedTotalCount: fantasticTwentyFourHourJobsValidatedCount,
    };

    if(isError) {
      updateData.errorDetails = {
        error: error,
        methodName: this.getAndProcessFantasticJobs.name,
        className: FantasticJobService.name,
      };
    };

    const updatedLog: DbFantasticJobLogDto = await fantasticJobLogServiceObj.updateFantasticJobLogById(
        fantasticJobLogId,
        updateData
      );
    global.logger.info(`Fantastic job retrieval logs:`, {
      updatedLog,
      methodName: this.getAndProcessFantasticJobs.name,
    });

    return updatedLog;
  }

  /**
   * getAndProcessFantasticJobs
   *
   * Fetches jobs from the fantastic job API, validates and filters them and
   * then indexes them in the OpenSearch index using the batch inference
   * service.
   *
   * @param {string} fantasticJobLogId - The id of the fantastic job log in the
   * DynamoDB table.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if all
   * operations in the bulk request succeed, or `false` if any operation fails.
   */
  async getAndProcessFantasticJobs(fantasticJobLogId: string): Promise<boolean> {
    // Initialize count variables
    let fantasticTwentyFourHourJobApiCallsCount: number = 0;
    let fantasticTwentyFourHourJobsRetrievedCount: number = 0;
    let fantasticTwentyFourHourJobsValidatedCount: number = 0;
    
    try {
      // Fantastic job API call with pagination
      const fantasticJobDetails: FantasticJobApiResponse[] = [];
      let offset: number = FANTASTIC_JOB_APP_CONSTANTS.OFF_SET;
      const limit: number = FANTASTIC_JOB_APP_CONSTANTS.LIMIT;

      while (true) {
        // Check if we have already fetched some jobs from fantastic api. Break the loop if dev stage
        if (process.env.APP_STAGE === APP_CONSTANTS.STAGES.DEV) {
          global.logger.info("Dev stage");
          if (fantasticJobDetails?.length > 100) {
            global.logger.info(
              "Dev stage, breaking the loop because already fetched some jobs from fantastic job api"
            );
            break;
          }

          global.logger.info("Dev stage, fetching jobs from fantastic job api");
        }

        // Prepare and fetch jobs
        const jobs: FantasticJobApiResponse[] = await this.prepareAndGetTwentyFourHourJobs(offset);

        fantasticTwentyFourHourJobApiCallsCount += 1;
        fantasticTwentyFourHourJobsRetrievedCount += jobs?.length ?? 0;

        // If no more jobs, stop the loop
        if (!jobs || jobs?.length === 0) {
          break;
        }

        // Retrieve jobs which have valid job description
        const filteredJobs: FantasticJobApiResponse[] = this.validateAndFilterFantasticJobs(jobs);

        fantasticTwentyFourHourJobsValidatedCount += filteredJobs?.length ?? 0;

        // Add fetched jobs to the array
        fantasticJobDetails.push(...filteredJobs);

        // Increment the offset
        offset += limit;
      }

      // Prepare the update data for fantastic job log
      await this.updateRetrievedFantasticJobLog(
        false,
        fantasticJobLogId,
        fantasticTwentyFourHourJobApiCallsCount,
        fantasticTwentyFourHourJobsRetrievedCount,
        fantasticTwentyFourHourJobsValidatedCount
      );

      // Bulk index jobs in opensearch
      return batchInferenceServiceObj.processBatchInferenceForFantasticJobs(
        fantasticJobLogId,
        fantasticJobDetails
      );
    } catch (error: any) {
      global.logger.error("Error at catc block while fetching fantastic jobs", {
        error,
        methodName: this.getAndProcessFantasticJobs.name,
      });

      // Prepare the update data for fantastic job log
      await this.updateRetrievedFantasticJobLog(
        true,
        fantasticJobLogId,
        fantasticTwentyFourHourJobApiCallsCount,
        fantasticTwentyFourHourJobsRetrievedCount,
        fantasticTwentyFourHourJobsValidatedCount,
        error,
      );

      return false;
    }
  }
}

// Create an instance of the class
const fantasticJobServiceObj: FantasticJobService = new FantasticJobService();

// Export the class and instance object
export { FantasticJobService, fantasticJobServiceObj };
