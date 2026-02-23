import { Context } from "aws-lambda";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";

// Import logger library
import "./libraries/logger.library";

// Import database configuration
import DBConfig from "./db/DB.config";
import "./configs/gcp-sdk.config";

// Import dtos
import { InvokeLambdaHandlerEventPayloadDto, InvokeLambdaJobStatusCandJobRecommendAlertUpdateDto, InvokeLambdaNewInternalJobCandMatchDto } from "./dtos/InvokeLambda.dto";

// Import enums
import { InvokeLambdaHandlerEventTypeEnum } from "./enums/InvokeLambda.enum";

// Import services
import { candidateParsedCvServiceObj } from "./services/CandidateParsedCv.service";
import { candidateJobAlertServiceObj } from "./services/CandidateJobAlert.service";

// Import utils
import { BaseError } from "./utils/errors.util";
import HttpStatusCode from "./utils/http-codes.util";

/**
 * Initializes the database configuration.
 */
const initDatabaseConfig = () => {
  // Create a new database configuration instance
  const dbConf = new DBConfig();

  // Initialize the database configuration
  dbConf.init();
};

// Initialize the database configuration
initDatabaseConfig();

const sendErrResponse = async (
  error: any,
  message: string,
  consoleResponse: boolean = true,
): Promise<object> => {
  // Prepare the error response
  const response = {
    statusCode: error.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR_500,
    body: JSON.stringify({
      message: message,
      error: error.message ?? "Internal Server Error",
    }),
  };

  // Log the response if required
  if (consoleResponse) {
    global.logger.info("sendErrResponse: ", {
      filePath: __filename,
      methodName: "sendErrResponse",
      response: JSON.stringify(response),
    });
  }

  return response;
};

const sendSuccessResponse = async (
  statusCode: HttpStatusCode,
  message: string,
  consoleResponse: boolean = true,
): Promise<object> => {
  // Prepare the success response
  const response = {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
    }),
  };

  // Log the response if required
  if (consoleResponse) {
    global.logger.info("sendSuccessResponse: ", {
      filePath: __filename,
      methodName: "sendSuccessResponse",
      response: response,
    });
  }

  return response;
};

export const handler = async (
  event: InvokeLambdaHandlerEventPayloadDto,
  context: Context,
): Promise<object> => {
  try {
    // Log the receipt of the event
    global.logger.info("App Invoke Lambda handler: Received event: ", {
      methodName: "handler",
      event,
      context,
    });

    const { eventType, data } = event;

    switch (eventType) {
      case InvokeLambdaHandlerEventTypeEnum.NEW_INTERNAL_JOB_CAND_MATCH: {
        const {
         companyId,
         jobId,
         jobDescription,
         jobTitle,
         companyName
        } = data as InvokeLambdaNewInternalJobCandMatchDto;
        const response: (boolean | boolean[])[][] = await candidateParsedCvServiceObj.processNewCompanyJobCandMatchCandidateParsedCv(
          jobId, companyId, jobDescription,
          jobTitle, companyName
        );
        break;
      }

      case InvokeLambdaHandlerEventTypeEnum.JOB_STATUS_CAND_JOB_RECOMMEND_ALERT_UPDATE: {
        const {
          jobId,
          jobStatusBeforeUpdate
        } = data as InvokeLambdaJobStatusCandJobRecommendAlertUpdateDto;
        const response = await candidateJobAlertServiceObj.performJobStatusCandJobRecommendAlertUpdate(
          jobStatusBeforeUpdate,
          jobId
        );
        break;
      }

      default: {
        throw new BaseError(
          `No invoked lambda event type found for: ${eventType}`,
        );
      }
    }

    // Return success response
    return sendSuccessResponse(
      HttpStatusCode.OK_200,
      `Invoked lambda processed successfully.`,
    );
  } catch (error: any) {
    global.logger.error("App invoked lambda handler [Error]: ", {
      methodName: "handler",
      error,
    });

    // Return error response
    return sendErrResponse(
      error,
      error?.errorMsg ??
        error?.message ??
        "An error occurred while processing the invoked lambda.",
    );
  }
};
