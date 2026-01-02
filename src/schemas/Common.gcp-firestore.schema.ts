// import the necessary npm packages
import Joi from "joi";

// Import enums
import { GcpFirestoreSortOrderTypeEnum } from "../enums/Common.gcp-firestore.enum";

export const gcpFirestoreCommonSchema = Joi.object({
  // Page size validation must be a number and must be at least 1
  pageSize: Joi.number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
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
   * NOTE: The frontend we send encoded lastKey value(Sample Value: "WzE3NDAzOTY2NDE0MzEsIjE0MzA3MDQwMzIiXQ") as string in request
   *  query parameters, so while decoding the string, it should convert to appropriate data type,
   *  If it is not an appropriate data type then it will throw error
   */
  lastKey: Joi.object({
    gcpFirestoreDocumentId: Joi.string().required().messages({
      "string.base": "The GCP Firestore document id must be a valid string.",
      "any.required": "The GCP Firestore document id is required.",
    }),
  })
    .optional()
    .messages({
      "object.base": "The lastKey field must be an object.",
      "any.required": "The lastKey is required.",
    }),

  /**
   * sortOrder
   */
  sortOrder: Joi.string()
    .optional()
    .allow(null, "")
    .valid(...Object.values(GcpFirestoreSortOrderTypeEnum))
    .messages({
      "any.only": `Invalid sort order. Please provide a valid value from ${Object.values(
        GcpFirestoreSortOrderTypeEnum
      ).join(", ")}.`,
    }),

  // Search text validation must be a string if provided
  searchText: Joi.string().optional().allow(null, "").messages({
    "string.base": "The Search text field must be a string.",
  }),

  fromDate: Joi.string()
    .optional()
    .allow(null, "")
    .isoDate() // Ensures a valid ISO 8601 date-time string
    .messages({
      "string.base": "The fromDate field must be a valid string.",
      "string.isoDate":
        "The fromDate field must be a valid ISO 8601 date-time string.",
    }),

  toDate: Joi.string()
    .optional()
    .allow(null, "")
    .isoDate() // Ensures a valid ISO 8601 date-time string
    .messages({
      "string.base": "The toDate field must be a valid string.",
      "string.isoDate":
        "The toDate field must be a valid ISO 8601 date-time string.",
    }),
});

// Custom Joi validator to parse comma-separated strings
export const optionalCommaSeparatedStringToArray = <RequestValueType>(
  value: RequestValueType,
  helpers: Joi.CustomHelpers
) => {
  /**
   * Return undefined if:
   * - The value is not a string (e.g., number, object, null, undefined)
   * - The value is "undefined" or "null"
   *
   * This helps filter out invalid or placeholder string values.
   *
   * Examples:
   * - typeof ""              => "string"      ✅ valid
   * - typeof "undefined"     => "string"      ❌ invalid
   * - typeof undefined       => "undefined"   ❌ invalid
   * - typeof null            => "object"      ❌ invalid
   */
  if (typeof value !== "string" || value === "undefined" || value === "null") {
    return undefined;
  }

  const trimmed: string = value.trim();

  if (trimmed === "") {
    return undefined;
  }

  // Split and trim each entry
  const parts: string[] = trimmed.split(",").map((str: string) => str.trim());

  /**
   * Validate: no empty values like "amazon,,microsoft"
   *
   * @todo: Instead of throwing error, We need to
   * handle in such a way that remove empty values
   * and proceed further.
   */
  const hasEmpty: boolean = parts.some((part: string) => part === "");
  if (hasEmpty) {
    return helpers.error("string.commaSeparated");
  }

  return parts;
};
