
// Import luxon
import { DateTime } from "luxon";

// Import constants
import { BRIGHT_DATA_JOB_APP_CONSTANTS } from "../configs/constants/BrightDataJob.constant";
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import { BrightDataJobApiResponse } from "../dtos/BrightDataJob.dto";
import { ScheduleBrightDataJobToRetrieveInputDto, ScheduleJobCreateDto } from "../dtos/ScheduleJob.dto";

// Import enums
import { ScheduleJobStatus, ScheduleJobType } from "../enums/ScheduleJob.enum";

// Import helpers
import { jobDescriptionValidatorHelperObj } from "../helpers/jobDescriptionValidator.helper";

// Import libraries
import { brightDataJobCloudApiLibraryObj } from "../libraries/BrightDataJobCloudApi.library";

// Import models
import { DbScheduleJobDto } from "../db/models/ScheduleJob.model";

// Import services
import { brightDataJobBatchInferenceServiceObj } from "./BrightDataJobBatchInference.service";
import ScheduleJobService from "./ScheduleJob.service";

/**
 * BrightDataJobService
 */
class BrightDataJobService {
  /**
   * scheduleBrightDataJobToRetrieve
   *
   * This function schedules a job to retrieve the bright data job after specified hours.
   * It takes the snapshot ID as the input and schedules the job using the scheduler lambda.
   * The input is passed as a JSON object to the scheduled job.
   * 
   * One-time schedules
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html#one-time
   * 
   * @param {string} snapshotId - The snapshot ID of the bright data job to be retrieved.
   * @returns {Promise<boolean>} A promise that resolves to true if the scheduled job is created successfully, false otherwise.
   */
  async scheduleBrightDataJobToRetrieve(
    snapshotId: string,
  ): Promise<boolean> {
    global.logger.info(
      `Attempting to create delay for bright data job retrieval`,
      {
        methodName: this.scheduleBrightDataJobToRetrieve.name,
      }
    );

    // Calculate the schedule time based on the delay hours constant
    const delayHours: number = BRIGHT_DATA_JOB_APP_CONSTANTS.BRIGHT_DATA_JOB_RETRIEVAL_AFTER_X_HOURS;

    // Prepare input details
    let scheduleBrightDataJobToRetrieveInput: ScheduleBrightDataJobToRetrieveInputDto =
      {
        snapshotId: snapshotId,
      };

    // Prepare the payload for the scheduled job
    const scheduleJobPayload: ScheduleJobCreateDto = {
      type: ScheduleJobType.BRIGHT_DATA_JOB_TO_RETRIEVE,
      scheduleTime: DateTime.now()
        .plus({ hours: delayHours })
        .toUTC()
        .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      input: scheduleBrightDataJobToRetrieveInput,
      desc: `Scheduled job to retrieve bright data job after specified hours.`,
      status: ScheduleJobStatus.SCHEDULED,
    };
    global.logger.info(`scheduleJobPayload`, {
      scheduleJobPayload,
    });

    // Prepare scheduler lambda arn
    const schedulerLambdaArn: string =
      APP_CONSTANTS.AWS_EVENT_BRIDGE_SCHEDULER_ARNS.LAMBDA_ARN.strtr({
        "{serverlessFunctionName}": APP_CONSTANTS.SERVERLESS_FUNCTION_NAMES.APP_SCHEDULER_BRIGHT_DATA_EXTERNAL_JOBS,
      });

    // Create the scheduled job
    let scheduleJobCreated: DbScheduleJobDto =
      await ScheduleJobService.createScheduleJob(
        scheduleJobPayload,
        schedulerLambdaArn
      );

    if (!scheduleJobCreated?.id) {
      return false;
    } 

    return true;
  }

  /**
   * createAndScheduleBrightDataSnapshotRetrieval
   *
   * @param {string[]} companyNames - The list of company names to be used in the snapshot creation.
   * @param {string[]} locationNames - The list of locations to be used in the snapshot creation.
   * @param {number} brightDataLimit - The limit of the snapshot creation.
   * @returns {Promise<boolean>} A promise that resolves to true if the snapshot creation and scheduling
   *   are successful, false otherwise.
   */
  async createAndScheduleBrightDataSnapshotRetrieval(
    companyNames: string[],
    locationNames: string[],
    brightDataLimit: number
  ): Promise<boolean> {
    const { snapshotId } =
      await this.createBrightDataJobSnapshotId(
        companyNames,
        locationNames,
        brightDataLimit
      );

    if (!snapshotId) {
      return false;
    }

    return this.scheduleBrightDataJobToRetrieve(
      snapshotId
    );
  }

