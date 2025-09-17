// Import the installed packages
import { Logger } from "winston";

// import DTOs
import { RequestLocalContextDto } from "./src/dtos/Common.dto";

/**
 * global
 *
 * Global declaration, it helps to access the mentioned properties globally in the application.
 */
declare global {
  // Winston Logger
  var logger: Logger;

  // Application/project root directory
  // It is also helpful in accessing the resources with absolute path
  var appRootDir: string;

  /**
   * RequestLocalContextDto
   *
   *
   * This `RequestLocalContextDto` object  can be accessed globally in the application
   * This was set from the authorizer context i.e. from `authorizer-context.middleware.ts`,
   * This would be used in the backend to perform api security.
   */
  var requestLocalContext: RequestLocalContextDto;
}

export {};
