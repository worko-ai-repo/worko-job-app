// Import npm packages
import Joi from "joi";

// Import enums
import { JobApplicationInterviewAttendeeTypeEnum, JobApplicationInterviewStatusEnum } from "../enums/JobApplicationInterview.enum";

// Import schemas
import { gcpFirestoreCommonSchema } from "./Common.gcp-firestore.schema";

/**
 * attendeeValidation
 *
 * Validation schema for a single interview attendee object.
 */
const attendeeValidation = Joi.object({
  type: Joi.string()
    .valid(...Object.values(JobApplicationInterviewAttendeeTypeEnum))
    .required()
    .messages({
      "any.required": "Attendee type is required",
      "any.only": "Attendee type is invalid",
      "string.empty": "Attendee type should not be empty",
    }),
  email: Joi.string().email().required().lowercase().messages({
    "any.required": "Attendee email is required",
    "string.email": "Attendee email must be a valid email address",
    "string.empty": "Attendee email should not be empty",
  }),
  name: Joi.string().optional().allow(""),
  userId: Joi.alternatives()
    .conditional("type", {
      is: JobApplicationInterviewAttendeeTypeEnum.EVALUATOR,
      then: Joi.string().required().messages({
        "any.required": "Evaluator userId is required for evaluator attendees",
        "string.empty": "Evaluator userId should not be empty",
      }),
      otherwise: Joi.string().optional().allow(""),
    })
    .messages({}),
});

/**
 * jobApplicationInterviewScheduleValidation
 *
 * Validation schema for scheduling interview round.
 */
export const jobApplicationInterviewScheduleValidation = Joi.object({
  interviewType: Joi.string().required().messages({
    "any.required": "Interview type is required",
    "string.empty": "Interview type should not be empty",
  }),
  jobTitle: Joi.string().required().messages({
    "any.required": "Job title is required",
    "string.empty": "Job title should not be empty",
  }),
  companyName: Joi.string().required().messages({
    "any.required": "Company name is required",
    "string.empty": "Company name should not be empty",
  }),
  recruiterNote: Joi.string().optional().allow(""),
  ruleForCandidate: Joi.string().optional().allow(""),
  startTime: Joi.string().isoDate().required().messages({
    "any.required": "Start time is required",
    "string.isoDate": "Start time must be a valid ISO date",
    "string.empty": "Start time should not be empty",
  }),
  endTime: Joi.string().isoDate().required().messages({
    "any.required": "End time is required",
    "string.isoDate": "End time must be a valid ISO date",
    "string.empty": "End time should not be empty",
  }),
  attendees: Joi.array().items(attendeeValidation).optional(),
});

/**
 * jobApplicationInterviewRescheduleValidation
 *
 * Validation schema for rescheduling interview round.
 */
export const jobApplicationInterviewRescheduleValidation = Joi.object({
  startTime: Joi.string().isoDate().required().messages({
    "any.required": "Start time is required",
    "string.isoDate": "Start time must be a valid ISO date",
    "string.empty": "Start time should not be empty",
  }),
  endTime: Joi.string().isoDate().required().messages({
    "any.required": "End time is required",
    "string.isoDate": "End time must be a valid ISO date",
    "string.empty": "End time should not be empty",
  }),
});

/**
 * jobApplicationInterviewCancelValidation
 *
 * Validation schema for cancelling interview round.
 */
export const jobApplicationInterviewCancelValidation = Joi.object({
  cancellationReason: Joi.string().required().messages({
    "any.required": "Cancellation reason is required",
    "string.empty": "Cancellation reason should not be empty",
  }),
  cancellationFeedback: Joi.string().optional().allow(""),
});

/**
 * jobApplicationInterviewCompleteValidation
 *
 * Validation schema for completing interview round.
 */
export const jobApplicationInterviewCompleteValidation = Joi.object({
  organizer: Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Rating is required",
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
    feedback: Joi.string().required().messages({
      "any.required": "Feedback is required",
      "string.empty": "Feedback should not be empty",
    }),
  })
    .required()
    .messages({
      "any.required": "Organizer completion is required",
    }),
});

/**
 * jobApplicationInterviewFilterValidation
 *
 * Validation schema for interview round listing query options.
 */
export const jobApplicationInterviewFilterValidation = gcpFirestoreCommonSchema.concat(
  Joi.object({
    status: Joi.string()
      .valid(...Object.values(JobApplicationInterviewStatusEnum))
      .optional()
      .allow(""),
    applicationId: Joi.string().optional().allow(""),
  })
);

