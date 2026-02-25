// Import aws lambda related types
import { Context, SQSEvent } from "aws-lambda";

// Import extensions
import "./extensions/string.extension";
import "./extensions/array.extension";

// Import libraries
import "./libraries/logger.library";

// Import configurations
import DBConfig from "./db/DB.config";

// Import dtos
import {
  SqsMsgBaseReqDto,
  SqsMsgJobApplicationValidationMatchingScoreReqDto,
} from "./dtos/SqsEvent.dto";

// Import enums
import { SqsMsgEventEnum } from "./enums/SqsEvent.enum";

// Import services
import { userJobApplicationServiceObj } from "./services/UserJobApplication.service";

// Import utils
import { BaseError } from "./utils/errors.util";
import HttpStatusCode from "./utils/http-codes.util";
import { responseHandlerUtilObj } from "./utils/response-handler.util";

/**
 * Initializes the database configuration.
 *
 * Creates a new instance of the DBConfig and calls the "init" method to establish the database connection.
 */
const initDatabaseConfig = () => {
  // Create a new database configuration instance
  const dbConf = new DBConfig();

  // Initialize the database configuration
  dbConf.init();
};

// Initialize the database configuration
initDatabaseConfig();

/**
 * validateUserJobApplicationMatchingScore
 * 
 * Validates the matching score of a job application.
 *
 * @param {SqsMsgJobApplicationValidationMatchingScoreReqDto} message - The message
 *   from the SQS event containing the details of the job application to be validated.
 * @param {SQSEvent} event - The SQS event object containing the message and other
 *   context details.
 * @param {Context} context - The lambda context object containing the
 *   information about the invocation.
 * @returns {Promise<object>} A promise that resolves to a success or error
 *   response object.
 */
const validateUserJobApplicationMatchingScore = async (
  message: SqsMsgJobApplicationValidationMatchingScoreReqDto,
  event: SQSEvent,
  context: Context
): Promise<object> => {
  try {
    global.logger.debug(
      `Details of sqs event for job application matching score validation: `,
      {
        filePath: __filename,
        methodName: "validateUserJobApplicationMatchingScore",
        message: message,
        event: event,
        context: context,
      }
    );

    // Retrieve the necessary information from the message
    const { jobApplicationRequestId } = message.context;
    const { userEmail, userId } = message;

    // Validate the job application matching score
    const isjobApplicationMatchingScoreValid: boolean =
      await userJobApplicationServiceObj.validateUserJobApplicationMatchingScore(
        jobApplicationRequestId,
        userEmail,
      );

    global.logger.debug(
      `Details of job application after matching score validation: `,
      {
        filePath: __filename,
        methodName: "validateUserJobApplicationMatchingScore",
        isjobApplicationMatchingScoreValid: isjobApplicationMatchingScoreValid,
        jobApplicationRequestId: jobApplicationRequestId,
        userEmail: userEmail,
        userId: userId,
      }
    );

    // Return success response if validation was successful
    if (isjobApplicationMatchingScoreValid) {
      global.logger.info(
        `Job application matching score validated successfully.`,
        {
          filePath: __filename,
          methodName: "validateUserJobApplicationMatchingScore",
          jobApplicationRequestId: jobApplicationRequestId,
        }
      );

      return responseHandlerUtilObj.sendSuccess(
        HttpStatusCode.OK_200,
        "Job application matching score validated successfully."
      );
    } else {
      // Throw custom error if validation failed
      throw new BaseError(
        `Unable to validate job application matching score for job application".`,
        HttpStatusCode.BAD_REQUEST_400
      );
    }
  } catch (error: any) {
    // Return error response if validation failed
    return responseHandlerUtilObj.sendError(error, error?.errorMsg ?? error?.message);
  }
};


/**
 * Handler
 * 
 * Handles the SQS event and processes actions based on the event type.
 * 
 * @param {SQSEvent} event - The SQS event object containing the message body.
 * @param {Context} context - The AWS Lambda context object.
 * @return {Promise<object>} A promise that resolves with the response object.
 */
export const handler = async (
  event: SQSEvent,
  context: Context
): Promise<object> => {
  try {
    // Log received SQS event
    global.logger.info("App event trigger: Received event from SQS: ", {
      filePath: __filename,
      methodName: "handler",
      event: event,
    });

    // Extract message body from event
    let messageBody: string = event.Records[0].body;

    global.logger.info(`App event trigger: messageBody: ${messageBody}`, {
      filePath: __filename,
      methodName: "handler",
    });

    // Convert message body to string if not already a string
    if (typeof messageBody !== "string") {
      messageBody = JSON.stringify(messageBody);
      global.logger.info(
        `App event trigger: messageBody (converted to string): ${messageBody}`,
        {
          filePath: __filename,
          methodName: "handler",
        }
      );
    }

    // Parse message body
    const parsedMessageBody = JSON.parse(messageBody);

    // Extract message and event type
    const parsedMessage: SqsMsgBaseReqDto = parsedMessageBody;
    const messageEvent = parsedMessage.event;

    global.logger.info("App event trigger: parsedMessage and messageEvent: ", {
      filePath: __filename,
      methodName: "handler",
      parsedMessageBody: parsedMessageBody,
      parsedMessage: parsedMessage,
      messageEvent: messageEvent,
    });

    // Handle different event types
    if (
      messageEvent === SqsMsgEventEnum.JOB_APPLICATION_VALIDATE_MATCHING_SCORE
    ) {
      return validateUserJobApplicationMatchingScore(
        parsedMessage as SqsMsgJobApplicationValidationMatchingScoreReqDto,
        event,
        context
      );
    }

    // Throw error if event type is invalid
    throw new BaseError(
      `The provided event ${messageEvent} is invalid, therefore it cannot be processed.`
    );
  } catch (error: any) {
    // Return error response if an unexpected error occurred
    return responseHandlerUtilObj.sendError(error, "An unexpected error occurred.");
  }
};
