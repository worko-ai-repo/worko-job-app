// Import joi
import Joi from "joi";

// Import schemas
import { awsOpensearchCommonSchema } from "./Common.aws-opensearch.schema";

// Define validation schema for updating user matching score job dto
export const userMatchingScoreJobUpdateApiDTOValidation = Joi.object({
  jobIds: Joi
    .array()
    .items(
      Joi
      .string()
      .trim()
      .required()
      .messages({
        "string.base": "The Each jobId must be a string.",
        "string.empty": "The Each jobId cannot be empty.",
        "any.required": "The Each jobId is required.",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "The JobIds field must be an array.",
      "array.min": "At least one jobId must be provided.",
      "any.required": "The JobIds field is required.",
    }),
});


/**
 * userMatchingScoreJobFilterDtoValidation
 */
export const userMatchingScoreJobFilterDtoValidation =  awsOpensearchCommonSchema.concat( 
  Joi.object({
    jobIds: Joi
      .string()
      .required()
      .messages({
        "string.base": "The jobIds field must be a string.",
        "string.empty": "The jobIds field cannot be empty.",
        "any.required": "The jobIds field is required.",
      }),
  })
);