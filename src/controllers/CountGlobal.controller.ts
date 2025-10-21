// Import from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import express types
import { NextFunction, Request, Response } from "express";

// Import enums
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";

// Import models
import { DbCountGlobalDto } from "../db/models/CountGlobal.model";

// Import services
import { countGlobalServiceObj } from "../services/CountGlobal.service";

// Import schemas
import { countGlobalGetByEntityTypeDtoValidation } from "../schemas/CountGlobal.schema";

// Import utils
import { BaseError, RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CountGlobalController {
  getCountGlobalByEntityType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        "Get Count Global By Entity Type [Controller]",
        {
          methodName: this.getCountGlobalByEntityType.name,
        }
      );

      const entityType: string = req.params.entityType;

      const { error: reqBodyError, value: reqBody } =
        countGlobalGetByEntityTypeDtoValidation.validate(
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

      const countGlobalDetails: QueryResponse<DbCountGlobalDto> =
        await countGlobalServiceObj.getCountGlobalByEntityType(
          entityType as CountGlobalDbEntityTypeEnum
        );

      if (!countGlobalDetails.count) {
        throw new BaseError(
          "Count Global Details Not Found.",
          HttpStatusCode.NOT_FOUND_404
        );
      }

      res.status(HttpStatusCode.OK_200).json(countGlobalDetails[0]);
    } catch (error) {
      global.logger.error(
        "error in controller catch block [CountGlobalController]",
        {
          methodName: this.getCountGlobalByEntityType.name,
          error,
        }
      );

      next(error);
    }
  };
}

export default CountGlobalController;
