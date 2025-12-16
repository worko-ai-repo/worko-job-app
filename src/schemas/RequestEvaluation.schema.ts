// Import the Joi library
import Joi from "joi";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import enums
import { RequestEvaluationDashboardTypeEnum } from "../enums/RequestEvaluation.enum";

// import schemas
import { commonSchema } from "../schemas/Common.schema";

// Define validation schema for creating request evaluation
export const requestEvaluationCreateValidation = Joi.object({
  jobApplicationId: Joi.string().required().messages({
    "any.required": "Job Application ID is required",
    "string.empty": "Job Application ID should not be empty",
    "string.base": "Job Application ID must be a string",
  }),

  jobId: Joi.string().required().messages({
    "any.required": "Job ID is required",
    "string.empty": "Job ID should not be empty",
    "string.base": "Job ID must be a string",
  }),

  jobTitle: Joi.string().required().lowercase().messages({
    "any.required": "Job title is required",
    "string.empty": "Job title should not be empty",
    "string.base": "Job title must be a string",
  }),

  companyId: Joi.string().required().messages({
    "any.required": "Company ID is required",
    "string.empty": "Company ID should not be empty",
    "string.base": "Company ID must be a string",
  }),

  applicantUserId: Joi.string().optional().messages({
    "string.base": "Applicant User ID must be a string",
  }),

  candidateParsedCvId: Joi.string().optional().messages({
    "string.base": "Candidate parsed CV ID must be a string",
  }),

  applicantName: Joi.string().required().lowercase().messages({
    "any.required": "Applicant name is required",
    "string.empty": "Applicant name should not be empty",
    "string.base": "Applicant name must be a string",
  }),

  applicantUserEmail: Joi.string().email().required().lowercase().messages({
    "any.required": "Applicant User Email is required",
    "string.email": "Please provide a valid email address",
    "string.empty": "Applicant User Email should not be empty",
    "string.base": "Applicant User Email must be a string",
  }),

  evaluatorDetails: Joi.object({
    name: Joi.string().required().lowercase().messages({
      "any.required": "Evaluator name is required",
      "string.empty": "Evaluator name should not be empty",
      "string.base": "Evaluator name must be a string",
    }),

    email: Joi.string().email().required().lowercase().messages({
      "any.required": "Evaluator email is required",
      "string.email": "Please provide a valid email address",
      "string.empty": "Evaluator email should not be empty",
    }),
  }).required().messages({
    "any.required": "Evaluator details are required",
    "object.base": "Evaluator details must be an object",
    "object.empty": "Evaluator details should not be empty",
  }),

  hrName: Joi.string().required().lowercase().messages({
    "any.required": "HR name is required",
    "string.empty": "HR name should not be empty",
    "string.base": "HR name must be a string",
  }),

  hrCurrentCompanyName: Joi.string().required().uppercase().messages({
    "any.required": "HR current company name is required",
    "string.empty": "HR current company name should not be empty",
    "string.base": "HR current company name must be a string",
  }),

  hrDetailedFeedback: Joi.string().required().messages({
    "any.required": "HR detailed feedback is required",
    "string.empty": "HR detailed feedback should not be empty",
    "string.base": "HR detailed feedback must be a string",
  }),

  hrHtmlDetailedFeedback: Joi.string().required().messages({
    "any.required": "HR HTML detailed feedback is required",
    "string.empty": "HR HTML detailed feedback should not be empty",
    "string.base": "HR HTML detailed feedback must be a string",
  })
});

// Define validation schema for bulk creating request evaluations
export const requestEvaluationBulkCreateValidation = Joi.object({
  requestEvaluations: Joi.array()
    .items(requestEvaluationCreateValidation)
    .min(APP_CONSTANTS.BULK_REQUEST_EVALUATION_CREATE_LIMIT.MIN)
    .max(APP_CONSTANTS.BULK_REQUEST_EVALUATION_CREATE_LIMIT.MAX)
    .required()
    .messages({
      "any.required": "Request evaluations array is required",
      "array.base": "Request evaluations must be an array",
      "array.empty": "Request evaluations array should not be empty",
      "array.min": "At least 1 request evaluation is required",
      "array.max": "Maximum 30 request evaluations are allowed",
    }),
});

// Define validation schema for filtering request evaluations
export const requestEvaluationFilterValidation = commonSchema.concat(
  Joi.object({
    evaluatorEmail: Joi
      .string()
      .email() 
      .optional()
      .allow("", null)
      .lowercase()
      .messages({
        "string.email": "Evaluator email must be a valid email address",
      }),

    jobApplicationId: Joi.string().optional().allow("", null).messages({
      "string.base": "Job Application ID must be a string",
    }),

    evaluationRequesterAdminUserId: Joi.string().optional().allow("", null).messages({
      "string.base": "Evaluation Requester Admin User ID must be a string",
    }),

    evaluationRequesterCorporateUserId: Joi.string().optional().allow("", null).messages({
      "string.base": "Evaluation Requester Corporate User ID must be a string",
    }),

    dashboardType: Joi.string().valid(...Object.values(RequestEvaluationDashboardTypeEnum)).optional().allow("", null).messages({
      "any.only": `Dashboard type must be one of: ${Object.values(RequestEvaluationDashboardTypeEnum).join(", ")}`,
    }),
  })
);