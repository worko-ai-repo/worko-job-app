// Load the npm packages
import { Request, Response, NextFunction } from "express";

// Import dynamoose packages
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// import dtos
import { EvaluatorDetailCreateApiDTO } from "../dtos/EvaluatorDetail.dto";

// import models
import { DbEvaluatorDetailDto } from "../db/models/EvaluatorDetail.model";

// import services
import { evaluatorDetailServiceObj } from "../services/EvaluatorDetail.service";

// import schemas
import { evaluatorDetailCreateApiDTOValidation } from "../schemas/EvaluatorDetail.schema";

// import utils
import HttpStatusCode from "../utils/http-codes.util";
import { BaseError, RequestValidationError } from "../utils/errors.util";

/**
 * EvaluatorDetailController
 *
 * Controller for handling evaluator detail-related operations
 */
class EvaluatorDetailController {
  /**
   * createEvaluatorDetail
   *
   * Controller for registering a new evaluator
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object used to send back the API response
   * @param {NextFunction} next - Express next function for error handling
   */
  createEvaluatorDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Create Evaluator Detail [Controller]`, {
        methodName: this.createEvaluatorDetail.name,
      });

      const reqBody: EvaluatorDetailCreateApiDTO = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        evaluatorDetailCreateApiDTOValidation.validate(reqBody, {
          abortEarly: false,
        });
      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const evaluatorDetailDetails: DbEvaluatorDetailDto =
        await evaluatorDetailServiceObj.createEvaluatorDetail(
          validatedRequestBody
        );

      res.status(HttpStatusCode.CREATED_201).json(evaluatorDetailDetails);
    } catch (error) {
      global.logger.error(
        `Error at catch block in Create Evaluator Detail [Controller]`,
        {
          error,
          methodName: this.createEvaluatorDetail.name,
        }
      );
      next(error);
    }
  };

  /**
   * getEvaluatorDetailById
   *
   * Controller for getting evaluator details by id
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object used to send back the API response
   * @param {NextFunction} next - Express next function for error handling
   */
  getEvaluatorDetailById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Get Evaluator Detail By Id [Controller]`, {
        methodName: this.getEvaluatorDetailById.name,
      });

      const evaluatorDetailId: string = req.params.id;
      const evaluatorDetailDetails: QueryResponse<DbEvaluatorDetailDto> =
        await evaluatorDetailServiceObj.getEvaluatorDetailById(
          evaluatorDetailId
        );
      
      if (!evaluatorDetailDetails.count) {
        throw new BaseError("Evaluator detail not found", HttpStatusCode.NOT_FOUND_404);
      }

      res.status(HttpStatusCode.OK_200).json(evaluatorDetailDetails[0]);
    } catch (error) {
      global.logger.error(
        `Error at catch block in Get Evaluator Detail By Id [Controller]`,
        {
          error,
          methodName: this.getEvaluatorDetailById.name,
        }
      );
      next(error);
    }
  };

  /**
   * getEvaluatorDetailByEmail
   *
   * Controller for getting evaluator details by email id
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object used to send back the API response
   * @param {NextFunction} next - Express next function for error handling
   */
  getEvaluatorDetailByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Get Evaluator Detail By Email Id [Controller]`, {
        methodName: this.getEvaluatorDetailByEmail.name,
      });

      const evaluatorDetailEmailId: string = req.params.emailId;
      const evaluatorDetailDetails: QueryResponse<DbEvaluatorDetailDto> =
        await evaluatorDetailServiceObj.getEvaluatorDetailByEmail(
          evaluatorDetailEmailId
        );
      
      if (!evaluatorDetailDetails.count) {
        throw new BaseError("Evaluator detail not found", HttpStatusCode.NOT_FOUND_404);
      }

      res.status(HttpStatusCode.OK_200).json(evaluatorDetailDetails[0]);
    } catch (error) {
      global.logger.error(
        `Error at catch block in Get Evaluator Detail By Email Id [Controller]`,
        {
          error,
          methodName: this.getEvaluatorDetailByEmail.name,
        }
      );
      next(error);
    }
  };
}

export default EvaluatorDetailController;