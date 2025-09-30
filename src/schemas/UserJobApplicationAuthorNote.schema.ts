// Load the npm packages
import Joi from "joi";

// import enums
import { UserJobApplicationAuthorNoteCognitoUserGroupEnum } from "../enums/UserJobApplicationAuthorNote.enum";

/**
 * noteDetailValidation
 * 
 * Joi schema for validating note detail
 */
const noteDetailValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title should not be empty",
    "string.base": "Title must be a string",
  }),
  detailedDescription: Joi.string().required().messages({
    "any.required": "Detailed Description is required",
    "string.empty": "Detailed Description should not be empty",
    "string.base": "Detailed Description must be a string",
  }),
});

/**
 * userJobApplicationAuthorNoteCreateValidation
 * 
 * Joi schema for validating job application note creation
 */
export const userJobApplicationAuthorNoteCreateValidation = Joi.object({
  jobApplicationId: Joi.string().required().messages({
    "any.required": "Job Application ID is required",
    "string.empty": "Job Application ID should not be empty",
    "string.base": "Job Application ID must be a string",
  }),
  authorCognitoUserGroup: Joi.string()
    .valid(...Object.values(UserJobApplicationAuthorNoteCognitoUserGroupEnum))
    .required()
    .messages({
      "any.only": `Invalid authorCognitoUserGroup. Please provide a valid value from ${[
        ...Object.values(UserJobApplicationAuthorNoteCognitoUserGroupEnum),
      ].join(", ")}.`,
      "any.required": "The authorCognitoUserGroup field is required.",
      "string.empty": "The authorCognitoUserGroup field should not be empty.",
    }),
  noteDetails: Joi.array().items(noteDetailValidation).min(1).required().messages({
    "array.base": "Note details must be an array.",
    "array.min": "At least one note detail is required.",
    "any.required": "Note details are required.",
  }),
});

/**
 * userJobApplicationAuthorNoteUpdateValidation
 * 
 * Joi schema for validating job application note update
 */
export const userJobApplicationAuthorNoteUpdateValidation = Joi.object({
  noteDetails: Joi.array().items(noteDetailValidation).required().messages({
    "array.base": "Note details must be an array.",
    "any.required": "Note details are required.",
  }),
});