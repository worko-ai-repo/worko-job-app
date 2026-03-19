// Import aws sdk related types
import {
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
} from "@aws-sdk/client-lambda"; // AWS SDK Version 3

// Import lambds related types
import { APIGatewayProxyResult } from "aws-lambda";

// import enums
import { InvocationTypeEnum } from "../enums/InvokeLambda.enum";

// import utils
import HttpStatusCode from "../utils/http-codes.util";

/**
 * API Reference Invoke Lambda Documentation:
 * @see https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html
 * 
 * API Invoke Error Codes:
 * @see https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html#API_Invoke_Errors
 */
class AwsClientLambdaLibrary {
  client = new LambdaClient({
    region: process.env.APP_AWS_REGION,
  });

  async triggerLambdaEventInvocationType<InvokeCommandPayload>(
    lambdaFunctionName: string,
    payload: InvokeCommandPayload
  ): Promise<APIGatewayProxyResult> {
    try {
      // Trigger Lambda
      const command: InvokeCommand = new InvokeCommand({
        FunctionName: lambdaFunctionName,
        Payload: JSON.stringify(payload),
        InvocationType: InvocationTypeEnum.EventType,
      });

      // Send Command
      const response: InvokeCommandOutput = await this.client.send(command);

      // If Lambda function execution is failed, then return the error response
      if (response.StatusCode !== HttpStatusCode.ACCEPTED_202) {
        // logger
        global.logger.debug(
          `Error message while triggering ${lambdaFunctionName} lambda.`,
          {
            errorMessage: response,
            statusCode: response.StatusCode,
          }
        );

        // return the error response
        return {
          statusCode:
            response.StatusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR_500,
          body: `Unable to trigger ${lambdaFunctionName} lambda.`,
        };
      }

      // return the success response
      return {
        statusCode: response.StatusCode ?? HttpStatusCode.ACCEPTED_202,
        body: ` ${lambdaFunctionName} lambda triggered successfully!!`,
      };
    } catch (error: any) {
      global.logger.debug(
        `Error message while triggering ${lambdaFunctionName} lambda.`,
        {
          error: error,
        }
      );

      // return the error response
      return {
        statusCode:
          error.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        body: `Unable to trigger ${lambdaFunctionName} lambda.`,
      };
    }
  }

