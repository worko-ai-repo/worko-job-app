// Import the Joi library
import Joi from "joi";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// import enums
import { JobApplicationStatus, JobApplicationValidBulkUpdateStatusEnum, UserJobApplicationValidApplicantUpdateStatusEnum, UserJobApplicationValidHrUpdateStatusEnum } from "../enums/UserJobApplication.enum";
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
   .uppercase()
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

    includeInterviewDetails: Joi.boolean()
      .optional()
      .default(false)
      .messages({
        "any.type": "includeInterviewDetails must be a boolean.",
      }),
  })
); 

// Define validation schema for updating job application
export const userJobApplicationUpdateValidation = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),

  status: Joi.string()
    .valid(...Object.values(UserJobApplicationValidHrUpdateStatusEnum))
    .required()
    .messages({
      "string.valid": `Status must be one of: ${Object.values(
        UserJobApplicationValidHrUpdateStatusEnum
      ).join(", ")}`,
      "any.required": "Status is required",
      "string.empty": "Status should not be empty",
    }),

  emailId: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),

  requestedDocumentNames: Joi.array()
    .min(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN)
    .max(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX)
    .items(Joi.string().lowercase())
    .optional()
    .messages({
      "any.type": "Requested document names must be an array of strings.",
      "array.min": `Requested document names must have at least ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN} item.`,
      "array.max": `Requested document names cannot have more than ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX} items.`,
    }),

  offerLetterCloudFileName: Joi.string().optional().messages({
    "any.type": "Offer letter cloud file name must be a string.",
  }),

  offerLetterRemarks: Joi.string().optional().messages({
    "any.type": "Offer letter remarks must be a string.",
  }),

  offerLetterJoiningDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "The joiningDate must be a valid ISO date string.",
    "any.type": "The joiningDate must be a string.",
  }),

  joiningDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "The joiningDate must be a valid ISO date string.",
    "any.type": "The joiningDate must be a string.",
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
    .valid(
      ...Object.values(CorporateUserTypeEnum),
      ...Object.values(AdminRoleEnum)
    )
    .messages({
      "string.valid": `User type must be one of: ${Object.values(
        CorporateUserTypeEnum
      ).join(", ")}, ${Object.values(AdminRoleEnum).join(", ")}.`,
      "any.required": "User type is required",
      "string.empty": "User type should not be empty",
    }),

  agencyUserSubmissionId: Joi.string().optional().messages({
    "any.type": "agencyUserSubmissionId must be a string.",
  }),

  candidateParsedCvId: Joi.string().optional().messages({
    "any.type": "candidateParsedCvId must be a string.",
  }),

  applicantName: Joi.string().required().messages({
    "any.required": "The Applicant name is required.",
    "string.empty": "The Applicant name should not be empty.",
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

/**
 * userJobApplicationDisplayToCorporateValidation
 */
export const userJobApplicationDisplayToCorporateValidation = Joi.object({
  displayToCorporate: Joi
    .valid(true)
    .required()
    .messages({
      "any.required": "The Display to Corporate field is required.",
      "boolean.base": "The Display to Corporate field must be a boolean.",
    }),
});

/**
 * userJobApplicationHiredFromOtherPortalValidationApiDto
 */
export const userJobApplicationHiredFromOtherPortalValidationApiDto = Joi.object({
  hiredFromOtherPortal: Joi
    .object({
      portal: Joi
        .string()
        .required()
        .messages({
          "any.required": "The Portal field is required.",
          "string.empty": "The Portal field should not be empty.",
          "string.base": "The Portal field must be a string.",
        }),

      date: Joi
        .string()
        .required()
        .isoDate()
        .messages({
          "any.required": "The Date field is required.",
          "string.empty": "The Date field should not be empty.",
          "string.base": "The Date field must be a string.",
          "string.isoDate": "The Date field must be a valid ISO 8601 date-time string.",
        }),
    })
    .required()
    .messages({
      "any.required": "The Hired from Other Portal field is required.",
      "object.base": "The Hired from Other Portal field must be an object.",
      "object.empty": "The Hired from Other Portal field should not be empty.",
    }),
});

/**
 * userJobApplicationBulkUpdateApiDtoValidation
 */
export const userJobApplicationBulkUpdateApiDtoValidation = Joi.object({
  bulkJobApplicationUpdate: Joi.array()
    .min(APP_CONSTANTS.BULK_JOB_APPLICATION_UPDATE_LIMIT.MIN)
    .max(APP_CONSTANTS.BULK_JOB_APPLICATION_UPDATE_LIMIT.MAX)
    .items(
      Joi.object({
        userType: Joi.string()
          .required()
          .valid(
            ...Object.values(CorporateUserTypeEnum),
            ...Object.values(AdminRoleEnum)
          )
          .messages({
            "string.valid": `The User type must be one of: ${Object.values(
              CorporateUserTypeEnum
            ).join(", ")}, ${Object.values(AdminRoleEnum).join(", ")}.`,
            "any.required": "The User type is required.",
            "string.empty": "The User type should not be empty.",
          }),
          
        emailId: Joi.string().email().required().messages({
          "any.required": "The Email ID field is required.",
          "string.empty": "The Email ID field should not be empty.",
          "string.email": "The Email ID field must be a valid email address.",
        }),

        jobApplicationId: Joi.string().required().messages({
          "any.required": "The Job Application ID field is required.",
          "string.empty": "The Job Application ID field should not be empty.",
        }),

        status: Joi.string()
          .required()
          .valid(...Object.values(JobApplicationValidBulkUpdateStatusEnum))
          .messages({
            "any.required": "The Status field is required.",
            "string.empty": "The Status field should not be empty.",
            "any.only": `Invalid Job application status. Please provide a valid value from
          ${Object.values(JobApplicationValidBulkUpdateStatusEnum).join(
            ", "
          )}.`,
          }),

        oldStatus: Joi.string()
          .valid(...Object.values(JobApplicationStatus))
          .required()
          .messages({
            "any.required": "The oldStatus field is required.",
            "any.only": `Invalid old status. Please provide a valid value from
          ${Object.values(JobApplicationStatus).join(", ")}.`,
          }),

        /**
         * @reference "JobApplicationStatusTrackerType" in "UserJobApplication.type.ts"
         */
        oldStatusTracker: Joi.array()
          .items(
            Joi.object({
              oldStatus: Joi.string()
                .valid(...Object.values(JobApplicationStatus))
                .required()
                .messages({
                  "any.required": "The oldStatus field is required.",
                  "any.only": `Invalid old status. Please provide a valid value from
          ${Object.values(JobApplicationStatus).join(", ")}.`,
                }),

              newStatus: Joi.string()
                .valid(...Object.values(JobApplicationStatus))
                .required()
                .messages({
                  "any.required": "The newStatus field is required.",
                  "any.only": `Invalid new status. Please provide a valid value from
          ${Object.values(JobApplicationStatus).join(", ")}.`,
                }),

              actionDate: Joi.string().isoDate().optional().messages({
                "string.isoDate":
                  "The actionDate must be a valid ISO date string.",
              }),

              userId: Joi.string().allow(null).optional(),

              userType: Joi.string()
                .valid(
                  ...Object.values(CorporateUserTypeEnum),
                  ...Object.values(AdminRoleEnum),
                  ...Object.values(UserType)
                )
                .allow(null)
                .optional()
                .messages({
                  "any.only": `The userType must be one of ${Object.values(
                    CorporateUserTypeEnum
                  ).join(", ")} or ${Object.values(AdminRoleEnum).join(
                    ", "
                  )} or ${Object.values(UserType).join(", ")}.`,
                }),
            })
          )
          .required()
          .messages({
            "any.required": "The Old Status Tracker field is required.",
            "array.base": "The Old Status Tracker field must be an array.",
            "array.empty": "The Old Status Tracker field should not be empty.",
          }),
        
        applicantName: Joi.string().required().messages({
          "any.required": "The Applicant name field is required.",
          "string.empty": "The Applicant name field should not be empty.",
        })
      })
    )
    .required()
    .messages({
      "any.required": "The Bulk Job Application Update field is required.",
      "array.base": "The Bulk Job Application Update field must be an array.",
      "array.empty":
        "The Bulk Job Application Update field should not be empty.",
      "array.min": `The Bulk Job Application Update field must contain at least ${APP_CONSTANTS.BULK_JOB_APPLICATION_UPDATE_LIMIT.MIN} item(s).`,
      "array.max": `The Bulk Job Application Update field must contain at most ${APP_CONSTANTS.BULK_JOB_APPLICATION_UPDATE_LIMIT.MAX} item(s).`,
    }),
});

/**
 * userJobApplicationApplicantUpdateValidation
 */
export const userJobApplicationApplicantUpdateValidation = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID should not be empty",
    "string.base": "User ID must be a string",
  }),

  emailId: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),

  userType: Joi.string().required().valid(UserType.CAND).messages({
    "any.only": `Invalid user type`,
    "any.required": "User type is required",
    "string.empty": "User type should not be empty",
  }),

  status: Joi.string()
    .valid(
      ...Object.values(UserJobApplicationValidApplicantUpdateStatusEnum),
    )
    .required()
    .messages({
      "string.valid": `Invalid status. Please provide a valid status.`,
      "any.required": "Status is required",
      "string.empty": "Status should not be empty",
    }),

  documentMapping: Joi.array()
    .min(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN)
    .max(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX)
    .items(
      Joi.object({
        documentName: Joi.string().required().lowercase().messages({
          "any.required": "Document name is required.",
          "string.empty": "Document name should not be empty.",
        }),

        cloudFileName: Joi.string().required().messages({
          "any.required": "Cloud file name is required.",
          "string.empty": "Cloud file name should not be empty.",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Document mapping must be an array.",
      "array.empty": "Document mapping should not be empty.",
      "array.min": `Document mapping must have at least ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN} item.`,
      "array.max": `Document mapping cannot have more than ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX} items.`,
    }),

  offerLetterIssueRemarks: Joi.string().optional().messages({
    "any.type": "Offer letter issue Remarks must be a string.",
  }),

  offerLetterCloudFileName: Joi.string().optional().messages({
    "any.type": "Offer letter cloud file name must be a string.",
  }),

  joiningDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "The joiningDate must be a valid ISO date string.",
    "any.type": "The joiningDate must be a string.",
  }),

  joiningHrName: Joi.string().optional().messages({
    "any.type": "HR name must be a string.",
  }),

  joiningApplicantMessage: Joi.string().optional().messages({
    "any.type": "Message must be a string.",
  }),

  applicantName: Joi.string().required().messages({
    "any.required": "The Applicant name field is required.",
    "string.empty": "The Applicant name field should not be empty.",
  }),
});

export const userJobApplicationFindMatchingScoreApiValidationDto = Joi.object({
  userJobApplicationId: Joi.string().required().messages({
    "any.required": "User job application ID is required",
    "string.empty": "User job application ID should not be empty",
  }),

  candidateParsedCvId: Joi.string().required().messages({
    "any.required": "Candidate parsed CV ID is required",
    "string.empty": "Candidate parsed CV ID should not be empty",
  }),
})