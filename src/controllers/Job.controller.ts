// Import express packages
import { Request, Response, NextFunction } from 'express';

// Import dtos
import { AwsOpensearchRecordListingResponseDTO } from '../dtos/Common.aws-opensearch.dto';
import { JobBulkUpdateApiDto, JobBulkUpdateResponseDto, JobCreateApiDto, JobCreateDto, JobListingFilterOptions, JobListingFilterRequestDTO, JobSoftDeleteApiDto, JobUpdateApiDto, JobUpdateDto, ParsedJobDescriptionApiDto, ParsedJobDescriptionResponseDto } from '../dtos/Job.dto';
import { AwsS3VectorJobMatchingScoreDto } from "../dtos/AwsS3VectorJob.dto";

// Import helpers
import { getActionByUserId } from "../helpers/user.helper";
import { AwsOpensearchRequestHelper } from '../helpers/request.aws-opensearch.helper';

// Import models
import { DbCompanyJobDto } from '../db/models/CompanyJob.model';
import { DbJobAwsOpensearchDto } from '../db/OpenSearch-models/OpenSearchJob.model';

// Import services
import { jobServiceObj } from '../services/Job.service';

// Import schemas
import { jobBulkUpdateApiDtoValidation, jobCreateApiDtoValidation, jobFilterDtoValidation, jobSoftDeleteApiDtoValidation, jobUpdateApiDtoValidation, parsedJobDescriptionApiDtoValidation } from '../schemas/Job.schema';

// Import types
import { JobsWithAndWithoutCompanyDetails } from '../types/Job.type';

// Import utils
import { BaseError, RequestValidationError } from '../utils/errors.util';
import HttpStatusCode from '../utils/http-codes.util';

/**
 * JobController
 * 
 * This class is used to create, read, update, delete and search jobs.
 */
class JobController {
  /**
   * createJob
   *
   * This method is used to create job in aws opensearch
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Create Job [Controller]`, {
        filePath: __filename,
        methodName: this.createJob.name,
      });

      // Store the request body according to the dto.
      const requestBody: JobCreateApiDto = req.body;

      // Validate the user input and throw a validation error if necessary using the Joi schema
      const { error, value: validatedJobRequestBody } =
        jobCreateApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (error) {
        // Throw the validation error with details
        throw new RequestValidationError(error);
      }

      // Get actionByUserId and actionByCorporateUserId using the helper function
      const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

      // Create ResponseDTO
      const jobCreateDto: JobCreateDto = {
        ...validatedJobRequestBody,
        createdByUserId: actionByUserId,
        createdByCorporateUserId: actionByCorporateUserId,
      };

      // Call the service to create the job
      const jobDetails: DbCompanyJobDto = await jobServiceObj.createJob(
        jobCreateDto
      );

      // send response with job details
      res.status(HttpStatusCode.CREATED_201).json(jobDetails);
    } catch (error) {
      // Pass the error to Express's default error handler
      next(error);
    }
  };

  /**
   * parseJobDescription
   * 
   * This method is used to parse job description.
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  parseJobDescription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Global Logger for the Parse Job Description Controller
      global.logger.info("Parsing Job Description. [controller]", {
        filePath: __filename,
        methodName: this.parseJobDescription.name,
      });

      // read the request body
      const requestBody: ParsedJobDescriptionApiDto = req.body;

      // Validate the user input and throw a validation error if it is not valid
      const { error, value: validatedRequestBody } =
        parsedJobDescriptionApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (error) {
        // Throw the validation error with details
        throw new RequestValidationError(error);
      }

      // Parse the job description using the service.[Service Call]
      const parsedJobDescription: ParsedJobDescriptionResponseDto =
        await jobServiceObj.parseJobDescription(validatedRequestBody);

      res.status(HttpStatusCode.OK_200).json(parsedJobDescription);
    } catch (error) {
      // Handle errors by passing the error message to the next middleware
      next(error);
    }
  };

  /**
   * getAllJobsByFilterOptions
   *
   * This method is used to get all jobs by filter options from aws opensearch
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  getAllJobsByFilterOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Get All Jobs By Filter Options [Controller]`, {
        filePath: __filename,
        methodName: this.getAllJobsByFilterOptions.name,
      });
      
      const jobListingFilterRequest: JobListingFilterOptions =
        AwsOpensearchRequestHelper.parseFilterOptions<
          JobListingFilterRequestDTO,
          JobListingFilterOptions
        >(req.query as unknown as JobListingFilterRequestDTO);

      // Validate the request using the appropriate schema
      let { error, value: jobFilterOptions } = jobFilterDtoValidation.validate(
        jobListingFilterRequest,
        { abortEarly: false }
      );
      if (error) {
        throw new RequestValidationError(error);
      }

      // Get all jobs by filter options
      const jobDetails: AwsOpensearchRecordListingResponseDTO<JobsWithAndWithoutCompanyDetails> =
        await jobServiceObj.getAllJobsByDashboardFilterOptions(jobFilterOptions);

      // Respond with job details
      res.status(HttpStatusCode.OK_200).json(jobDetails);
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateInternalOrExternalJobById
   *
   * This method is used to update job.
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  updateInternalOrExternalJobById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      global.logger.info(`Update job by id [Controller]`, {
        filePath: __filename,
        methodName: this.updateInternalOrExternalJobById.name,
        requestBody: req.body,
      });

      // Extract the Job ID from the request parameters
      const jobId: string = req.params.id;

      // Extract the updated Job data from the request body
      const requestBody: JobUpdateApiDto = req.body;

      // Validate the user input
      const { error, value: validatedJobRequestBody } =
        jobUpdateApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (error) {
        throw new RequestValidationError(error);
      }

      // Get actionByUserId and actionByCorporateUserId using the helper function
      const { actionByUserId, actionByCorporateUserId } = getActionByUserId();

      let jobUpdateDto: JobUpdateDto = {
          ...validatedJobRequestBody,
          updatedByUserId: actionByUserId,
          updatedByCorporateUserId: actionByCorporateUserId,
        };

      const jobDetails: DbJobAwsOpensearchDto | undefined = await jobServiceObj.updateInternalOrExternalJobById(
        jobId,
        jobUpdateDto
      );

      res.status(HttpStatusCode.OK_200).json(jobDetails ?? {});
    } catch (error) {
      next(error);
    }
  };

  /**
   * softDeleteJobById
   *
   * Soft Deletes a job by its ID.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   */
  softDeleteJobById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract the Job ID from the request parameters
      const { jobId } = req.params;

