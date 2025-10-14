
// Import the Joi library
import Joi from "joi";

// import enums
import { CountUserDbEntityTypeEnum } from "../enums/CountUser.enum";

export const countUserGetByEntityTypeDtoValidation = Joi.object({
  entityType: Joi.string()
    .required()
    .valid(...Object.values(CountUserDbEntityTypeEnum))
    .messages({
      "any.only": `Invalid entity type. Please provide a valid value from
      ${Object.values(CountUserDbEntityTypeEnum).join(", ")}.`,
      "any.required": "Entity type is required",
      "string.empty": "Entity type should not be empty",
    }),
});
