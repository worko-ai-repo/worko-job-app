// Import joi
import Joi from "joi";

// Import enums
import {
  ReferAndEarnAllowedAdminUpdateStatusEnum,
  ReferAndEarnJobApplicationStatusEnum,
  ReferAndEarnStatusEnum,
} from "../enums/ReferAndEarn.enum";
import { AdminRoleEnum } from "../enums/Common.enum";

// Import schemas
import { commonSchema } from "./Common.schema";

/**
 * referAndEarnCreateApiDtoValidation
 *
 * Define validation schema for the refer and earn create API
 */
export const referAndEarnCreateApiDtoValidation = Joi.object({
  recipientDetails: Joi.object({
    id: Joi
    .string()
    .optional()
    .messages({
      "string.base": "The ID field must be a string.",
    }),

    email: Joi
    .string()
    .email()
    .required()
    .lowercase()
    .messages({
      "string.base": "The Recipient Email field must be a string.",
      "string.email": "Please provide a valid email address.",
      "any.required": "The Recipient Email field is required.",
    }),

    name: Joi
    .string()
    .required()
    .lowercase()
    .messages({
      "string.base": "The Recipient Recipient name field must be a string.",
      "string.empty": "The Recipient name field is required.",
      "any.required": "The Recipient name field is required.",
    }),

    phoneCountryCode: Joi
      .number()
      .required()
      .messages({
        "number.base": "The Recipient Phone country code field must be a number.",
        "number.empty": "The Recipient Phone country code field is required.",
        "any.required": "The Recipient Phone country code field is required.",
      }),

    phoneNumber: Joi
      .number()
      .required()
      .messages({
        "number.base": "The Recipient Phone number field must be a number.",
        "number.empty": "The Recipient Phone number field is required.",
        "any.required": "The Recipient Phone number field is required.",
      }),
  })
    .required()
    .messages({
      "any.required": "The Recipient details are required.",
    }),

  companyDetails: Joi.object({
    id: Joi
      .string()
      .required()
      .messages({
        "string.base": "The Company ID field must be a string.",
        "string.empty": "The Company ID field is required.",
        "any.required": "The Company ID field is required.",
      }),

    name: Joi
      .string()
      .required()
      .uppercase()
      .messages({
        "string.base": "The Company name field must be a string.",
        "string.empty": "The Company name field is required.",
        "any.required": "The Company name field is required.",
      }),
  })
    .required()
    .messages({
      "any.required": "The Company details are required.",
    }),

  jobDetails: Joi.object({
    id: Joi
      .string()
      .required()
      .messages({
        "string.base": "The Job ID field must be a string.",
        "string.empty": "The Job ID field is required.",
        "any.required": "The Job ID field is required.",
      }),
    title: Joi
      .string()
      .required()
      .lowercase()
      .messages({
        "string.base": "The Job title field must be a string.",
        "string.empty": "The Job title field is required.",
        "any.required": "The Job title field is required.",
      }),

    url: Joi
      .string()
      .required()
      .uri()
      .messages({
        "string.base": "The Job URL field must be a string.",
        "string.empty": "The Job URL field is required.",
        "any.required": "The Job URL field is required.",
      }),
  })
    .required()
    .messages({
      "any.required": "The Job details are required.",
    }),
});

/**
 * referAndEarnUpdateApiDtoValidation
 *
 * Define validation schema for the refer and earn update API
 */
