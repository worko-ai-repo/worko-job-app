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
}

export default CountCompanyController;