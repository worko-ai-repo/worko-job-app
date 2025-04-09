// import axios library for making HTTP requests
import axios, { AxiosResponse } from "axios";

// import constants
import {
  FANTASTIC_JOB_CLOUD_API_ENDPOINTS,
  FANTASTIC_JOB_APP_CONSTANTS,
} from "../configs/constants/ExternalJob.constant";

// Import dtos
import { FantasticJobCloudApiDto, FantasticJobApiResponse, FantasticJobCloudApiQueryParamDTO } from "../dtos/FantasticJob.dto";

// Import utils
import HttpMethodCode from "../utils/http-methods.util";
import HttpStatusCode from "../utils/http-codes.util";

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
   * Retrieves fantastic jobs posted during the last twenty-four hours.
   *
   * @param {FantasticJobCloudApiDto} [fantasticJobCloudApiDto] - Optional parameters for the API request, including
   * description type, location filter, and offset.
   * @returns {Promise<FantasticJobApiResponse[]>} A promise that resolves to an array of fantastic job API responses.
   * @throws Will log and return an error response if the request fails.
   */
  async getFantasticJobTwentyFourHours(
    fantasticJobCloudApiDto?: FantasticJobCloudApiDto
  ): Promise<FantasticJobApiResponse[]> {
    try {
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
    } catch (error: any) {
      global.logger.debug(
        "Error Details in [Get Fantastic Jobs Which are posted during the last Twenty Four hours] [Catch Block]:",
        {
          error: error,
        }
      );
      return (
        error?.response?.data || {
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
          message: "Internal Server Error",
        }
      );
    }
  }
}

// Create an instance of the FantasticJobCloudApiLibrary class
const fantasticJobCloudApiLibraryObj = new FantasticJobCloudApiLibrary();

// Export an instance of the FantasticJobCloudApiLibrary class and the FantasticJobCloudApiLibrary class
export { fantasticJobCloudApiLibraryObj, FantasticJobCloudApiLibrary };
