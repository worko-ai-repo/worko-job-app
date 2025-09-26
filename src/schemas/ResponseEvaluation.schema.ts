// Import the Joi library
import Joi from "joi";

// import enums
import { ResponseEvaluationStatusEnum } from "../enums/ResponseEvaluation.enum";

// import schemas
import { commonSchema } from "../schemas/Common.schema";

// Define validation schema for creating response evaluation
export const responseEvaluationCreateValidation = Joi.object({
  createdByUserEmail: Joi.string().email().required().lowercase().messages({
    "any.required": "Created By User Email is required",
    "string.empty": "Created By User Email should not be empty",
    "string.email": "Created By User Email must be a valid email address",
  }),

  evaluationRequesterUserId: Joi.string().optional().messages({
    "string.base": "Evaluation Requester User ID must be a string",
  }),

  evaluationRequesterCorporateUserId: Joi.string().optional().messages({
    "string.base": "Evaluation Requester Corporate User ID must be a string",
  }),

  evaluationRequestId: Joi.string().required().messages({
    "any.required": "Evaluation Request ID is required",
    "string.empty": "Evaluation Request ID should not be empty",
  }),

  evaluatorName: Joi.string().required().lowercase().messages({
    "any.required": "Evaluator Name is required",
    "string.empty": "Evaluator Name should not be empty",
  }),

  jobApplicationId: Joi.string().required().messages({
    "any.required": "Job Application ID is required",
    "string.empty": "Job Application ID should not be empty",
  }),

  jobId: Joi.string().required().messages({
    "any.required": "Job ID is required",
    "string.empty": "Job ID should not be empty",
  }),

  companyId: Joi.string().required().messages({
    "any.required": "Company ID is required",
    "string.empty": "Company ID should not be empty",
  }),

  applicantUserId: Joi.string().required().messages({
    "any.required": "Applicant User ID is required",
    "string.empty": "Applicant User ID should not be empty",
  }),

  applicantUserEmail: Joi.string().email().required().lowercase().messages({
    "any.required": "Applicant User Email is required",
    "string.empty": "Applicant User Email should not be empty",
    "string.email": "Applicant User Email must be a valid email address",
  }),

  scheduledInterviewDetails: Joi.array()
    .items(
      Joi.object({
        timeSlot: Joi.string().required().messages({
          "any.required": "Time Slot is required",
          "string.empty": "Time Slot should not be empty",
        }),

        availability: Joi.number().required().messages({
          "any.required": "Availability is required",
          "number.empty": "Availability should not be empty",
        }),

        date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
          "any.required": "Date is required",
          "string.empty": "Date should not be empty",
          "string.pattern.base": "Date must be in YYYY-MM-DD format",
        }),

        startTime: Joi.string().required().messages({
          "any.required": "Start Time is required",
          "string.empty": "Start Time should not be empty",
        }),

        endTime: Joi.string().required().messages({
          "any.required": "End Time is required",
          "string.empty": "End Time should not be empty",
        }),

        actionDate: Joi.string().isoDate().required().messages({
          "any.required": "Action Date is required",
          "string.empty": "Action Date should not be empty",
          "string.isoDate": "Action Date must be a valid ISO 8601 date",
        }),
      })
    )
    .optional()
    .messages({
      "any.type": "Scheduled Interview Details must be an array",
    }),

  status: Joi.string()
    .valid(...Object.values(ResponseEvaluationStatusEnum))
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${Object.values(
        ResponseEvaluationStatusEnum
      ).join(", ")}`,
    }),

  score: Joi.number().required().messages({
    "any.required": "Score is required",
    "number.empty": "Score should not be empty",
  }),

  detailedFeedback: Joi.string().required().messages({
    "any.required": "Detailed Feedback is required",
    "string.empty": "Detailed Feedback should not be empty",
  }),

  htmlDetailedFeedback: Joi.string().required().messages({
    "any.required": "HTML Detailed Feedback is required",
    "string.empty": "HTML Detailed Feedback should not be empty",
  }),

  reason: Joi.string().optional().messages({
    "string.base": "Reason must be a string",
  }),

  comment: Joi.string().optional().messages({
    "string.base": "Comment must be a string",
  }),

  htmlComment: Joi.string().optional().messages({
    "string.base": "HTML comment must be a string",
  }),
});

// Define validation schema for filtering response evaluations
export const responseEvaluationFilterValidation = commonSchema.concat(
  Joi.object({
    evaluatorEmail: Joi.string().email().optional().allow(null, "").lowercase().messages({
      "string.email": "Evaluator email must be a valid email address",
    }),

    jobApplicationId: Joi.string().optional().allow(null, "").messages({
      "string.base": "Job Application ID must be a string",
    }),

    evaluatorRequesterUserId: Joi.string().optional().allow(null, "").messages({
      "string.base": "Evaluator Requester User ID must be a string",
    }),

    evaluatorRequesterCorporateUserId: Joi.string().optional().allow(null, "").messages({
      "string.base": "Evaluator Requester Corporate User ID must be a string",
    }),

    status: Joi.string()
      .valid(...Object.values(ResponseEvaluationStatusEnum))
      .optional()
      .allow(null, "")
      .messages({
        "any.only": `Status must be one of: ${Object.values(
          ResponseEvaluationStatusEnum
        ).join(", ")}`,
      }),
  })
);