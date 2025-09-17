
// Import Joi for validation
import Joi from "joi";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import enums
import { JobDashboardEnum, JobStatusEnum, JobWorkModeEnum } from "../enums/Job.enum";
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";

// Import schemas
import { awsOpensearchCommonSchema, optionalCommaSeparatedStringToArray } from "./Common.aws-opensearch.schema";

/**
 * jobCreateApiDtoValidation
 * 
 * Define validation schema for creating job
 */
export const jobCreateApiDtoValidation = Joi.object({
  // Validate companyID field
  companyId: Joi
   .string()
   .required()
   .messages({
    "any.required": "The Company ID field is required.",
    "string.empty": "The Company ID field should not be empty.",
    "string.base": "The Company ID field must be a string.",
   }),

  // Validate jobTitle field
  jobTitle: Joi
   .string()
   .lowercase()
   .min(1)
   .required()
   .messages({
    "any.required": "The Job title field is required.",
    "string.min": "The Job title field must be at least 1 character long.",
    "string.empty": "The Job title field should not be empty.",
    "string.base": "The Job title field must be a string.",
   }),

  // Validate jobDescription field
  jobDescription: Joi
   .string()
   .min(1)
   .required()
   .messages({
    "any.required": "The Job description field is required.",
    "string.min": "The Job description field must be at least 1 character long.",
    "string.empty": "The Job description field should not be empty.",
    "string.base": "The Job description field must be a string.",
   }),

  htmlJobDescription: Joi
   .string()
   .required()
   .messages({
    "string.base": "The HTML job description field must be a string.",
    "any.required": "The HTML job description field is required.",
    "string.empty": "The HTML job description field should not be empty.",
   }),

  // Validate otherRequirements field
  otherRequirements: Joi
   .string()
   .allow("")
   .optional()
   .messages({
    "string.base": "The Other requirements field must be a string.",
   }),

  // Validate experienceRange field
  experienceRange: Joi.object({
    min: Joi
    .number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "The Minimum experience field must be a number.",
      "number.min": "The Minimum experience field must be a positive integer.",
    }),

    max: Joi
      .number()
      .integer()
      .min(Joi.ref("min")) // Ensure max is greater than or equal to min
      .required()
      .messages({
        "number.base": "The Maximum experience field must be a number.",
        "number.min": "The Maximum experience field cannot be less than minimum experience.",
      }),
  })
    .required()
    .messages({
      "any.required": "The Experience range field is required.",
    }),

  // Validate noticePeriod field
  noticePeriod: Joi
   .number()
   .integer()
   .min(0)
   .optional()
   .messages({
    "number.base": "The Notice period field must be a number.",
    "number.min": "The Notice period cannot be negative.",
   }),

  // Validate numOfOpenings field
  numOfOpenings: Joi
   .number()
   .integer()
   .min(1)
   .required()
   .messages({
    "any.required": "The Number of openings field is required.",
    "number.base": "The Number of openings field must be a number.",
    "number.min": "The Number of openings field must be at least 1.",
   }),

  // Validate salaryRange field
  salaryRange: Joi.object({
    min: Joi
    .number()
    .min(0)
    .required()
    .messages({
      "any.required": "The Minimum salary field is required.",
      "number.base": "The Minimum salary field must be a number.",
      "number.min": "The Minimum salary field cannot be negative.",
    }),
    max: Joi.number()
      .min(Joi.ref("min")) // Ensure max is greater than or equal to min
      .required()
      .messages({
        "any.required": "The Maximum salary field is required.",
        "number.base": "The Maximum salary field must be a number.",
        "number.min": "The Maximum salary field cannot be less than minimum salary.",
      }),
  })
    .required()
    .messages({
      "any.required": "The Salary range field is required.",
    }),

  // Validate department field
  department: Joi
   .string()
   .lowercase()
   .min(1)
   .required()
   .messages({
    "any.required": "The Department field is required.",
    "string.min": "The Department field should be at least 1 character long.",
   }),

  location: Joi.object({
    city: Joi.array()
      .items(Joi.string().lowercase())
      .optional()
      .default([])
      .messages({
        'array.base': 'The City field must be an array of strings.',
        'string.base': 'Each item in the City field must be a string.',
      }),
    state: Joi.array()
      .items(Joi.string().lowercase())
      .optional()
      .default([])
      .messages({
        'array.base': 'The State field must be an array of strings.',
        'string.base': 'Each item in the State field must be a string.',
      }),
    country: Joi.array()
      .items(Joi.string().lowercase())
      .optional()
      .default([])
      .messages({
        'array.base': 'The Country field must be an array of strings.',
        'string.base': 'Each item in the Country field must be a string.',
      }),
    fullLocation: Joi.array()
      .items(Joi.string().lowercase())
      .optional()
      .default([])
      .messages({
        'array.base': 'The Full Location field must be an array of strings.',
        'string.base': 'Each item in the Full Location field must be a string.',
      }),
    })
  .required()
  .messages({
    'object.base': 'The Location field must be an object.',
    'any.required': 'The Location field is required.',
  }),

  // Validate workMode field
  workMode: Joi.string()
    .required()
    .valid(...Object.values(JobWorkModeEnum))
    .messages({
      "any.required": "The Work mode field is required.",
      "any.only": `The Work mode field must be one of the allowed values i.e. ${Object.values(
        JobWorkModeEnum
      ).join(", ")}.`,
    }),

  // Validate typeofEmployment field
  typeofEmployment: Joi
    .string()
    .uppercase()
    .required()
    .messages({
      "any.required": "The Type of employment field is required.",
      "string.empty": "The Type of employment field should not be empty.",
      "string.base": "The Type of employment field must be a string.",
    }),

  //Validate coreSkills field
  coreSkills: Joi.array()
    .min(1)
    .items(Joi.string().lowercase())
    .required()
    .messages({
      "array.base": "Core skills must be an array.",
      "array.min": "At least one core skill is required.",
      "any.required": "Core skills are required.",
    }),

  //Validate softSkills field
  softSkills: Joi.array()
    .min(1)
    .items(Joi.string().lowercase())
    .required()
    .messages({
      "array.base": "The Soft skills field must be an array.",
      "array.min": "At least one soft skill is required.",
      "any.required": "The Soft skills field are required.",
    }),

  //Validate technicalSkills field
  technicalSkills: Joi.array()
    .min(1)
    .items(Joi.string().lowercase())
    .required()
    .messages({
      "array.base": "The Technical skills field must be an array.",
      "array.min": "At least one technical skill is required.",
      "any.required": "The Technical skills field is required.",
    }),

  miscellaneousSkills: Joi.array()
    .allow("")
    .items(Joi.string().lowercase())
    .optional()
    .messages({
      "array.base": "The Miscellaneous skills field must be an array.",
    }),

  // Validate status field
  status: Joi.string()
    .required()
    .valid(...Object.values(JobStatusEnum))
    .messages({
      "any.required": "The Status field is required.",
      "any.only": `The Status field must be one of the allowed values  i.e. ${Object.values(
        JobStatusEnum
      ).join(", ")} `,
    }),

  displaySalaryRange: Joi.boolean()
    .optional()
    .default(true)
    .messages({
      "any.type": "The Display salary range field must be a boolean.",
    }),
});

