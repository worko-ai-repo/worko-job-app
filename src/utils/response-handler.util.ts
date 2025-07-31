
// Import lambda
import { APIGatewayProxyResult } from "aws-lambda";

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

  /**
   * sendSuccessResponseForInvokedLambda
   * 
   * Sends a success response for an invoked Lambda function.
   *
   * This method returns an API Gateway proxy result with a 200 OK status code,
   * content type header set to "application/json", and the given response
   * serialized as the response body.
   *
   * @template SuccessResponse - The type of the success response.
   * @param {SuccessResponse} response - The success response object to be serialized
   * and included in the response body.
   * @returns {APIGatewayProxyResult} The formatted API Gateway proxy response
   * object containing the success response.
   */
  sendSuccessResponseForInvokedLambda<SuccessResponse>(response: SuccessResponse): APIGatewayProxyResult {
    return {
      statusCode: HttpStatusCode.OK_200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    };
  }
}

const responseHandlerUtilObj: ResponseHandlerUtil = new ResponseHandlerUtil();
export { responseHandlerUtilObj, ResponseHandlerUtil };