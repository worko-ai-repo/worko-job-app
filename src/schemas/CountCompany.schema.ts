
// Import the Joi library
import Joi from "joi";

// import enums
import { CountCompanyDbEntityTypeEnum } from "../enums/CountCompany.enum";

export const countCompanyGetByEntityTypeDtoValidation = Joi.object({
  entityType: Joi.string()
    .required()
    .valid(...Object.values(CountCompanyDbEntityTypeEnum))
    .messages({
      "any.only": `Invalid entity type. Please provide a valid value from
      ${Object.values(CountCompanyDbEntityTypeEnum).join(", ")}.`,
      "any.required": "Entity type is required",
      "string.empty": "Entity type should not be empty",
    }),
});
