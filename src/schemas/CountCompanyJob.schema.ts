
// Import the Joi library
import Joi from "joi";

// import enums
import { CountCompanyJobDbEntityTypeEnum } from "../enums/CountCompanyJob.enum";

export const countCompanyJobGetByEntityTypeDtoValidation = Joi.object({
  entityType: Joi.string()
    .required()
    .valid(...Object.values(CountCompanyJobDbEntityTypeEnum))
    .messages({
      "any.only": `Invalid entity type. Please provide a valid value from
      ${Object.values(CountCompanyJobDbEntityTypeEnum).join(", ")}.`,
      "any.required": "Entity type is required",
      "string.empty": "Entity type should not be empty",
    }),
});
