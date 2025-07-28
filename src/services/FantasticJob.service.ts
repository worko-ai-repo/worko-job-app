
// Import constant and configs
import APP_CONSTANTS from "../configs/constants.config";
import { FANTASTIC_JOB_APP_CONSTANTS } from "../configs/constants/FantasticJob.constant";
import { BRIGHT_DATA_JOB_APP_CONSTANTS } from "../configs/constants/BrightDataJob.constant";

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
import { fantasticJobLogServiceObj } from "./FantasticJobLog.service";
import { brightDataJobServiceObj } from "./BrightDataJob.service";
import { fantasticJobBatchInferenceServiceObj } from "./FantasticJobBatchInference.service";

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

    return this.getAndProcessFantasticJobs(fantasticJobLogDetails.id);
  }

  /**
   * prepareAndGetTwentyFourHourJobs
   *
   * Prepares and executes a request to the external FantasticJob Cloud API
   * to fetch jobs posted during the last 24 hours. The request is prepared
   * with the current offset and the company names are passed as a
   * comma-delimited list without spaces.
   *
   * @param {number} offset - The current offset for the request.
   * @param {string} companyNames - A comma-delimited list of company names
   * without spaces. For example: "NVIDIA,Walmart"
   * @returns {Promise<FantasticJobApiResponse[]>} A promise that resolves to
   * an array of fantastic job API responses.
   */
  private async prepareAndGetTwentyFourHourJobs(
    offset: number,
    companyNames: string // more than one company with a comma delimited list without spaces!. For example:"NVIDIA,Walmart"
  ): Promise<FantasticJobApiResponse[]> {
    // Prepare Argument for external job API call
    const fantasticJobCloudApiArgument: FantasticJobCloudApiDto = {
      offSet: offset,
      descriptionType: FANTASTIC_JOB_APP_CONSTANTS.HTML_DESCRIPTION_TYPE, // @NOTE: In near future this may be dynamically passed
      companyNames: companyNames,
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
  private validateAndFilterFantasticJobs(
    jobs: FantasticJobApiResponse[]
  ): FantasticJobApiResponse[] {
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
    error?: any
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

    if (isError && error) {
      updateData.errorDetails = {
        error: error,
        methodName: this.getAndProcessFantasticJobs.name,
        className: FantasticJobService.name,
      };
    }

    const updatedLog: DbFantasticJobLogDto =
      await fantasticJobLogServiceObj.updateFantasticJobLogById(
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
   * validateAndCreateBrightDataSnapshot
   *
   * Validates and creates a snapshot with Bright Data Job API based on the retrieved fantastic jobs.
   * If the jobs length is 0, then it creates a snapshot with all company names. Otherwise, it creates a snapshot
   * with the company names that are not found in the retrieved jobs.
   *
   * @param {FantasticJobApiResponse[]} fantasticJobDetails - The array of fantastic job details.
   * @returns {Promise<boolean>} A promise that resolves to true if the snapshot creation and scheduling
   *   are successful, false otherwise.
   */
  private async validateAndCreateBrightDataSnapshot(
    fantasticJobDetails: FantasticJobApiResponse[]
  ): Promise<boolean> {
    const brightDataLimit: number =
      process.env.APP_STAGE === APP_CONSTANTS.STAGES.DEV
        ? BRIGHT_DATA_JOB_APP_CONSTANTS.ENVIRONMENT_RETRIEVAL_LIMIT.DEV
        : BRIGHT_DATA_JOB_APP_CONSTANTS.ENVIRONMENT_RETRIEVAL_LIMIT.PROD;

    // If jobs length is 0, then use all company names to create bright data snapshot
    if (fantasticJobDetails.length === 0) {
      global.logger.info(
        "As jobs length is 0, no more fantastic jobs for this batch, so create bright data snapshot with all company names.",
        {
          jobsLength: fantasticJobDetails.length,
          methodName: this.getAndProcessFantasticJobs.name,
        }
      );

      return brightDataJobServiceObj.createAndScheduleBrightDataSnapshotRetrieval(
        BRIGHT_DATA_JOB_APP_CONSTANTS.COMPANIES,
        BRIGHT_DATA_JOB_APP_CONSTANTS.LOCATIONS,
        brightDataLimit
      );
    }

    const foundSet: Set<string> = new Set(
      fantasticJobDetails.map((item: FantasticJobApiResponse) => item.organization.trim())
    );

    // Return company names that are not found in the data
    const filteredCompanyNames: string[] =
      BRIGHT_DATA_JOB_APP_CONSTANTS.COMPANIES.filter(
        (company: string) => !foundSet.has(company)
      );

    return brightDataJobServiceObj.createAndScheduleBrightDataSnapshotRetrieval(
      filteredCompanyNames,
      BRIGHT_DATA_JOB_APP_CONSTANTS.LOCATIONS,
      brightDataLimit
    );
  }

  /**
   * getAndProcessFantasticJobs
   *
   * @param {string} fantasticJobLogId - The id of the fantastic job log in the
   * DynamoDB table.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if all
   * operations in the bulk request succeed, or `false` if any operation fails.
   */
  async getAndProcessFantasticJobs(
    fantasticJobLogId: string
  ): Promise<boolean> {
    // Initialize count variables
    let fantasticTwentyFourHourJobApiCallsCount: number = 0;
    let fantasticTwentyFourHourJobsRetrievedCount: number = 0;
    let fantasticTwentyFourHourJobsValidatedCount: number = 0;

    try {
      const fantasticJobDetails: FantasticJobApiResponse[] = [];
      const limit: number = FANTASTIC_JOB_APP_CONSTANTS.LIMIT;
      const allCompanyNames: string[] =
        FANTASTIC_JOB_APP_CONSTANTS.ATS_COMPANY_NAMES;
      const companyBatchSize: number =
        FANTASTIC_JOB_APP_CONSTANTS.COMPANY_NAME_BATCH_SIZE;

      // Split company names into batches of given size
      const companyBatches: string[][] = []; // Example: [["NVIDIA", "Walmart",...], ["Google", "Amazon",...]]
      for (let i = 0; i < allCompanyNames.length; i += companyBatchSize) {
        companyBatches.push(allCompanyNames.slice(i, i + companyBatchSize));
      }

      // Track offset for each batch
      const batchOffsets: number[] = new Array(companyBatches.length).fill(0); // Example: [0, 0]
      const activeBatches: Set<number> = new Set(
        Array.from(
          { length: companyBatches.length },
          (_, index: number) => index
        )
      ); // Example: Set {0, 1}

      const { ENVIRONMENT_RETRIEVAL_LIMIT } = FANTASTIC_JOB_APP_CONSTANTS;

      const retrievalFantasticJobLimit: number =
        process.env.APP_STAGE === APP_CONSTANTS.STAGES.DEV
          ? ENVIRONMENT_RETRIEVAL_LIMIT.DEV
          : ENVIRONMENT_RETRIEVAL_LIMIT.PROD;

      while (
        activeBatches.size > 0 &&
        fantasticJobDetails.length < retrievalFantasticJobLimit
      ) {
        const batchPromises: Promise<{
          batchIndex: number;
          jobs: FantasticJobApiResponse[];
        }>[] = [];

        // Process all active batches in parallel
        for (const batchIndex of activeBatches) {
          const companyBatch: string[] = companyBatches[batchIndex];
          const companyNamesString: string = companyBatch.join(","); // Example: "NVIDIA,Walmart,...."
          const offset: number = batchOffsets[batchIndex];

          batchPromises.push(
            this.prepareAndGetTwentyFourHourJobs(
              offset,
              companyNamesString
            ).then((jobs: FantasticJobApiResponse[]) => ({ batchIndex, jobs }))
          );
        }

        const results: {
          batchIndex: number;
          jobs: FantasticJobApiResponse[];
        }[] = await Promise.all(batchPromises);
        const batchesToRemove: number[] = [];

        for (const { batchIndex, jobs } of results) {
          fantasticTwentyFourHourJobApiCallsCount += 1;
          fantasticTwentyFourHourJobsRetrievedCount += jobs?.length ?? 0;

          if (!jobs || jobs.length === 0) {
            global.logger.info(
              "As jobs length is 0, no more jobs for this batch",
              {
                jobsLength: jobs.length,
                batchIndex,
                methodName: this.getAndProcessFantasticJobs.name,
              }
            );
            // No more jobs for this batch, remove it from active batches
            batchesToRemove.push(batchIndex);
          } else if (jobs.length < limit) {
            global.logger.info(
              "As jobs length is between 0 and limit, no more jobs for this batch",
              {
                jobsLength: jobs.length,
                batchIndex,
                methodName: this.getAndProcessFantasticJobs.name,
              }
            );

            // Process and add jobs
            const filteredJobs: FantasticJobApiResponse[] =
              this.validateAndFilterFantasticJobs(jobs);
            fantasticTwentyFourHourJobsValidatedCount +=
              filteredJobs?.length ?? 0;
            fantasticJobDetails.push(...filteredJobs);

            // No more jobs for this batch, remove it from active batches
            batchesToRemove.push(batchIndex);
          } else {
            // Process and add jobs
            const filteredJobs: FantasticJobApiResponse[] =
              this.validateAndFilterFantasticJobs(jobs);
            fantasticTwentyFourHourJobsValidatedCount +=
              filteredJobs?.length ?? 0;
            fantasticJobDetails.push(...filteredJobs);

            // Update offset for this batch
            batchOffsets[batchIndex] += limit;
          }
        }

        // Remove inactive batches
        // If `batchesToRemove` is empty, then the callback function is never executed.
        batchesToRemove.forEach((batchIndex: number) =>
          activeBatches.delete(batchIndex)
        );
      }

      // Update log and process jobs
      await this.updateRetrievedFantasticJobLog(
        false,
        fantasticJobLogId,
        fantasticTwentyFourHourJobApiCallsCount,
        fantasticTwentyFourHourJobsRetrievedCount,
        fantasticTwentyFourHourJobsValidatedCount
      );

      // Validate and create snapshot
      await this.validateAndCreateBrightDataSnapshot(fantasticJobDetails);

      if(fantasticJobDetails.length === 0) {
        return false;
      }

      return fantasticJobBatchInferenceServiceObj.processFantasticJobBatchInference(
        fantasticJobLogId,
        fantasticJobDetails
      );
    } catch (error: any) {
      global.logger.error(
        "Error at catch block while fetching fantastic jobs",
        {
          error,
          methodName: this.getAndProcessFantasticJobs.name,
        }
      );

      await this.updateRetrievedFantasticJobLog(
        true,
        fantasticJobLogId,
        fantasticTwentyFourHourJobApiCallsCount,
        fantasticTwentyFourHourJobsRetrievedCount,
        fantasticTwentyFourHourJobsValidatedCount,
        error
      );

      return false;
    }
  }
}

// Create an instance of the class
const fantasticJobServiceObj: FantasticJobService = new FantasticJobService();

// Export the class and instance object
export { FantasticJobService, fantasticJobServiceObj };