/**
 * jobFilterDtoValidation
 */
export const jobFilterDtoValidation = awsOpensearchCommonSchema.concat(
  Joi.object({
    dashboard: Joi
      .string()
      .optional()
      .valid(...Object.values(JobDashboardEnum))
      .messages({
        "any.type": `The dashboard field must be one of the allowed values i.e. ${Object.values(JobDashboardEnum).join(", ")}.`,
      }),

    companyId: Joi
      .string()
      .optional()
      .allow("", null)
      .messages({
        "any.type": "The company Id field must be a string.",
      }),

    location: Joi
      .string()
      .optional()
      .allow("", null)
      .messages({
        "any.type": "The location field must be a string.",
      }),

    companyName: Joi
      .string()
      .optional()
      .allow("", null)
      .messages({
        "any.type": "The companyName field must be a string.",
      }),

    minExperience: Joi
      .number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.min': 'The Minimum experience field must be a positive integer.',
      }),

    maxExperience: Joi
      .number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.min': 'The Maximum experience field must be a positive integer.',
      }),

    minSalary: Joi
      .number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.min': 'The Minimum salary field must be a positive integer.',
      }),

    maxSalary: Joi
      .number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.min': 'The Maximum salary field must be a positive integer.',
      }),

    YOE: Joi
      .number() // Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
      .min(0)
      .optional()
      .messages({
        'number.min': 'The Years of experience field must be a positive integer.',
      }),

    department: Joi 
      .string()
      .optional()
      .allow("", null)
      .custom(optionalCommaSeparatedStringToArray, "Comma-separated string to array")
      .messages({
        "string.base": "The Department field must be a string.",
        "string.commaSeparated": "Please provide valid comma-separated company names.",
      }),

    softSkills: Joi 
      .string()
      .optional()
      .allow("", null)
      .custom(optionalCommaSeparatedStringToArray, "Comma-separated string to array")
      .messages({
        "string.base": "The Soft skills field must be a string.",
        "string.commaSeparated": "Please provide valid comma-separated company names.",
      }),

    coreSkills: Joi 
      .string()
      .optional()
      .allow("", null)
      .custom(optionalCommaSeparatedStringToArray, "Comma-separated string to array")
      .messages({
        "string.base": "The Core skills field must be a string.",
        "string.commaSeparated": "Please provide valid comma-separated company names.",
      }),

    technicalSkills: Joi 
      .string()
      .optional()
      .allow("", null)
      .custom(optionalCommaSeparatedStringToArray, "Comma-separated string to array")
      .messages({
        "string.base": "The Technical skills field must be a string.",
      }),

    workMode: Joi
      .string()
      .optional()
      .valid(...Object.values(JobWorkModeEnum))
      .messages({
        "any.only": `The Work mode field must be one of the allowed values i.e. ${Object.values(
          JobWorkModeEnum
        ).join(", ")}.`,
        "any.type": "The Work mode field must be a string.",
      }),

    status: Joi
      .string()
      .optional()
      .valid(...Object.values(JobStatusEnum))
      .messages({
        "any.only": `The status field must be one of the allowed values i.e. ${Object.values(JobStatusEnum).join(", ")}.`,
      }),

    jobTitle: Joi
      .string()
      .allow("", null)
      .optional()
      .lowercase()
      .messages({
        "string.base": "The job title field must be a string.",
      }),

    typeofEmployment: Joi
      .string()
      .optional()
      .messages({
        "string.base": "The type of employment field must be a string.",
      }),

    userRole: Joi
      .string()
      .optional()
      .valid(...Object.values(CorporateUserTypeEnum))
      .messages({
        "any.only": `The user role field must be one of the allowed values i.e. ${Object.values(
          CorporateUserTypeEnum
        ).join(", ")}.`,
        "any.type": "The user role field must be a string.",
      }),

    corporateRecruiterUserId: Joi
      .string()
      .optional()
      .allow("", null)
      .messages({
        "any.type": "The corporate recruiter user id field must be a string.",
      }),
  })
) 