      // Extract the updated Job data from the request body
      const requestBody: JobSoftDeleteApiDto = req.body;

      // Global Logger for the Delete Job Controller
      global.logger.info("Deleting Job. [controller]", {
        filePath: __filename,
        methodName: this.softDeleteJobById.name,
        requestBody,
        jobId,
      });

      // Validate the user input
      const { error, value: validatedJobRequestBody } =
        jobSoftDeleteApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (error) {
        throw new RequestValidationError(error);
      }

      // Call the service to update the Job
      const updatedJob: DbCompanyJobDto = await jobServiceObj.softDeleteJobById(
        jobId,
        validatedJobRequestBody.companyId,
        validatedJobRequestBody
      );

      res.status(HttpStatusCode.OK_200).json(updatedJob);
    } catch (error) {
      // Handle errors by passing the error message to the next middleware
      next(error);
    }
  };

  /**
   * getJobById
   *
   * This method is used to get job from aws opensearch
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve id from path parameters
      const { id } = req.params;

      global.logger.info(`Get document by id`, {
        methodName: this.getJobById.name,
        id: id,
      });

      const jobDetails: DbJobAwsOpensearchDto | undefined =
        await jobServiceObj.getJobByIdFromAwsOpensearch(id);

      res.status(HttpStatusCode.OK_200).json(jobDetails ?? {});
    } catch (error) {
      next(error);
    }
  };

  getJobByIdFromS3Vector = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve id from path parameters
      const { id } = req.params;

      const cognitoUserId: string = global.requestLocalContext.userId;
      if(!cognitoUserId){
        global.logger.error(`User not logged in`, {
          methodName: this.getJobByIdFromS3Vector.name,
          id: id,
          userId: cognitoUserId
        });
        throw new BaseError("Please log in to access this resource", HttpStatusCode.UNAUTHORIZED_401);
      }

      const jobListingFilterRequest: JobListingFilterOptions =
        AwsOpensearchRequestHelper.parseFilterOptions<
          JobListingFilterRequestDTO,
          JobListingFilterOptions
        >(req.query as unknown as JobListingFilterRequestDTO);

      // Validate the request using the appropriate schema
      let { error, value: jobFilterOptions } = jobFilterDtoValidation.validate(
        jobListingFilterRequest,
        { abortEarly: false }
      );
      if (error) {
        throw new RequestValidationError(error);
      }

      const jobDetails: DbJobAwsOpensearchDto & {
        initialMatchingScoreDetails?: AwsS3VectorJobMatchingScoreDto;
      } = await jobServiceObj.getJobByIdFromS3Vector(id, jobFilterOptions);

      res.status(HttpStatusCode.OK_200).json(jobDetails ?? {});
    } catch (error) {
      global.logger.error(`Error in catch block of getJobByIdFromS3Vector [Controller]`, {
        methodName: this.getJobByIdFromS3Vector.name,
        error: error
      })
      next(error);
    }
  };

  /**
   * updateBulkJob
   *
   * This method is used to bulk update job from "aws opensearch" and "aws dynamodb"
   *
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function in the middleware chain
   */
  updateBulkJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      global.logger.info(`Bulk Update Job [Controller]`, {
        methodName: this.updateBulkJob.name,
        requestBody: req.body,
      });

      const requestBody: JobBulkUpdateApiDto = req.body;

      const { error: jobBulkUpdateApiDtoError, value: validatedJobRequestBody } =
        jobBulkUpdateApiDtoValidation.validate(requestBody, {
          abortEarly: false,
        });
      if (jobBulkUpdateApiDtoError) {
        throw new RequestValidationError(jobBulkUpdateApiDtoError);
      }

      const updatedJobs: JobBulkUpdateResponseDto = await jobServiceObj.updateBulkJob(validatedJobRequestBody);

      global.logger.info(`Bulk Update Job Result [Controller]`, {
        methodName: this.updateBulkJob.name,
        updatedJobs: updatedJobs,
      });

      res.status(HttpStatusCode.OK_200).json(updatedJobs);
    } catch (error) {
      global.logger.error(`Bulk Update Job Error at Catch Block [Controller]`, {
        methodName: this.updateBulkJob.name,
        error: error,
      });
      next(error);
    }
  };
}

export default JobController;