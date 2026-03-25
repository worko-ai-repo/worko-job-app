
// import axios library for making HTTP requests
import axios, { AxiosResponse } from "axios";

// Import constants
import { BRIGHT_DATA_JOB_APP_CONSTANTS, BRIGHT_DATA_JOB_CLOUD_API_ENDPOINTS } from "../configs/constants/BrightDataJob.constant";

// Import dtos
import { BrightDataJobApiResponse, BrightDataJobDataCollectionCreateDto } from "../dtos/BrightDataJob.dto";

// Import enums
import { BrightDataJobCountryEnum, BrightDataJobEmploymentTypeEnum, BrightDataJobTimeRangeEnum } from "../enums/BrightDataJob.enum";

/**
 * BrightDataJobCloudApiLibrary
 */
class BrightDataJobCloudApiLibrary {
  private readonly baseUrl = process.env
    .APP_BRIGHT_DATA_JOB_API_BASE_URL as string;
  private readonly datasetId = process.env
    .APP_BRIGHT_DATA_JOB_DATASET_ID as string;
  private readonly authToken = process.env
    .APP_BRIGHT_DATA_JOB_AUTH_TOKEN as string;

  /**
   * createBrightDataJobSnapshotId
   *
   * Trigger data collection to Bright Data Job API by creating a snapshot ID.
   *
   * @param {string[]} companyNames The list of company names to be used in the data collection.
   * @param {string[]} locations The list of locations to be used in the data collection.
   * @return {Promise<{ snapshotId?: string }>} A promise that resolves to an object containing the snapshot ID.
   */
  async createBrightDataJobSnapshotId(
    companyNames: string[],
    locations: string[],
    limit: number,
  ): Promise<{ snapshotId?: string }> {
    global.logger.info("Creating BrightData Job Snapshot ID [Library]", {
      methodName: this.createBrightDataJobSnapshotId.name,
      limit,
      lengthOfCompanyNames: companyNames.length,
      lengthOfLocations: locations.length,
    });

    const { TYPE, DISCOVER_BY, INCLUDE_ERRORS } = BRIGHT_DATA_JOB_APP_CONSTANTS.CREATE_SNAPSHOT_ID;

    const endpoint: string =
      BRIGHT_DATA_JOB_CLOUD_API_ENDPOINTS.CREATE_SNAPSHOT_ID.strtr({
        "{baseUrl}": this.baseUrl,
        "{datasetId}": this.datasetId,
        "{includeErrors}": INCLUDE_ERRORS.FALSE,
        "{type}": TYPE.DISCOVER_NEW,
        "{discoverBy}": DISCOVER_BY.KEYWORD,
        "{limitPerInput}": `${limit}`,
      });

    const payload: BrightDataJobDataCollectionCreateDto[] = [];

    // Generate a Cartesian product of companies and locations to form the payload.
    for (const company of companyNames) {
      for (const location of locations) {
        payload.push({
          location: location,
          company: company,

          // @NOTE: "country" or "time_range" or "job_type" may be dynamic in near future
          country: BrightDataJobCountryEnum.INDIA,
          time_range: BrightDataJobTimeRangeEnum.PAST_WEEK,
          job_type: BrightDataJobEmploymentTypeEnum.FULL_TIME,
        });
      }
    }

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      global.logger.info(`Trigger data collection response:`, {
        methodName: this.createBrightDataJobSnapshotId.name,
        response: response.data,
      });

      const snapshotId: string | undefined = response.data?.snapshot_id;

      return {
        snapshotId: snapshotId,
      };
    } catch (error: any) {
      global.logger.error("Error at catch block while creating snapshot:", {
        methodName: this.createBrightDataJobSnapshotId.name,
        error: error,
      });

      return {
        snapshotId: undefined,
      };
    }
  }

  /**
   * getBrightDataJobBySnapshotId
   * 
   * Retrieves the jobs from Bright Data Job Cloud API based on the snapshot id.
   *
   * @param {string} snapshotId - The snapshot id to retrieve the jobs for.
   * @returns {Promise<BrightDataJobApiResponse[]>} A promise that resolves to an array of
   *   BrightDataJobApiResponse objects, or an empty array if there's an error.
   */
  async getBrightDataJobBySnapshotId(
    snapshotId: string
  ): Promise<BrightDataJobApiResponse[]> {
    const endpoint: string =
      BRIGHT_DATA_JOB_CLOUD_API_ENDPOINTS.GET_JOBS_BY_SNAPSHOT_ID.strtr({
        "{baseUrl}": this.baseUrl,
        "{snapshotId}": snapshotId,
        "{fileFormat}": BRIGHT_DATA_JOB_APP_CONSTANTS.FILE_FORMAT.JSON,
      });

    try {
      let retries = 0;
      let maxRetries = 3;

      // Loop until the snapshot is ready
      while (retries < maxRetries) {
        const response: AxiosResponse<any, any> = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        });

        const data = response.data;

        if (Array.isArray(data)) {
          global.logger.info(
            "Retrieved Bright Data jobs successfully.",
            {
              snapshotId,
              methodName: this.getBrightDataJobBySnapshotId.name,
              dataLength: data.length,
            }
          )
          return data as BrightDataJobApiResponse[];
        }

        /*
        {
          "status": "running",
          "message": "Snapshot is not ready yet, try again in 30s"
        }
        */
        if (
          "status" in data && data?.status === BRIGHT_DATA_JOB_APP_CONSTANTS.SNAPSHOT_STATUS.RUNNING
        ) {
          global.logger.info(
            "Snapshot is not ready yet.",
            {
              snapshotId,
              methodName: this.getBrightDataJobBySnapshotId.name,
            }
          );

          retries += 1;

          // Wait for 30 seconds
          await new Promise((resolve) => setTimeout(resolve, 30000));
        }
      }

      return [];
    } catch (error: any) {
      global.logger.error(
        "Error at catch block while retrieving Bright Data jobs:",
        {
          methodName: this.getBrightDataJobBySnapshotId.name,
          error: error,
        }
      );

      return [];
    }
  }
}

const brightDataJobCloudApiLibraryObj: BrightDataJobCloudApiLibrary = new BrightDataJobCloudApiLibrary();
export {
   brightDataJobCloudApiLibraryObj,
   BrightDataJobCloudApiLibrary
}