/**
 * parsedJobDescriptionApiDtoValidation
 * 
 * validation schema for parsing job description
 */
export const parsedJobDescriptionApiDtoValidation = Joi.object({
  jobDescription: Joi
    .string()
    .required()
    .messages({
        "any.required": `"jobDescription" is required.`,
        "string.base": `"jobDescription" must be a string.`,
        "string.empty": `"jobDescription" cannot be empty.`,
    }),
});

/**
 * jobUpdateApiDtoValidation
 */
export const jobUpdateApiDtoValidation = Joi.object({
    companyId: Joi
      .string()
      .optional()
      .messages({
        "any.type": "The company Id field must be a string.",
      }),

    status: Joi
      .string()
      .optional()
      .valid(...Object.values(JobStatusEnum))
      .messages({
        "any.only": `The Status field must be one of the allowed values i.e. ${Object.values(JobStatusEnum).join(", ")} `,
      }),

    jobTitle: Joi
        .string()
        .min(1)
        .lowercase()
        .optional()
        .messages({
          'string.min': 'The Job title field must not be empty.',
          "any.type": "The Job title field must be a string.",
        }),

    jobDescription: Joi
        .string()
        .optional()
        .messages({
          "any.type": "The jobDescription field must be a string.",
        }),

    htmlJobDescription: Joi
        .string()
        .optional()
        .messages({
          "any.type": "The htmlJobDescription field must be a string.",
        }),

    otherRequirements: Joi
        .string()
        .allow('')
        .optional(),

    // Validate experienceRange field
    experienceRange: Joi.object({
        min: Joi.number()
            .integer()
            .min(0)
            .optional()
            .messages({
                'number.base': 'The Minimum experience field must be a number.',
                'number.min': 'The Minimum experience field must be a positive integer.'
            }),
        max: Joi.number()
            .integer()
            .min(Joi.ref('min')) // Ensure max is greater than or equal to min
            .optional()
            .messages({
                'number.base': 'The Maximum experience field must be a number.',
                'number.min': 'The Maximum experience field cannot be less than minimum experience.'
            })
    }).optional(),


    noticePeriod: Joi
        .number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'The Notice period field must be a number.',
            'number.min': 'The Notice period field must be a positive integer.',
        }),

    numOfOpenings: Joi
        .number()
        .integer()
        .min(1)
        .optional()
        .messages({
            'number.base': 'The Number of openings field must be a number.',
            'number.min': 'The Number of openings field must be a positive integer.',
        }),

    // Validate salaryRange field
    salaryRange: Joi.object({
        min: Joi.number()
            .min(0)
            .optional()
            .messages({
                "number.base": "The Minimum salary field must be a number.",
                "number.min": "The Minimum salary field cannot be negative.",
            }),
        max: Joi.number()
            .min(Joi.ref('min')) // Ensure max is greater than or equal to min
            .optional()
            .messages({
                "number.base": "The Maximum salary field must be a number.",
                "number.min": "The Maximum salary field cannot be less than minimum salary.",
            })
    }).optional(),

    department: Joi
        .string()
        .min(1)
        .lowercase()
        .optional()
        .messages({
            'string.min': 'The Department field must not be empty.',
        }),

    location: Joi.object({
      city: Joi.array()
        .items(Joi.string().lowercase())
        .optional()
        .messages({
          'array.base': 'The City field must be an array of strings.',
          'string.base': 'Each item in the City field must be a string.',
        }),
      state: Joi.array()
        .items(Joi.string().lowercase())
        .optional()
        .messages({
          'array.base': 'The State field must be an array of strings.',
          'string.base': 'Each item in the State field must be a string.',
        }),
      country: Joi.array()
        .items(Joi.string().lowercase())
        .optional()
        .messages({
          'array.base': 'The Country field must be an array of strings.',
          'string.base': 'Each item in the Country field must be a string.',
        }),
      fullLocation: Joi.array()
        .items(Joi.string().lowercase())
        .optional()
        .messages({
          'array.base': 'The Full Location field must be an array of strings.',
          'string.base': 'Each item in the Full Location field must be a string.',
        }),
      })
    .optional()
    .messages({
      'object.base': 'The Location field must be an object.',
    }),

    workMode: Joi
        .string()
        .optional()
        .valid(...Object.values(JobWorkModeEnum))
        .messages({
            "any.only": `The Work mode field must be one of the allowed values i.e. ${Object.values(JobWorkModeEnum).join(", ")}.`,
        }),

    typeofEmployment: Joi
      .string()
      .uppercase()
      .optional()
      .messages({
        "string.base": "The Type of employment field must be a string.",
      }),

    coreSkills: Joi
        .array()
        .min(1)
        .items(Joi.string().lowercase())
        .optional()
        .messages({
            'array.min': 'At least one core skill is required.',
        }),

    softSkills: Joi
        .array()
        .min(1)
        .items(Joi.string().lowercase())
        .optional()
        .messages({
            'array.min': 'At least one soft skill is required.',
        }),

    technicalSkills: Joi
        .array()
        .min(1)
        .items(Joi.string().lowercase())
        .optional()
        .messages({
            'array.min': 'At least one technical skill is required.',
        }),

    miscellaneousSkills: Joi
        .array()
        .allow('')
        .items(Joi.string().lowercase())
        .optional()
        .messages({
            "array.base": "MiscellaneousSkills skills must be an array.",
        }),
      
    displaySalaryRange: Joi
        .boolean()
        .optional()
        .messages({
            'boolean.base': 'The Display salary range field must be a boolean.',
        }),

});