  /**
   * createBrightDataJobSnapshotId
   *
   * Trigger data collection to Bright Data Job API by creating a snapshot ID.
   *
   * @param {string[]} companyNames The list of company names to be used in the data collection.
   * @param {string[]} locations The list of locations to be used in the data collection.
   * @param {number} limit The limit of the data collection.
   * @return {Promise<{ snapshotId?: string }>} A promise that resolves to an object containing the snapshot ID.
   */
  async createBrightDataJobSnapshotId(
    companyNames: string[],
    locations: string[],
    limit: number
  ): Promise<{ snapshotId?: string }> {
    global.logger.info("Creating BrightData Job Snapshot ID [Service]", {
      methodName: this.createBrightDataJobSnapshotId.name,
      limit,
      lengthOfCompanyNames: companyNames.length,
      lengthOfLocations: locations.length,
    });

    return brightDataJobCloudApiLibraryObj.createBrightDataJobSnapshotId(
      companyNames,
      locations,
      limit
    );
  }

  private validateAndFilterFantasticJobs(
    jobs: BrightDataJobApiResponse[]
  ): BrightDataJobApiResponse[] {
    return jobs.filter((eachJob: BrightDataJobApiResponse) => {
      const givenJobDescription: string | undefined | null = eachJob.job_summary;

      const isValidDescription: boolean | "" | null | undefined =
        givenJobDescription &&
        jobDescriptionValidatorHelperObj.isValidDescription(
          givenJobDescription
        );

      return isValidDescription;
    });
  }

  /**
   * getAndProcessBatchInferenceForBrightDataJobs
   *
   * Retrieves BrightData jobs based on the given snapshot ID and processes them for batch inference.
   * If the jobs length is 0, then it returns false.
   * Otherwise, it calls the processBatchInferenceForBrightDataJobs method of the BrightDataJobBatchInferenceService
   * to process the jobs for batch inference.
   *
   * @param {string} snapshotId - The snapshot ID of the BrightData job to be retrieved.
   * @returns {Promise<boolean>} A promise that resolves to true if the jobs are successfully processed for batch inference, false otherwise.
   */
  async getAndProcessBatchInferenceForBrightDataJobs(
    snapshotId: string,
  ): Promise<boolean> {
    global.logger.info("Get and Processing BrightData Jobs [Service]", {
      snapshotId,
      methodName: this.getAndProcessBatchInferenceForBrightDataJobs.name,
    });

    const brightDataJobs: BrightDataJobApiResponse[] = await brightDataJobCloudApiLibraryObj.getBrightDataJobBySnapshotId(snapshotId);

    if(!brightDataJobs.length) {
      return false;
    }

    const filteredBrightDataJobs: BrightDataJobApiResponse[] = this.validateAndFilterFantasticJobs(brightDataJobs);

    return brightDataJobBatchInferenceServiceObj.processBrightDataJobBatchInference(
      filteredBrightDataJobs
    );
  }

  /**
   * validateAndCreateBrightDataSnapshot
   *
   * Validates and creates a snapshot with Bright Data Job API based on the retrieved fantastic jobs.
   * If the jobs length is 0, then it creates a snapshot with all company names. Otherwise, it creates a snapshot
   * with the company names that are not found in the retrieved jobs.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the snapshot creation and scheduling
   *   are successful, false otherwise.
   */
  async validateAndCreateBrightDataSnapshot(): Promise<boolean> {
    const brightDataLimit: number =
      process.env.APP_STAGE === APP_CONSTANTS.STAGES.PROD
        ? BRIGHT_DATA_JOB_APP_CONSTANTS.ENVIRONMENT_RETRIEVAL_LIMIT.PROD
        : BRIGHT_DATA_JOB_APP_CONSTANTS.ENVIRONMENT_RETRIEVAL_LIMIT.DEV;

    return this.createAndScheduleBrightDataSnapshotRetrieval(
      BRIGHT_DATA_JOB_APP_CONSTANTS.COMPANIES,
      BRIGHT_DATA_JOB_APP_CONSTANTS.LOCATIONS,
      brightDataLimit
    );
  }
}

const brightDataJobServiceObj: BrightDataJobService =
  new BrightDataJobService();
export { brightDataJobServiceObj, BrightDataJobService };
