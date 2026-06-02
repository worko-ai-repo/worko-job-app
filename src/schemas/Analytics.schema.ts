// Import Joi for validation
import Joi from "joi";

// Import enums
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { RequestEvaluationDashboardTypeEnum } from "../enums/RequestEvaluation.enum";

// import schemas
import { commonSchema } from "../schemas/Common.schema";

const DATE_RANGE_VALUES = ["7d", "30d", "90d", "180d"] as const;

const JOB_STATUS_FILTER_VALUES = ["ALL", "PUBLISHED"] as const;

/**
 * analyticsFunnelVelocityAggregateQueryValidation
 *
 * Validation schema for aggregated `/analytics/funnel-velocity` query parameters.
 */
export const analyticsFunnelVelocityAggregateQueryValidation = Joi.object({
  companyId: Joi.string().empty("undefined").optional(),
  recruiterId: Joi.string().empty("undefined").optional(),
  jobIds: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()),
      Joi.string() // Comma-separated list
    )
    .optional(),
  dateRange: Joi.string()
    .valid(...DATE_RANGE_VALUES)
    .default("30d"),
  jobStatus: Joi.string()
    .valid(...JOB_STATUS_FILTER_VALUES)
    .default("ALL"),
});

/**
 * analyticsOnboardingPipelineQueryValidation
 *
 * Validation schema for `/analytics/onboarding-pipeline` query parameters.
 */
export const analyticsOnboardingPipelineQueryValidation = Joi.object({
  companyId: Joi.string().empty("undefined").optional(),
  recruiterId: Joi.string().empty("undefined").optional(),
  jobId: Joi.string().empty("undefined").optional(),
  status: Joi.string()
    .valid(JobApplicationStatus.HIRED, JobApplicationStatus.JOINED)
    .optional(),
  includeDetails: Joi.boolean().optional(),
  dateRange: Joi.string()
    .valid(...DATE_RANGE_VALUES)
    .default("30d"),
  jobStatus: Joi.string()
    .valid(...JOB_STATUS_FILTER_VALUES)
    .default("ALL"),
});

/**
 * analyticsDropoffQueryValidation
 *
 * Validation schema for `/analytics/dropoff` query parameters.
 */
export const analyticsDropoffQueryValidation = Joi.object({
  companyId: Joi.string().empty("undefined").optional(),
  recruiterId: Joi.string().empty("undefined").optional(),
  jobId: Joi.string().empty("undefined").optional(),
  dateRange: Joi.string()
    .valid(...DATE_RANGE_VALUES)
    .default("30d"),
  jobStatus: Joi.string()
    .valid(...JOB_STATUS_FILTER_VALUES)
    .default("ALL"),
  topN: Joi.number().integer().min(1).optional(),
});


/**
 * analyticsHiringTrendQueryValidation
 *
 * Validation schema for `/analytics/hiring-trend` query parameters.
 */
export const analyticsHiringTrendQueryValidation = Joi.object({
  companyId: Joi.string().empty("undefined").optional(),
  recruiterId: Joi.string().empty("undefined").optional(),
  /**
   * granularity
   *
   * Determines how data points are grouped for the line graph.
   * Supported values: daily, weekly, monthly
   */
  granularity: Joi.string()
    .valid("daily", "weekly", "monthly")
    .optional(),
  /**
   * dateRange
   *
   * Supported values:
   * - 7d, 30d, 90d, 180d
   */
  dateRange: Joi.string()
    .valid(...DATE_RANGE_VALUES)
    .default("30d"),
  jobStatus: Joi.string()
    .valid(...JOB_STATUS_FILTER_VALUES)
    .default("ALL"),
});

export const analyticsRequestEvaluationCompanyFilterValidation = commonSchema.concat(
  Joi.object({
    evaluatorEmail: Joi.string().email().optional().allow("", null).lowercase().messages({
      "string.email": "Evaluator email must be a valid email address",
    }),
    jobApplicationId: Joi.string().optional().allow("", null).messages({
      "string.base": "Job Application ID must be a string",
    }),
    evaluationRequesterAdminUserId: Joi.string().optional().allow("", null).messages({
      "string.base": "Evaluation Requester Admin User ID must be a string",
    }),
    evaluationRequesterCorporateUserId: Joi.string().optional().allow("", null).messages({
      "string.base": "Evaluation Requester Corporate User ID must be a string",
    }),
    dashboardType: Joi.string()
      .valid(...Object.values(RequestEvaluationDashboardTypeEnum))
      .optional()
      .allow("", null)
      .messages({
        "any.only": `Dashboard type must be one of: ${Object.values(RequestEvaluationDashboardTypeEnum).join(", ")}`,
      }),
    companyId: Joi.string().required().messages({
      "any.required": "Company ID is required",
      "string.empty": "Company ID should not be empty",
    }),
  })
);

