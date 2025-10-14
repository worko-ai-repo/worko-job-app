// Import from dynamoose
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import express types
import { NextFunction, Request, Response } from "express";

// Import enums
import { CountUserDbEntityTypeEnum } from "../enums/CountUser.enum";

// Import helpers
import { validateUserAccess } from "../helpers/user.helper";

// Import models
import { DbCountUserDto } from "../db/models/CountUser.model";

// Import services
import { countUserServiceObj } from "../services/CountUser.service";

// Import schemas
import { countUserGetByEntityTypeDtoValidation } from "../schemas/CountUser.schema";

// Import utils
import { BaseError, RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

class CountUserController {
  getCountUserByRegisteredEmailAndEntityType = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(
        "Get Count User By Registered Email And Entity Type [Controller]",
        {
          methodName: this.getCountUserByRegisteredEmailAndEntityType.name,
          requestParams: req.params,
        }
      );

      const registeredEmail: string = req.params.registeredEmail;
      const entityType: string = req.params.entityType;

      const { error: reqBodyError, value: reqBody } =
        countUserGetByEntityTypeDtoValidation.validate(
          {
            entityType
          },
          {
            abortEarly: false,
          }
        );
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      await validateUserAccess(registeredEmail);

      const countUserDetails: QueryResponse<DbCountUserDto> =
        await countUserServiceObj.getCountUserByRegisteredEmailAndEntityType(
          registeredEmail,
          entityType as CountUserDbEntityTypeEnum
        );

      if (!countUserDetails.count) {
        throw new BaseError(
          "Count User Details Not Found.",
          HttpStatusCode.NOT_FOUND_404
        );
      }

      res.status(HttpStatusCode.OK_200).json(countUserDetails[0]);
    } catch (error) {
      global.logger.error(
        "error in controller catch block [CountUserController]",
        {
          methodName: this.getCountUserByRegisteredEmailAndEntityType.name,
          error,
        }
      );

      next(error);
    }
  }
}

export default CountUserController;