  async triggerLambdaRequestResponseInvocationType<InvokeCommandPayload>(
    lambdaFunctionName: string,
    payload: InvokeCommandPayload
  ): Promise<APIGatewayProxyResult> {
    try {
      /**
       * command
       * 
       * Prepare the command
       *
       * Sample Output of the `command`:
       *  {
            "input": {
              "FunctionName": "worko-job-description-parser-dev",
              "InvocationType": "RequestResponse",
              "Payload": "{\"JOB_DESC\":\"Job Title: Backend Developer Location: Hyderabad, India / Remote Summary:......"}"
            },
            "middlewareStack": {}
      *  }
      */
      const command: InvokeCommand = new InvokeCommand({
        FunctionName: lambdaFunctionName,
        Payload: JSON.stringify(payload),
        InvocationType: InvocationTypeEnum.RequestResponseType,
      });

      /**
       * Invoke the Lambda function and get the response
       * 
       * Sample Output of the `response`:
       * {
          "$metadata": {
              "httpStatusCode": 200,
              "requestId": "7a708443-8c16-4a63-866f-eef79841d2e4",
              "attempts": 1,
              "totalRetryDelay": 0
          },
          "ExecutedVersion": "$LATEST",
          "Payload": { 
              "0": 91,
              "1": 123,
              "2": 34,
              "3": 116,
              "4": 121,
              "5": 112,
              .
              .
              "903": 85,
              "904": 73,
          },
          "StatusCode": 200
        }
      */
      let response: InvokeCommandOutput = await this.client.send(command);

      // Decode the Payload
      let decodedPayload: APIGatewayProxyResult;

      /**
       * Check if Payload is present and decode it
       *
       * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_lambda_code_examples.html#actions
       */
      if (response["Payload"]) {
        /**
         * @see https://www.w3schools.com/nodejs/met_buffer_from.asp
         * 
         * Sample Output of the `buffer`:
         *  {
              "data": [
                  123,
                  34,
                  115,
                  .
                  .
                  67,
                  125,
                  34,
                  125
              ],
              "type": "Buffer"
            },
        */
        const buffer: Buffer = Buffer.from(response["Payload"]);

        /**
         * 1. (method) Buffer.toString(encoding?: BufferEncoding, start?: number, end?: number): string
         * 2. Decodes buf to a string according to the specified character encoding inencoding. 
         *    start and end may be passed to decode only a subset of buf.
         * 3. If encoding is 'utf8' and a byte sequence in the input is not valid UTF-8, 
         *    then each invalid byte is replaced with the replacement character U+FFFD.
         * 4. The maximum length of a string instance (in UTF-16 code units) is available as constants.MAX_STRING_LENGTH.
         * 
         * Sample Output of the `decodedString`:
         *
         * "{\"statusCode\": 200, \"headers\": {\"Content-Type\": \"application/json\"}, \"body\": \"{\\\"Job Title\\\": \\\"Backend Developer\\\", 
           \\\"Salary Range\\\": null, \\\"Experience Range\\\": null, \\\"Number of Openings\\\": null, 
          \\\"Work Mode\\\": \\\"Hyderabad, India / Remote\\\", \\\"Location\\\": \\\"Hyderabad, India / Remote\\\", 
          \\\"Notice Period (Months)\\\": null, \\\"Type of Employment\\\": null, \\\"Department\\\": null, 
          \\\"Core Skills\\\": [\\\"JavaScript\\\", \\\"HTML\\\", \\\"CSS\\\", \\\"MERN stack\\\", 
          \\\"React.js\\\", \\\"Node.js\\\", \\\"Express.js\\\", \\\"MongoDB\\\", \\\"PostgreSQL\\\", \\\"SQLite\\\", 
          \\\"Redux\\\", \\\"Bootstrap\\\", \\\"Docker\\\", \\\"MVC architecture\\\", \\\"Git\\\", \\\"GitHub\\\", 
          \\\"Postman\\\"], \\\"Soft Skills\\\": null, \\\"Technical Skills\\\": [\\\"RESTful APIs\\\", \\\"Web services\\\", 
          \\\"NoSQL databases\\\", \\\"SQL databases\\\", \\\"Socket.IO\\\", \\\"Responsive user interfaces\\\", \\\"Unit testing\\\", 
          \\\"Debugging\\\", \\\"Code reviews\\\", \\\"Application optimization\\\", \\\"ORM/ODM tools (Mongoose, Sequelize)\\\"], 
          \\\"Good to Have Skills\\\": [\\\"Experience with Docker and containerization\\\"]}\"}"
        */
        const decodedString: string = buffer.toString("utf8");

        // Parse JSON
        global.logger.info(`Parsing JSON...`);
        decodedPayload = JSON.parse(decodedString);

        /**
         * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.response
         * 
         * Sample Output of the `decodedPayload`:
         * {
             "body": "{\"Job Title\": \"Backend Developer\", \"Salary Range\": null, \"Good command over  Skills\": [\"Experience with Docker and containerization\"]....}",
              "headers": {
                "Content-Type": "application/json"
              },
              "statusCode": 200
        * }
        */
        global.logger.debug(`Decoded Payload Response Status Code:`, {
          decodedPayloadStatusCode: decodedPayload["statusCode"],
        });
      } else {
        global.logger.warn(`No Payload found in the Lambda response`);
        decodedPayload = {
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
          body: "No Payload found in the Lambda response",
        };
      }

      // return the decoded payload as response
      return decodedPayload;
    } catch (error) {
      global.logger.debug(`Error at catch block while invoking lambda with request-response invocation type for ${lambdaFunctionName}.`, {
        error: error,
      });

      // return the error response
      return {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        body: `Failed to invoke lambda with request-response invocation type for ${lambdaFunctionName}.`,
      };
    }
  }
}

export { AwsClientLambdaLibrary };