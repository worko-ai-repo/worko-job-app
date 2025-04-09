// import the necessary npm packages
import Joi from "joi";

// Import enums
import { AwsOpensearchSortOrderTypeEnum } from "../enums/Common.aws-opensearch.enum";

export const awsOpensearchCommonSchema = Joi.object({
  // Page size validation must be a number and must be at least 1
  pageSize: Joi
   .number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
   .integer()
   .required()
   .min(1)
   .messages({
    "number.base": "The Page size field must be a number.",
    "number.integer": "The Page size field must be an integer.",
    "number.min": "The Page size field must be at least 1.",
    "any.required": "The Page size is required.",
   }),

  /**
   * lastKey
   */
  lastKey: Joi
   .array()
   .optional()
   .messages({
    "array.base": "The lastKey field must be an array.",
   }),

  /**
   * sortOrder
   */
  sortOrder: Joi.string()
    .optional()
    .allow(null, "")
    .valid(...Object.values(AwsOpensearchSortOrderTypeEnum))
    .messages({
      "any.only": `Invalid sort order. Please provide a valid value from ${Object.values(
        AwsOpensearchSortOrderTypeEnum
      ).join(", ")}.`,
    }),

  // Search text validation must be a string if provided
  searchText: Joi
   .string()
   .optional()
   .allow(null, "")
   .messages({
    "string.base": "The Search text field must be a string.",
   }),

  fromDate: Joi.string()
    .optional()
    .allow(null, "")
    .isoDate() // Ensures a valid ISO 8601 date-time string
    .messages({
      "string.base": "The fromDate field must be a valid string.",
      "string.isoDate": "The fromDate field must be a valid ISO 8601 date-time string.",
    }),

  toDate: Joi.string()
    .optional()
    .allow(null, "")
    .isoDate() // Ensures a valid ISO 8601 date-time string
    .messages({
      "string.base": "The toDate field must be a valid string.",
      "string.isoDate": "The toDate field must be a valid ISO 8601 date-time string.",
    }),
});