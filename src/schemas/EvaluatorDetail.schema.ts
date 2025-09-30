// Import the Joi library
import Joi from "joi";

// Define validation schema for checking evaluator registration
export const evaluatorDetailCreateApiDTOValidation: Joi.ObjectSchema<any> = Joi.object(
  {
    name: Joi.string().required().lowercase().messages({
      "any.required": "Evaluator name is required",
      "string.empty": "Evaluator name should not be empty",
      "string.base": "Evaluator name must be a string",
    }),

    email: Joi.string().email().required().lowercase().messages({
      "any.required": "Evaluator email is required",
      "string.email": "Please provide a valid email address",
      "string.empty": "Evaluator email should not be empty",
      "string.base": "Evaluator email must be a string",
    }),

    cognitoUserId: Joi.string().required().messages({
      "any.required": "Cognito user id is required",
      "string.empty": "Cognito user id should not be empty",
      "string.base": "Cognito user id must be a string",
    }),
  }
);
