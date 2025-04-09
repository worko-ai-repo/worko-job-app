// import the necessary npm packages
import Joi from "joi";

// import the enums
import { SortOrderTypeEnum } from "../enums/Common.enum";

/**
 * commonSchema
 * 
 * This schema is reusable or commonly used, whenever you implement pagination for listing records.
 * 
 * .optional() means that the when you declare a variable name(example: lastKey,sortOrder..) 
 * but don't assign any value to it, then the variable will be undefined. since you've used .optional(), 
 * Joi will not throw a validation error. The absence of a value is considered valid.
 * 
 * .allow(null, "") means that the declared variable name can be null or an empty string.
 * 
 */
export const commonSchema = Joi.object({
  // Page size validation must be a number and must be at least 1
  pageSize: Joi
    .number()
    .integer()
    .required()
    .min(1)
    .messages({
      "number.base": "Page size must be a number.",
      "number.integer": "Page size must be an integer.",
      "number.min": "Page size must be at least 1.",
      "any.required": "Page size is required.",
    }),

  /**
   * lastKey
   * 
   * Last key can be falsy value like undefined but if frontend user provide a lastKey then 
   * the frontend user must provide a valid lastKey value as string, so in backend 
   * we internally decode that valid lastKey value to object[look in request.helper.ts], If the frontend 
   * user provide lastKey value as string and it is not valid base64 string then 
   * the lastKey value will be undefined again 
   *  
   * ISSUE: if lastKey is provided by frontend user and it is  not in base64 format, 
   * then it will not decode to original value(possibly object) and lastKey will be "undefined" 
   * but we are allowing undefined as lastKey in Common.schema.ts;  
   * so, even though if frontend user provide invalid lastKey it won't throw error 
   */
  lastKey: Joi
    .object()
    .optional()
    .allow(null, "")
    .messages({
      "object.base": "Provide a valid last key.",
    }),

  /**
   * If sortOrder is declared but didn't provide any value then it will be undefined,
   * since you've used .optional(),Joi will not throw a validation error. The absence of a value is considered valid.
   *
   * If sortOrder is declared and provided a value to it, then that value should be a valid value from the SortOrderTypeEnum.
   *
   * If sortOrder is null or an empty string, since you've used .allow(null, ""),Joi will not throw a validation error.
   */
  sortOrder: Joi
    .string()
    .optional()
    .allow(null, "")
    .valid(...Object.values(SortOrderTypeEnum))
    .messages({
      "any.only": `Invalid sort order. Please provide a valid value from ${Object.values(
        SortOrderTypeEnum
      ).join(", ")}.`,
    }),

  // Search text validation must be a string if provided
  searchText: Joi
    .string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "Search text must be a string.",
    }),

  /**
   * fromDate will be a valid timestamp in number format if provided and it should be a positive number
   *
   * Note: this "fromDate" will be come from backend code internally after converting it from "string" to "timestamp"
   */
  fromDate: Joi
    .number()
    .optional()
    .allow(null, "")
    .integer()
    .min(0) // Ensures the timestamp is a positive number
    .messages({
      "number.base": "fromDate must be a valid timestamp in number format.",
      "number.min": "fromDate must be a positive timestamp.",
      "number.integer": "fromDate must be an integer timestamp.",
    }),

  /**
   * toDate will be a valid timestamp in number format if provided and it should be a positive number
   *
   * Note: this "toDate" will be come from backend code internally after converting it from "string" to "timestamp"
   */
  toDate: Joi
    .number()
    .optional()
    .allow(null, "")
    .integer()
    .min(0) // Ensures the timestamp is a positive number
    .messages({
      "number.base": "toDate must be a valid timestamp in number format.",
      "number.min": "toDate must be a positive timestamp.",
      "number.integer": "toDate must be an integer timestamp.",
    }),
});

/**
 * anyTypeToArray
 * 
 * Converts any data type to an array.
 * 
 * The schema effectively handles both single values and arrays,
 * ensuring that any non-array input is converted to an array,
 * and then validating the array according to specified rules.
 * This design keeps the validation logic clear and efficient
 */
export const anyTypeToArray = Joi
  .alternatives()
  .try(
    Joi.any().custom((value) => {
      return Array.isArray(value) ? value : [value];
    }),

    // Validate arrays
    Joi.array().items(Joi.any())
      .min(1)
      .messages({
        'array.min': 'At least one value must be provided.',
      }
      )
  )
  .default([]); // If the user provides neither a string nor an array, return an empty array
