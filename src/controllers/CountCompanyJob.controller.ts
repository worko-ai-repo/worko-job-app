// Import from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import express types
import { NextFunction, Request, Response } from "express";

// Import enums
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

// Import models
import { DbCountCompanyJobDto } from "../db/models/CountCompanyJob.model";

// Import services
import { countCompanyJobServiceObj } from "../services/CountCompanyJob.service";

// Import schemas
import { countCompanyJobGetByEntityTypeDtoValidation } from "../schemas/CountCompanyJob.schema";

// Import utils
import { BaseError, RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CountCompanyJobController {
  getCountCompanyJobByCompanyIdJobIdAndEntityType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        "Get Count CompanyJob By Company Id, Job Id And Entity Type [Controller]",
        {
          methodName: this.getCountCompanyJobByCompanyIdJobIdAndEntityType.name,
        }
      );

      const entityType: string = req.params.entityType;
      const jobId: string = req.params.jobId;
      const companyId: string = req.params.companyId;

      const { error: reqBodyError, value: reqBody } =
        countCompanyJobGetByEntityTypeDtoValidation.validate(
          {
            entityType,
          },
          {
            abortEarly: false,
          }
        );
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const countCompanyJobDetails: QueryResponse<DbCountCompanyJobDto> =
        await countCompanyJobServiceObj.validateAndGetCountCompanyJobByCompanyIdJobIdAndEntityType(
          companyId,
          jobId,
          entityType as CountCompanyJobDbEntityTypeEnum
        );

      if (!countCompanyJobDetails.count) {
        throw new BaseError(
          "Count CompanyJob Details Not Found.",
          HttpStatusCode.NOT_FOUND_404
        );
      }

      res.status(HttpStatusCode.OK_200).json(countCompanyJobDetails[0]);
    } catch (error) {
      global.logger.error("error in controller catch block", {
        methodName: this.getCountCompanyJobByCompanyIdJobIdAndEntityType.name,
        error,
      });

      next(error);
    }
  };
}

export default CountCompanyJobController;
