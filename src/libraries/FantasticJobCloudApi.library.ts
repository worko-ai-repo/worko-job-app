// import axios library for making HTTP requests
import axios, { AxiosResponse } from "axios";

// import constants
import {
  FANTASTIC_JOB_CLOUD_API_ENDPOINTS,
  FANTASTIC_JOB_APP_CONSTANTS,
} from "../configs/constants/FantasticJob.constant";

// Import dtos
import {
  FantasticJobCloudApiDto,
  FantasticJobApiResponse,
  FantasticJobCloudApiQueryParamDTO,
} from "../dtos/FantasticJob.dto";

// Import utils
import HttpMethodCode from "../utils/http-methods.util";

/**
 * FantasticJobCloudApiLibrary
 */
class FantasticJobCloudApiLibrary {
  /**
   * Set up the necessary configuration from environment variables.
   */
  private readonly baseUrl = process.env
    .APP_FANTASTIC_JOB_API_BASE_URL as string;
  private readonly apiHost = process.env.APP_FANTASTIC_JOB_API_HOST as string;
  private readonly apiKey = process.env.APP_FANTASTIC_JOB_API_KEY as string;

  /**
   * getFantasticJobTwentyFourHours
   *
   * Fetches jobs from the Fantastic Job Cloud API which are posted during the last
   * Twenty Four hours.
   *
   * @param {FantasticJobCloudApiDto | undefined} [fantasticJobCloudApiDto]
   * @returns {Promise<FantasticJobApiResponse[]>} A promise that resolves to an
   * array of fantastic job API responses.
   */
  async getFantasticJobTwentyFourHours(
    fantasticJobCloudApiDto?: FantasticJobCloudApiDto
  ): Promise<FantasticJobApiResponse[]> {
    // Set up the URL
    const fantasticJobTwentyFourHoursUrl: string =
      FANTASTIC_JOB_CLOUD_API_ENDPOINTS.FANTASTIC_JOB_GET_TWENTY_FOUR_HOURS.strtr(
        {
          "{baseUrl}": this.baseUrl,
        }
      );

    /**
     * fantasticJobCloudApiParamDto
     *
     * Build the query parameters for the Fantastic Job Cloud API
     */
    let fantasticJobCloudApiParamDto: FantasticJobCloudApiQueryParamDTO;

    if (fantasticJobCloudApiDto?.offSet) {
      fantasticJobCloudApiParamDto = {
        description_type:
          fantasticJobCloudApiDto?.descriptionType ??
          FANTASTIC_JOB_APP_CONSTANTS.DESCRIPTION_TYPE,
        location_filter:
          fantasticJobCloudApiDto?.locationFilter ??
          FANTASTIC_JOB_APP_CONSTANTS.LOCATION_FILTER,
        offset: fantasticJobCloudApiDto?.offSet?.toString(),
      };
    } else {
      fantasticJobCloudApiParamDto = {
        description_type:
          fantasticJobCloudApiDto?.descriptionType ??
          FANTASTIC_JOB_APP_CONSTANTS.DESCRIPTION_TYPE,
        location_filter:
          fantasticJobCloudApiDto?.locationFilter ??
          FANTASTIC_JOB_APP_CONSTANTS.LOCATION_FILTER,
      };
    }

    // Set up the request options
    const options = {
      method: HttpMethodCode.GET,
      url: fantasticJobTwentyFourHoursUrl,
      params: fantasticJobCloudApiParamDto,
      headers: {
        "x-rapidapi-host": this.apiHost,
        "x-rapidapi-key": this.apiKey,
      },
    };

    /**
     * Axios Request - Get Fantastic Jobs Which are posted during the last Twenty Four hours
     */
    const response: AxiosResponse<any, any> = await axios.request(options);

    // return the response data
    return response.data;
  }
}

// Create an instance of the FantasticJobCloudApiLibrary class
const fantasticJobCloudApiLibraryObj = new FantasticJobCloudApiLibrary();

// Export an instance of the FantasticJobCloudApiLibrary class and the FantasticJobCloudApiLibrary class
export { fantasticJobCloudApiLibraryObj, FantasticJobCloudApiLibrary };
