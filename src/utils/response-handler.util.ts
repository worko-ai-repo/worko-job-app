
// Import utils
import HttpStatusCode from "./http-codes.util";

class ResponseHandlerUtil {
  /**
   * sendError
   * 
   * Sends an error response.
   *
   * @param {any} error - The error object.
   * @param {string} message - The error message to return in the response.
   * @param {boolean} [consoleResponse=true] - Whether to log the error response to the console.
   * @returns {Promise<{ statusCode: number; body: string }>} The formatted error response object.
   */
  async sendError(
    error: any,
    message: string,
    consoleResponse: boolean = true
  ): Promise<{ statusCode: number; body: string }> {
    const response = {
      statusCode: error?.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR_500,
      body: JSON.stringify({
        message: message,
        error: error?.message ?? "Internal Server Error",
      }),
    };

    if (consoleResponse) {
      global.logger.error("ResponseHandler.sendError:", {
        filePath: __filename,
        methodName: this.sendError.name,
        response: response,
      });
    }

    return response;
  }

  /**
   * sendSuccess
   * 
   * Sends a success response.
   *
   * @param {number} statusCode - The HTTP status code to return.
   * @param {string} message - The success message to return in the response.
   * @param {boolean} [consoleResponse=true] - Whether to log the success response to the console.
   * @returns {Promise<{ statusCode: number; body: string }>} The formatted success response object.
   */
  async sendSuccess(
    statusCode: HttpStatusCode,
    message: string,
    consoleResponse: boolean = true
  ): Promise<{ statusCode: number; body: string }> {
    const response = {
      statusCode,
      body: JSON.stringify({ message }),
    };

    if (consoleResponse) {
      global.logger.info("ResponseHandler.sendSuccess:", {
        filePath: __filename,
        methodName: this.sendSuccess.name,
        response: response,
      });
    }

    return response;
  }
}

const responseHandlerUtilObj: ResponseHandlerUtil = new ResponseHandlerUtil();
export { responseHandlerUtilObj, ResponseHandlerUtil };