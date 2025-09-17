
// Import aws lambda related types
import { APIGatewayProxyResult } from "aws-lambda";

// Import enums
import { OpenSearchOperationsEnum } from "../enums/Common.enum";

// Import services
import InvokeLambdaService from "../services/InvokeLambda.service";

// Import utils
import HttpStatusCode from "./http-codes.util";
import { BaseError } from "./errors.util";


class InvokeVpcLambdaOpenSearchUtil {
  /**
   * Executes an operation on an OpenSearch index by invoking a VPC Lambda function.
   *
   * This method constructs a payload with the specified index name, operation body,
   * and operation type, then triggers the OpenSearch operation through a Lambda invocation.
   * It handles the Lambda response, returning the operation response or throwing an error
   * if the operation fails.
   *
   * @template OperationBody - The type of the operation body being sent to the Lambda function.
   * @template OperationResponse - The expected type of the response from the operation.
   * @param {string} indexName - The name of the OpenSearch index to perform the operation on.
   * @param {OperationBody} body - The body of the operation to be performed.
   * @param {OpenSearchOperationsEnum} operation - The type of OpenSearch operation to execute.
   * @param {string} operationName - A descriptive name for the operation being performed.
   * @param {string} methodName - The name of the method invoking this operation, used for logging.
   * @param {object} [context={}] - Additional context information to include in the logs.
   * @returns {Promise<OperationResponse>} A promise that resolves to the response of the operation.
   * @throws {BaseError} If the response indicates a failure.
   */
  async executeOperation<OperationBody, OperationResponse>(
    indexName: string,
    body: OperationBody,
    operation: OpenSearchOperationsEnum,
    operationName: string,
    methodName: string,
    context: object = {}
  ): Promise<OperationResponse> {
    const response: APIGatewayProxyResult =
      await InvokeLambdaService.triggerOpenSearchOperation<{
        indexName: string;
        body: OperationBody;
        operation: OpenSearchOperationsEnum;
      }>({
        indexName,
        body,
        operation,
      });

    return this.handleResponseOrThrow<OperationResponse>(
      response,
      operationName,
      methodName,
      context
    );
  }

  /**
   * handleResponseOrThrow
   * 
   * Checks if the response has a status code of 200 and if the body is in
   * JSON format. If not, throws an error.
   *
   * @param {APIGatewayProxyResult} response - The response object from the lambda.
   * @param {string} operation - The name of the operation that was performed.
   * @param {string} methodName - The name of the method that invoked this function.
   * @param {object} context - The context object that contains any additional
   * information that needs to be logged.
   * @returns {OperationResponse} The parsed response body.
   * @throws {BaseError} If the response status code is not 200 or if the response
   * body is not in JSON format.
   */
  private handleResponseOrThrow<OperationResponse>(
    response: APIGatewayProxyResult,
    operation: string,
    methodName: string,
    context: object = {}
  ): OperationResponse {
    if (response.statusCode !== HttpStatusCode.OK_200) {
      global.logger.error(`Unable to ${operation}`, {
        methodName,
        response,
        ...context,
      });

      throw new BaseError(
        `Unable to ${operation}.`,
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }

    try {
      global.logger.info(`Trying to parse response body for ${operation}.`);
      return JSON.parse(response.body);
    } catch (err: any) {
      global.logger.error(`Failed to parse response body for ${operation}.`, {
        err
      });
      throw new BaseError(
        `Malformed response for ${operation}.`,
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }
}

const invokeVpcLambdaOpenSearchUtilObj: InvokeVpcLambdaOpenSearchUtil = new InvokeVpcLambdaOpenSearchUtil();
export {
  invokeVpcLambdaOpenSearchUtilObj,
  InvokeVpcLambdaOpenSearchUtil
};