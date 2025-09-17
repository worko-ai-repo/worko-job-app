// Load the npm packages
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import serverless from "serverless-http";
import cors from "cors";

// Import extensions
import "./extensions/string.extension";
import "./extensions/array.extension";

// Import libraries
import "./libraries/logger.library";

// Import configs
import DBConfig from "./db/DB.config";
import APP_CONSTANTS from "./configs/constants.config";

// Import middlewares
import { getAuthorizerContext } from "./middlewares/authorizer-context.middleware";

// Import the routes
import routes from "./router";

// Import Utils
import { errorHandler } from "./utils/error-handler.util";
import HttpStatusCode from "./utils/http-codes.util";

class App {
  /**
   * app
   *
   * Express server object
   */
  public app: Express;

  /**
   * constructor
   *
   * To initialise the required propertise.
   */
  constructor() {
    // Create express server
    this.app = express();

    // Call the register methods to do their works
    this.initDatabaseConfig();
    this.registerMiddleWares();
    this.registerAppRoutes();
    this.registerErrorHandlingRoutes();

    // Logger message
    global.logger.info("Application is initialised successfully.", {
      filePath: __filename,
      methodName: this.constructor.name
    });
  }

  /**
   * initDatabaseConfig
   * 
   * Initialise the database configurations
   */
  initDatabaseConfig() {
    const dbConf: DBConfig = new DBConfig();
    dbConf.init();
  }

  /**
   * Register Middlewares
   *
   * This method registers the required middlewares to handle/customise the requests, responses, etc.
   */
  registerMiddleWares() {
    const origins: string[] = process.env.APP_STAGE === APP_CONSTANTS.STAGES.PROD ? APP_CONSTANTS.FRONTEND_ORIGINS.PROD : APP_CONSTANTS.FRONTEND_ORIGINS.DEV;
    this.app.use(cors({ origin: origins })); 
    this.app.use(express.json()); // 100 KB default limit
  }

  /**
   * Register Application Routes
   *
   * This method registers the application routes exposed outside by the application, to allow the users/clients to access the routes/resources.
   */
  registerAppRoutes() {
    this.app.use("/", getAuthorizerContext(), routes);
  }

  /**
   * Error Handling Routes
   *
   * This method registers the error handling routes like 404, exception handling, etc to the "express".
   */
  registerErrorHandlingRoutes() {
    // Route to handle the 404 Not Found error/exception
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      global.logger.error("The endpoint '%s' not found.", req.originalUrl, {
        filePath: __filename,
        methodName: this.registerErrorHandlingRoutes.name
      });
      res.status(HttpStatusCode.NOT_FOUND_404).send();
    });

   // Error-handling middleware
   const errorMiddleware: ErrorRequestHandler = async (
     err: any,
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     if (errorHandler.isTrustedError(err)) {
       const customResponse: Response | undefined = errorHandler.handleError(err, res);
       next(customResponse)
     }
     next(err); // Pass the error to Express's default error handler
   };

   // Register the error handling middleware
   this.app.use(errorMiddleware);

    // Handle error/exception on the "unhandledRejection" event
    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      errorHandler.handleError(error);
      if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
      }
    });

    /**
     * @todo The below 2 events stops the execustion of the application, 
     * investigate and let our handler handle the error and respond back to the user.
     */

    // Handle error/exception on the "uncaughtException" event
    process.on('uncaughtException', (error: Error) => {
      errorHandler.handleError(error);
      if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
      }
    });
  }
}

export const handler = serverless(new App().app, {
  request: function (req: any, event: APIGatewayProxyEvent, context: Context) {
    // Modify the request object with received "event" and "context" from the API Gateway, 
    // to make it accessible in the routes/controllers.
    req.lambdaEvent = event;
    req.lambdaContext = context;
  },
});
