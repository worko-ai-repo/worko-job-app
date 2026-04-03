// Import npm packages
import { NextFunction, Request, Response } from "express";

// Import DTOs
import {
  JobApplicationInterviewCancelApiDto,
  JobApplicationInterviewCompleteApiDto,
  JobApplicationInterviewListFilterOptions,
  JobApplicationInterviewListFilterRequestDto,
  JobApplicationInterviewRescheduleApiDto,
  JobApplicationInterviewScheduleApiDto,
} from "../dtos/JobApplicationInterview.dto";

// Import helpers
import { GcpFirestoreRequestHelper } from "../helpers/request.gcp-firestore.helper";

// Import schemas
import {
  jobApplicationInterviewCancelValidation,
  jobApplicationInterviewCompleteValidation,
  jobApplicationInterviewFilterValidation,
  jobApplicationInterviewRescheduleValidation,
  jobApplicationInterviewScheduleValidation,
} from "../schemas/JobApplicationInterview.schema";

// Import services
import { jobApplicationInterviewServiceObj } from "../services/JobApplicationInterview.service";

// Import utils
import { RequestValidationError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * JobApplicationInterviewController
 *
 * Controller for interview scheduler APIs under job applications.
 */
class JobApplicationInterviewController {
  /**
   * scheduleUserApplicationInterview
   *
   * Schedule a new interview round for a job application.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  scheduleUserApplicationInterview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      global.logger.info("Schedule User Application Interview [Controller]", {
        methodName: this.scheduleUserApplicationInterview.name,
        reqParams: req.params,
      });

      const reqBody: JobApplicationInterviewScheduleApiDto = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        jobApplicationInterviewScheduleValidation.validate(reqBody, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const response =
        await jobApplicationInterviewServiceObj.scheduleUserApplicationInterview(
        req.params.applicationId,
        validatedRequestBody,
      );

      res.status(HttpStatusCode.CREATED_201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getScheduledUserApplicationInterviewsByApplicationId
   *
   * List interview rounds for a job application.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  getScheduledUserApplicationInterviewsByApplicationId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const filterOptions: JobApplicationInterviewListFilterOptions =
        GcpFirestoreRequestHelper.parseFilterOptions<
          JobApplicationInterviewListFilterRequestDto,
          JobApplicationInterviewListFilterOptions
        >(req.query as unknown as JobApplicationInterviewListFilterRequestDto);

      const { error: reqBodyError, value: validatedFilterOptions } =
        jobApplicationInterviewFilterValidation.validate(filterOptions, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const response =
        await jobApplicationInterviewServiceObj.getScheduledUserApplicationInterviewsByApplicationId(
          req.params.applicationId,
          validatedFilterOptions,
        );

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getScheduledUserApplicationInterviewById
   *
   * Fetch interview details by interviewId.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  getScheduledUserApplicationInterviewById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response =
        await jobApplicationInterviewServiceObj.getScheduledUserApplicationInterviewById(
          req.params.interviewId,
        );
      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * rescheduleUserApplicationInterview
   *
   * Reschedule a scheduled interview.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  rescheduleUserApplicationInterview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const reqBody: JobApplicationInterviewRescheduleApiDto = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        jobApplicationInterviewRescheduleValidation.validate(reqBody, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const response =
        await jobApplicationInterviewServiceObj.rescheduleUserApplicationInterview(
          req.params.applicationId,
          req.params.interviewId,
          validatedRequestBody,
        );

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * cancelUserApplicationInterview
   *
   * Cancel an interview round.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  cancelUserApplicationInterview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const reqBody: JobApplicationInterviewCancelApiDto = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        jobApplicationInterviewCancelValidation.validate(reqBody, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const response =
        await jobApplicationInterviewServiceObj.cancelUserApplicationInterview(
          req.params.applicationId,
          req.params.interviewId,
          validatedRequestBody,
        );

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * completeUserApplicationInterview
   *
   * Complete an interview and optionally request evaluator feedback
   * using existing evaluator rating APIs.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  completeUserApplicationInterview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const reqBody: JobApplicationInterviewCompleteApiDto = req.body;
      const { error: reqBodyError, value: validatedRequestBody } =
        jobApplicationInterviewCompleteValidation.validate(reqBody, {
          abortEarly: false,
        });

      if (reqBodyError) {
        throw new RequestValidationError(reqBodyError);
      }

      const response =
        await jobApplicationInterviewServiceObj.completeUserApplicationInterview(
          req.params.applicationId,
          req.params.interviewId,
          validatedRequestBody,
        );

      res.status(HttpStatusCode.OK_200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default JobApplicationInterviewController;

