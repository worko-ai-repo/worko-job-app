// Import npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose types
import { ObjectType } from "dynamoose/dist/General";

// Import Services
import { scriptServiceObj } from "../services/Script.service";
import InvokeLambdaService from "../services/InvokeLambda.service";

// Import local utils
import HttpStatusCode from "../utils/http-codes.util";
import ErrorCodeName from "../utils/error-code-name.util";

/**
 * ScriptController
 *
 * Controller for handling script-related operations related to updating GSI attributes.
 */
class ScriptController {
  /**
   * scriptSampleEntityTest
   *
   * To test sample entity
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptSampleEntityTest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Script for sample entity test [Script Controller]`,
        {
          methodName: this.scriptSampleEntityTest.name,
        }
      );

      const response =
        await scriptServiceObj.scriptSampleEntityTest();

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while testing sample entity. [Script Controller]`,
        {
          error,
        }
      );

      // Pass the error to the next middleware for error handling
      next(error);
    }
  };

  /**
   * scriptWorkoDdbToWorkoJobsOpensearch
   *
   * To transfer data from worko-ddb to worko-jobs-opensearch
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptWorkoDdbToWorkoJobsOpensearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // log
      global.logger.info(
        `Script to transfer data from worko-ddb to worko-jobs-opensearch [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptWorkoDdbToWorkoJobsOpensearch.name,
        }
      );

      const jobsWithCompanyDetails = await scriptServiceObj.retrieveJobsAndAttachCompanyDetails();

      // transfer data from worko-ddb to worko-jobs-opensearch
      const transferDataFromWorkoDdbToWorkoJobsOpensearchDetails: boolean =
        await scriptServiceObj.scriptWorkoDdbToWorkoJobsOpensearch(jobsWithCompanyDetails);
      global.logger.info(
        `Transfer data from worko-ddb to worko-jobs-opensearch details: ${transferDataFromWorkoDdbToWorkoJobsOpensearchDetails}`
      );

      res.status(HttpStatusCode.OK_200).json({
        message: `Transfer data from worko-ddb to worko-jobs-opensearch response: ${transferDataFromWorkoDdbToWorkoJobsOpensearchDetails}`,
      });
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while transfer data from worko-ddb to worko-jobs-opensearch. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  /**
   * scriptInternalJobsWorkoDdbToWorkoJobAppDdb
   *
   * To transfer internal jobs from worko-ddb to worko-job-app-ddb
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptInternalJobsWorkoDdbToWorkoJobAppDdb = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // log
      global.logger.info(
        `Script to transfer internal jobs from worko-ddb to worko-job-app-ddb [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptWorkoDdbToWorkoJobsOpensearch.name,
        }
      );

      // transfer internal jobs from worko-ddb to worko-job-app-ddb
      const transferInternalJobsFromWorkoDdbToWorkoJobAppDdbDetails =
        await scriptServiceObj.scriptInternalJobsWorkoDdbToWorkoJobAppDdb(
          req.body
        );
      global.logger.info(
        `transfer internal jobs from worko-ddb to worko-job-app-ddb details: `,
        {
          transferInternalJobsFromWorkoDdbToWorkoJobAppDdbDetails,
        }
      );

      res
        .status(HttpStatusCode.OK_200)
        .json(transferInternalJobsFromWorkoDdbToWorkoJobAppDdbDetails);
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while transfer internal jobs from worko-ddb to worko-job-app-ddb. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  /**
   * scriptInternalJobsWorkoDdbToWorkoJobAppDdb
   *
   * To transfer internal user job applications from worko-ddb to worko-job-app-ddb
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptInternalUserJobApplicationsWorkoDdbToWorkoJobAppDdb = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // log
      global.logger.info(
        `Script to transfer internal user job applications from worko-ddb to worko-job-app-ddb [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptWorkoDdbToWorkoJobsOpensearch.name,
        }
      );

      // transfer internal user job applications from worko-ddb to worko-job-app-ddb
      const transferInternalUserJobApplicationsFromWorkoDdbToWorkoJobAppDdbDetails: ObjectType[] =
        await scriptServiceObj.scriptInternalUserJobApplicationsWorkoDdbToWorkoJobAppDdb(
          req.body
        );
      global.logger.info(
        `transfer internal user job applications from worko-ddb to worko-job-app-ddb details: `,
        {
          transferInternalUserJobApplicationsFromWorkoDdbToWorkoJobAppDdbDetails,
        }
      );

      res
        .status(HttpStatusCode.OK_200)
        .json(
          transferInternalUserJobApplicationsFromWorkoDdbToWorkoJobAppDdbDetails
        );
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while transfer internal user job applications from worko-ddb to worko-job-app-ddb. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  /**
   * scriptGetAwsScheduleById
   * 
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptGetAwsScheduleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // log
      global.logger.info(
        `Script get aws schedule by id [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptGetAwsScheduleById.name,
        }
      );

      // Script get aws schedule by id 
      const scheduleDetails = await scriptServiceObj.scriptGetAwsScheduleById(
        req.params.id
      );

      res
        .status(HttpStatusCode.OK_200)
        .json(
          scheduleDetails
        );
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while get aws shchedule by id. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  /**
   * scriptDeleteAwsScheduleById
   * 
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptDeleteAwsScheduleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // log
      global.logger.info(
        `Script delete aws schedule by id [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptDeleteAwsScheduleById.name,
        }
      );

      // Script delete aws schedule by id 
      const scheduleDetails = await scriptServiceObj.scriptDeleteAwsScheduleById(
        req.params.id
      );

      res
        .status(HttpStatusCode.OK_200)
        .json(
          scheduleDetails
        );
    } catch (error: any) {
      global.logger.debug(
        `Error at catch block in while delete aws shchedule by id. [Script Controller]`,
        {
          error,
        }
      );

      if(error?.code === ErrorCodeName.RESOURCE_NOT_FOUND_EXCEPTION && error.statusCode === HttpStatusCode.NOT_FOUND_404) {
        global.logger.error(`Schedule Not found to delete.`)
        res.status(HttpStatusCode.FORBIDDEN_403).json(
          {
            "errorCode": HttpStatusCode.FORBIDDEN_403,
            "errorMsg": "You can only send to corporates before specified hours.",
          }
        )
      }
      next(error);
    }
  };

  /**
   * scriptToUploadBatchInferenceFilesToS3
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptToUploadBatchInferenceFilesToS3 = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Script to upload batch inference files to S3 [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptToUploadBatchInferenceFilesToS3.name,
        }
      );

      const uploadBatchInferenceFilesToS3Details: boolean = await scriptServiceObj.scriptToUploadBatchInferenceFilesToS3();
      global.logger.info(
        `Upload batch inference files to S3 details: ${uploadBatchInferenceFilesToS3Details}`
      );

      res.status(HttpStatusCode.OK_200).json({
        message: `Upload batch inference files to S3 response: ${uploadBatchInferenceFilesToS3Details}`,
      });
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while upload batch inference files to S3. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  /**
   * scriptToRevertInternalJobsToOpensearch
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptToRevertInternalJobsToOpensearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Script to revert internal jobs to opensearch [Script Controller]`,
        {
          filePath: __filename,
          methodName: this.scriptToRevertInternalJobsToOpensearch.name,
        }
      );

      const revertInternalJobsToOpensearchDetails: boolean = await scriptServiceObj.scriptToRevertInternalJobsToOpensearch();

      res
        .status(HttpStatusCode.OK_200)
        .json(revertInternalJobsToOpensearchDetails);
    } catch (error) {
      global.logger.debug(
        `Error at catch block in while Revert internal jobs to opensearch. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  /**
   * scriptToAddGsi3ToJobApplications
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  scriptToAddGsi3ToJobApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Script to add gsi3 to job applications [Script Controller]`,
        {
          methodName: this.scriptToAddGsi3ToJobApplications.name,
        }
      );

      const addGsi3ToJobApplicationsDetails: { totalUpdatedCount: number } = await scriptServiceObj.scriptToAddGsi3ToJobApplications();

      res
        .status(HttpStatusCode.OK_200)
        .json(addGsi3ToJobApplicationsDetails);
    } catch (error) {
      global.logger.error(
        `Error at catch block in while add gsi3 to job applications. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };

  scriptMigrateJobsAwsOpensearchToGcpFirestore = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        `Script to migrate jobs aws opensearch to gcp firestore [Script Controller]`,
        {
          methodName: this.scriptMigrateJobsAwsOpensearchToGcpFirestore.name,
        }
      );
      const result = await InvokeLambdaService.triggerLambdaToMigrateJobsAwsOpensearchToGcpFirestore(
        req.body.reqPageSize,
        req.body?.lastKey
      );
      res.status(HttpStatusCode.ACCEPTED_202).json(result);
    } catch (error) {
      global.logger.error(
        `Error at catch block in while migrate jobs aws opensearch to gcp firestore. [Script Controller]`,
        {
          error,
        }
      );
      next(error);
    }
  };
}

export default ScriptController;
