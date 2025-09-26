// Import the Joi library
import Joi from "joi";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

export const filePsuToUploadDtoValidation = Joi.object({
  fileName: Joi.string().required().messages({
    "any.required": "File name is required",
    "string.empty": "File name should not be empty",
    "string.base": "File name must be a string",
  }),

  fileMimeType: Joi.string().required().messages({
    "any.required": "File mime type is required",
    "string.empty": "File mime type should not be empty",
    "string.base": "File mime type must be a string",
  }),
});

export const userJobApplicationDocumentPsuToUploadApiDtoValidation = Joi.object(
  {
    jobApplicationId: Joi.string().required().messages({
      "any.required": "Job Application ID is required",
      "string.empty": "Job Application ID should not be empty",
      "string.base": "Job Application ID must be a string",
    }),

    userId: Joi.string().required().messages({
      "any.required": "User ID is required",
      "string.empty": "User ID should not be empty",
      "string.base": "User ID must be a string",
    }),

    fileDetails: Joi.array()
      .min(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN)
      .max(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX)
      .items(filePsuToUploadDtoValidation.concat(Joi.object({
        corporateRequestedFileName: Joi.string().required().messages({
          "any.required": "Corporate requested file name is required",
          "string.empty": "Corporate requested file name should not be empty",
          "string.base": "Corporate requested file name must be a string",
        }),
      })))
      .required()
      .messages({
        "any.required": "File details are required",
        "array.base": "File details must be an array",
        "array.min": `At least ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN} file detail is required`,
        "array.max": `File details cannot have more than ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX} items`,
      }),
  }
);

export const userJobApplicationDocumentPsuToViewApiDtoValidation = Joi.object({
  jobApplicationId: Joi.string().required().messages({
    "any.required": "Job Application ID is required",
    "string.empty": "Job Application ID should not be empty",
    "string.base": "Job Application ID must be a string",
  }),

  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID should not be empty",
    "string.base": "User ID must be a string",
  }),

  cloudFileNames: Joi.array()
    .min(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN)
    .max(APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX)
    .items(Joi.string())
    .required()
    .messages({
      "any.required": "Cloud file names are required",
      "array.base": "Cloud file names must be an array",
      "array.min": `Atleast ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MIN} cloud file name is required`,
      "array.max": `Cloud file names cannot have more than ${APP_CONSTANTS.USER_JOB_APPLICATION_UPLOAD_DOCUMENT_RANGE.MAX} items`,
    }),
});

/**
 * userJobApplicationOfferLetterPsuToUploadApiDtoValidation
 */
export const userJobApplicationOfferLetterPsuToUploadApiDtoValidation =
  filePsuToUploadDtoValidation.concat(
    Joi.object({
      jobApplicationId: Joi.string().required().messages({
        "any.required": "Job Application ID is required",
        "string.empty": "Job Application ID should not be empty",
        "string.base": "Job Application ID must be a string",
      }),

      userId: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.empty": "User ID should not be empty",
        "string.base": "User ID must be a string",
      }),
    })
  );


export const userJobApplicationOfferLetterPsuToViewApiDtoValidation = Joi.object({
  jobApplicationId: Joi.string().required().messages({
    "any.required": "Job Application ID is required",
    "string.empty": "Job Application ID should not be empty",
    "string.base": "Job Application ID must be a string",
  }),

  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID should not be empty",
    "string.base": "User ID must be a string",
  }),

  cloudFileName: Joi.string().required().messages({
    "any.required": "Cloud file name is required",
    "string.empty": "Cloud file name should not be empty",
    "string.base": "Cloud file name must be a string",
  }),
});