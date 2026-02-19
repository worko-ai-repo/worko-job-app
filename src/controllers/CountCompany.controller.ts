// Import from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import express types
import { NextFunction, Request, Response } from "express";

// Import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";

// Import models
import { DbCountCompanyDto } from "../db/models/CountCompany.model";

// Import services
import { countCompanyServiceObj } from "../services/CountCompany.service";

// Import schemas
import { countCompanyGetByEntityTypeDtoValidation } from "../schemas/CountCompany.schema";

// Import utils
import { BaseError, RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";
import APP_CONSTANTS from "../configs/constants.config";

class CountCompanyController {
  /**
   * getCountCompanyByCompanyIdAndEntityType
   *
   * Get count company details by company id and entity type.
   * This method retrieves counts for a specific entity type (e.g., JOB_APPLICATION, COMPANY_JOB).
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  getCountCompanyByCompanyIdAndEntityType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        "Get Count Company By Company Id And Entity Type [Controller]",
        {
          methodName: this.getCountCompanyByCompanyIdAndEntityType.name,
        }
      );

      const entityType: string = req.params.entityType;
      const companyId: string = req.params.companyId;

      const { error: reqBodyError, value: reqBody } =
        countCompanyGetByEntityTypeDtoValidation.validate(
          {
            entityType,
          },
          {
            abortEarly: false,
          }
        );
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      };

      const countCompanyDetails: QueryResponse<DbCountCompanyDto> =
        await countCompanyServiceObj.validateAndGetCountCompanyByCompanyIdAndEntityType(
          companyId,
          entityType as CountCompanyDbEntityTypeEnum
        );

      if (!countCompanyDetails.count) {
        throw new BaseError(
          "Count Company Details Not Found.",
          HttpStatusCode.NOT_FOUND_404
        );
      }

      res.status(HttpStatusCode.OK_200).json(countCompanyDetails[0]);
    } catch (error) {
      global.logger.error("error in controller catch block", {
        methodName: this.getCountCompanyByCompanyIdAndEntityType.name,
        error,
      });

      next(error);
    }
  };

  /**
   * getCompanyJobStatusCounts
   *
   * Get company job status counts (published, closed, archived, draft).
   * This method retrieves the counts for all job statuses for a specific company.
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  getCompanyJobStatusCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info("Get Company Job Status Counts [Controller]", {
        methodName: this.getCompanyJobStatusCounts.name,
      });

      const companyId: string = req.params.companyId;

      const countCompanyDetails: QueryResponse<DbCountCompanyDto> =
        await countCompanyServiceObj.validateAndGetCountCompanyByCompanyIdAndEntityType(
          companyId,
          CountCompanyDbEntityTypeEnum.COMPANY_JOB
        );

      if (!countCompanyDetails.count) {
        // If no counts exist, return default counts (all zeros)
        global.logger.info("Count Company Details Not Found, returning default counts", {
          methodName: this.getCompanyJobStatusCounts.name,
          companyId,
        });

        res.status(HttpStatusCode.OK_200).json({
          companyId,
          entityType: CountCompanyDbEntityTypeEnum.COMPANY_JOB,
          allCompanyJobStatusCounts: {
            published: 0,
            closed: 0,
            archived: 0,
            draft: 0,
          },
        });
        return;
      }

      res.status(HttpStatusCode.OK_200).json(countCompanyDetails[0]);
    } catch (error) {
      global.logger.error("error in controller catch block", {
        methodName: this.getCompanyJobStatusCounts.name,
        error,
      });

      next(error);
    }
  };
}

export default CountCompanyController;
