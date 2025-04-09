// Import the Joi library
import Joi from "joi";

// import enums
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { UserType } from "../enums/User.enum";
import { AdminRoleEnum } from "../enums/Common.enum";

// import schemas
import { commonSchema } from "../schemas/Common.schema";

// Define validation schema for creating job application dto
export const UserCreateJobApplicationDTOValidation = Joi.object({
  jobId: Joi
   .string()
   .required()
   .messages({
    "any.required": "The jobId field is required.",
    "any.type": "The jobId field must be a string.",
    "string.empty": "The jobId field should not be empty.",
   }),

  companyName: Joi
   .string()
   .required()
   .messages({ 
    "any.required": "The companyName field is required.",
    "any.type": "The companyName field must be a string.",
    "string.empty": "The companyName field should not be empty.",
   }),

  jobPortal: Joi
   .string()
   .allow("")
   .optional()
   .messages({
    "any.type": "The jobPoratal field must be a string.",
   }),

   matchingScore: Joi
   .number()
   .integer()
   .optional()
   .messages({
    "any.type": "The matchingScore field must be a number."
   }),

   referAndEarnId: Joi
   .string()
   .optional()
   .messages({
    "any.type": "The referAndEarnId field must be a string.",
   })
});

// Define validation schema for filtering job application requests
export const userJobApplicationFilterDtoValidation = commonSchema.concat(
  Joi.object({
    status: Joi.string()
      .optional() // allow `undefined` value
      .allow(null, "")
      .valid(...Object.values(JobApplicationStatus))
      .messages({
        "any.only": `Invalid Job application status. Please provide a valid value from
      ${Object.values(JobApplicationStatus).join(", ")}.`,
      }),

    jobId: Joi.string().optional().allow("", null).messages({
      "any.type": "jobId must be a string",
    }),

    companyId: Joi.string().optional().allow("", null).messages({
      "any.type": "companyId must be a string",
    }),

    referAndEarnId: Joi
    .string()
    .optional()
    .messages({
      "any.type": "The referAndEarnId field must be a string.",
    }),

    userEmail: Joi.string().email().optional().allow("", null).messages({
      "string.email": "User email must be a valid email address.",
      "string.empty": "User email should not be empty.",
    }),

    userType: Joi.string()
      .required()
      .valid(
        ...Object.values(CorporateUserTypeEnum),
        ...Object.values(UserType),
        ...Object.values(AdminRoleEnum)
      )
      .messages({
        "any.only": `Invalid user type. Please provide a valid value from
      ${Object.values(CorporateUserTypeEnum).join(", ")}
      ${Object.values(UserType).join(", ")}
      ${Object.values(AdminRoleEnum).join(", ")}.`,
        "any.required": "User type is required",
        "string.empty": "User type should not be empty",
      }),
  })
); 

// Define validation schema for updating job application
export const userJobApplicationUpdateValidation = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),

  status: Joi.string()
    .valid(...Object.values(JobApplicationStatus))
    .required()
    .messages({
      "string.valid": `Status must be one of: ${Object.values(
        JobApplicationStatus
      ).join(", ")}`,
      "any.required": "Status is required",
      "string.empty": "Status should not be empty",
    }),

  emailId: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),

  // Additional fields for the Reject status
  reason: Joi.when("status", {
    is: JobApplicationStatus.REJECTED,
    then: Joi.string().required().messages({
      "any.required": "Reason is required for rejection",
    }),
    otherwise: Joi.optional().allow(""),
  }),

  userComment: Joi.string().allow("").optional(),

  userType: Joi.string()
    .required()
    .valid(...Object.values(CorporateUserTypeEnum), ...Object.values(AdminRoleEnum))
    .messages({
      "string.valid": `User type must be one of: ${Object.values(
        CorporateUserTypeEnum
      ).join(", ")}, ${Object.values(AdminRoleEnum).join(", ")}.`,
      "any.required": "User type is required",
      "string.empty": "User type should not be empty",
    }),
});

// Define validation schema for requesting job application
export const userJobApplicationRequestFeedbackValidation = Joi.object({
  applicationDate: Joi.string().isoDate().required().messages({
    "any.required": "Application date is required",
    "string.empty": "Application date should not be empty",
    "string.isoDate": "Application date must be a valid date in ISO format",
  }),
});