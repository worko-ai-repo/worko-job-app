
// Import the Joi library
import Joi from "joi";

// import enums
import { CountGlobalDbEntityTypeEnum } from "../enums/CountGlobal.enum";

export const countGlobalGetByEntityTypeDtoValidation = Joi.object({
  entityType: Joi.string()
    .required()
    .valid(...Object.values(CountGlobalDbEntityTypeEnum))
    .messages({
      "any.only": `Invalid entity type. Please provide a valid value from
      ${Object.values(CountGlobalDbEntityTypeEnum).join(", ")}.`,
      "any.required": "Entity type is required",
      "string.empty": "Entity type should not be empty",
    }),
});