/**
 * jobUpdateApiDtoValidation
 */
export const jobSoftDeleteApiDtoValidation = Joi.object({
  companyId: Joi
  .string()
  .required()
  .messages({
    'string.base': 'The Company Id field must be a string.',
    'string.empty': 'The Company Id field cannot be empty.',
    'any.required': 'The Company Id field is required.',
  }),
});

/**
 * jobBulkUpdateApiDtoValidation
 */
export const jobBulkUpdateApiDtoValidation = Joi.object({
  bulkJobUpdate: Joi.array()
    .min(APP_CONSTANTS.BULK_JOB_UPDATE_LIMIT.MIN)
    .max(APP_CONSTANTS.BULK_JOB_UPDATE_LIMIT.MAX)
    .items(
      Joi.object({
        jobId: Joi.string().required().messages({
          "string.base": "The Job Id field must be a string.",
          "string.empty": "The Job Id field cannot be empty.",
          "any.required": "The Job Id field is required.",
        }),

        companyId: Joi.string().required().messages({
          "string.base": "The Company Id field must be a string.",
          "string.empty": "The Company Id field cannot be empty.",
          "any.required": "The Company Id field is required.",
        }),

        status: Joi.string()
          .required()
          .valid(...Object.values(JobStatusEnum))
          .messages({
            "any.required": "The Status field is required.",
            "any.only": `The Status field must be one of the allowed values  i.e. ${Object.values(
              JobStatusEnum
            ).join(", ")} `,
          }),
      })
    )
    .required()
    .messages({
      "array.base": "The Bulk Job Update field must be an array.",
      "array.empty": "The Bulk Job Update field cannot be empty.",
      "any.required": "The Bulk Job Update field is required.",
      "array.min": `Atleast ${APP_CONSTANTS.BULK_JOB_UPDATE_LIMIT.MIN} job updates are required.`,
      "array.max": `Atmost ${APP_CONSTANTS.BULK_JOB_UPDATE_LIMIT.MAX} job updates are allowed.`,
    }),
});