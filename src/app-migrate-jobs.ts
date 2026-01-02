// Import aws lambda related types
import { APIGatewayProxyResult, Context } from "aws-lambda";

// Import extensions (must be done after natural imports and before any scope-modifying imports)
import "./extensions/string.extension";
import "./extensions/array.extension";

// Import logger library
import "./libraries/logger.library";

// Import constant configs
import "./configs/aws-sdk.config";
import "./configs/gcp-sdk.config";
import DBConfig from "./db/DB.config";

// Import services
import { scriptServiceObj } from "./services/Script.service";

// Import utils
import HttpStatusCode from "./utils/http-codes.util";
import { responseHandlerUtilObj } from "./utils/response-handler.util";

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

export const handler = async (
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    global.logger.info("Migrate jobs handler: ");
    const result = await scriptServiceObj.scriptToMigrateOpenSearchToFirestore(
      event.reqPageSize,
      event.lastKey
    );
    global.logger.info("Migrate jobs handler: result: ", {
      methodName: "handler",
      result,
    });

    return responseHandlerUtilObj.sendSuccessResponseForInvokedLambda({
      statusCode: HttpStatusCode.OK_200,
      body: JSON.stringify(result),
    });
  } catch (error: any) {
    if (global.logger) {
      global.logger.error("Migrate jobs handler: error: ", { error });
    }
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
      body: JSON.stringify({ error: "Unknown error occurred" }),
    };
  }
};