export const referAndEarnUpdateApiDtoValidation = Joi.object({
  status: Joi.string()
    .optional() // allow `undefined` value
    .valid(...Object.values(ReferAndEarnAllowedAdminUpdateStatusEnum))
    .messages({
      "any.only": `Invalid Refer and earn status. Please provide a valid value from
  ${Object.values(ReferAndEarnAllowedAdminUpdateStatusEnum).join(", ")}.`,
    }),

  withDrawalRequestRejectedReason: Joi.string()
    .optional() // allow `undefined` value
    .messages({
      "string.base": "The WithDrawal request rejected reason field must be a string.",
    }),

  referrerBankDetails: Joi.object({
    accountHolderName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .uppercase()
      .required()
      .messages({
        "string.empty": "The Account holder field name is required.",
        "string.min": "The Account holder field must be at least 2 characters.",
        "string.max": "The Account holder field must be at most 100 characters.",
      }),

    accountNumber: Joi.number().integer().positive().required().messages({
      "number.base": "The Account number field must be a number.",
      "number.positive": "The Account number must be a positive number.",
      "number.empty": "The Account number is required.",
    }),

    ifscCode: Joi.string()
      .alphanum()
      .length(11)
      .uppercase()
      .required()
      .messages({
        "string.base": "The IFSC code field must be a string.",
        "string.length": "The IFSC code must be exactly 11 characters.",
        "string.empty": "The IFSC code is required.",
      }),

    branchName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .uppercase()
      .required()
      .messages({
        "string.empty": "The Branch name field is required.",
        "string.min": "The Branch name field must be at least 2 characters.",
        "string.max": "The Branch name field must be at most 100 characters.",
      }),
  }).optional().messages({
    "any.type": "The Referrer bank details must be an object.",
  }),

  paymentDoneDetails: Joi.object({
    userId: Joi.string().required().messages({
      "string.base": "The User ID field must be a string.",
      "any.required": "The User ID field is required.",
      "string.empty": "The User ID field is required.",
    }),
    userType: Joi.string()
      .valid(
        ...Object.values(AdminRoleEnum)
      )
      .required()
      .messages({
        "any.only": `Invalid userType. Please provide a valid value from ${[
          ...Object.values(AdminRoleEnum),
        ].join(", ")}.`,
        "any.required": "The User Type field is required.",
      }),
    actionDate: Joi.string().isoDate().required().messages({
      "string.base": "The Action Date field must be a string in ISO format.",
      "string.isoDate": "The Action Date field must be a valid ISO 8601 date.",
      "any.required": "The Action Date field is required.",
      "string.empty": "The Action Date field is required.",
      "string.date": "The Action Date field must be a valid date.",
    }),
    amountPaid: Joi.number().required().messages({
      "number.base": "The Amount Paid field must be a number.",
      "any.required": "The Amount Paid field is required.",
      "number.empty": "The Amount Paid field is required.",
    }),
    uniqueTransactionReference: Joi.string().required().messages({
      "string.base": "The Unique Transaction Reference field must be a string.",
      "any.required": "The Unique Transaction Reference field is required.",
      "string.empty": "The Unique Transaction Reference field is required.",
    }),
  }).optional().messages({
    "any.type": "The Payment done details must be an object.",
  }),

  commissionAmount: Joi.number().optional().messages({
    "number.base": "The Commission Amount field must be a number",
  }), 
});

/**
 * referAndEarnFilterOptionsValidation
 *
 * Define validation schema for the refer and earn filter API
 */
export const referAndEarnFilterOptionsValidation = commonSchema.concat(
  Joi.object({
    status: Joi.string()
      .optional() // allow `undefined` value
      .allow(null, "")
      .valid(...Object.values(ReferAndEarnStatusEnum))
      .messages({
        "any.only": `Invalid Refer and earn status. Please provide a valid value from
      ${Object.values(ReferAndEarnStatusEnum).join(", ")}.`,
      }),
    companyId: Joi.string().optional().allow("", null).messages({
      "any.type": "The Company Id field must be a string",
    }),
    referrerEmail: Joi.string().email().optional().allow("", null).messages({
      "string.email": "The Referrer email field must be a valid email address.",
    }),
    jobId: Joi.string().optional().allow("", null).messages({
      "any.type": "The Job Id field must be a string.",
    }),
    userJobApplicationId: Joi.string().optional().allow("", null).messages({
      "any.type": "The User Job Application Id field must be a string.",
    }),
    jobApplicationStatus: Joi.string()
      .optional() // allow `undefined` value
      .allow(null, "")
      .valid(...Object.values(ReferAndEarnJobApplicationStatusEnum))
      .messages({
        "any.only": `Invalid Refer and earn job application status. Please provide a valid value from
        ${Object.values(ReferAndEarnJobApplicationStatusEnum).join(", ")}.`,
      }),
  })
);

/**
 * referAndEarnRequestWithdrawalApiDtoValidation
 */
export const referAndEarnRequestWithdrawalApiDtoValidation = Joi.object({
  accountHolderName: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .uppercase()
    .messages({
      "string.empty": "The Account holder field name is required.",
      "string.base": "The Account holder field must be a string.",
      "string.min": "The Account holder field must be at least 2 characters.",
      "string.max": "The Account holder field must be at most 100 characters.",
    }),

  accountNumber: Joi.number()
    .required()
    .integer()
    .positive()
    .messages({
      "number.base": "The Account number field must be a number.",
      "number.positive": "The Account number field must be a positive number.",
      "number.empty": "The Account number field is required.",
    }),

  ifscCode: Joi.string()
    .required()
    .alphanum()
    .length(11)
    .uppercase()
    .messages({
      "string.base": "The IFSC code field must be a string.",
      "string.length": "The IFSC code must be exactly 11 characters.",
      "string.empty": "The IFSC code is required.",
    }),

  branchName: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .uppercase()
    .messages({
      "string.empty": "The Branch name field is required.",
      "string.base": "The Branch name field must be a string.",
      "string.min": "The Branch name field must be at least 2 characters.",
      "string.max": "The Branch name field must be at most 100 characters.",
    }),
});