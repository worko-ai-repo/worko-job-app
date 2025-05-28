/**
 * FANTASTIC_JOB_APP_CONSTANTS
 */
const FANTASTIC_JOB_APP_CONSTANTS = {
  /**
   * DESCRIPTION_TYPE
   */
  DESCRIPTION_TYPE: "text",

  /**
   * HTML_DESCRIPTION_TYPE
   */
  HTML_DESCRIPTION_TYPE: "html",

  /**
   * LOCATION_FILTER
   */
  LOCATION_FILTER: "India",

  /**
   * OFF_SET
   */
  OFF_SET: 0,

  /**
   * LIMIT
   */
  LIMIT: 100,
};

/**
 * FANTASTIC_JOB_CLOUD_API_ENDPOINTS
 *
 * This object contains endpoint URLs for various FantasticJob Cloud API operations.
 * The URLs are parameterized and should be populated with actual values before use.
 */
const FANTASTIC_JOB_CLOUD_API_ENDPOINTS = {
  /**
   * FANTASTIC_JOB_GET_TWENTY_FOUR_HOURS
   *
   * Endpoint for retrieving fantastic jobs which are posted during the last Twenty Four hours
   */
  FANTASTIC_JOB_GET_TWENTY_FOUR_HOURS: `{baseUrl}/active-ats-24h`,
};

// export constants
export { FANTASTIC_JOB_CLOUD_API_ENDPOINTS, FANTASTIC_JOB_APP_CONSTANTS };
