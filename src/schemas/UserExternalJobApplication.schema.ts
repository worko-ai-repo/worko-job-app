// Import the Joi library
import Joi from "joi";

// Define validation schema for creating job application dto
export const userExternalJobApplicationCreateApiDTOValidation = Joi.object({
  jobId: Joi
   .string()
   .required()
   .messages({
    "any.required": "The jobId field is required.",
    "any.type": "The jobId field must be a string",
    "string.empty": "The jobId field should not be empty",
   }),

  jobUrl: Joi
   .string()
   .required()
   .messages({
    "any.required": "The jobUrl field is required.",
    "any.type": "The jobUrl field must be a string.",
    "string.empty": "The jobUrl field should not be empty.",
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
   })
});