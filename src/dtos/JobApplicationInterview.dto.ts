// Import DTOs
import {
  GcpFirestoreRecordListingFilterOptions,
  GcpFirestoreRecordListingFilterRequestDTO,
} from "./Common.gcp-firestore.dto";

// Import enums
import {
  JobApplicationInterviewAttendeeTypeEnum,
  JobApplicationInterviewStatusEnum,
} from "../enums/JobApplicationInterview.enum";

/**
 * JobApplicationInterviewAttendeeApiDto
 *
 * Attendee details provided from API.
 */
export interface JobApplicationInterviewAttendeeApiDto {
  type: JobApplicationInterviewAttendeeTypeEnum;
  email: string;
  name?: string;
  userId?: string;
}

/**
 * JobApplicationInterviewScheduleApiDto
 *
 * Payload for scheduling a new interview round.
 */
export interface JobApplicationInterviewScheduleApiDto {
  /**
   * organizerEmail
   *
   * Used only for email subject/body/title text. Not tied to Meet space creation.
   */
  organizerEmail: string;
  
  /**
   * interviewType
   *
   * Example: "Technical Interview", "HR Round", "System Design Round"
   */
  interviewType: string;

  /**
   * jobTitle
   *
   * Used only for email subject/body/title text.
   */
  jobTitle: string;

  /**
   * companyName
   *
   * Used only for email subject/body/title text.
   */
  companyName: string;

  /**
   * Recruiter note shown to evaluator dashboard (organizer).
   */
  recruiterNote?: string;

  /**
   * Rule for the candidate (included in candidate emails).
   */
  ruleForCandidate?: string;

  /**
   * Interview start (ISO date-time); shown in emails. Not tied to Meet space creation.
   */
  startTime: string;
  endTime: string;
  attendees?: JobApplicationInterviewAttendeeApiDto[];
}

/**
 * JobApplicationInterviewRescheduleApiDto
 *
 * Payload for rescheduling an existing interview round.
 */
export interface JobApplicationInterviewRescheduleApiDto {
  /**
   * New start time (ISO date-time); shown in emails only.
   */
  startTime: string;
  endTime: string;
}

/**
 * JobApplicationInterviewCancelApiDto
 *
 * Payload for cancelling an interview round.
 */
export interface JobApplicationInterviewCancelApiDto {
  cancellationReason: string;
  cancellationFeedback?: string;
}

/**
 * JobApplicationInterviewCompleteOrganizerFeedbackApiDto
 *
 * Organizer completion details.
 */
export interface JobApplicationInterviewCompleteOrganizerFeedbackApiDto {
  rating: number;
  feedback: string;
}

/**
 * JobApplicationInterviewCompleteApiDto
 *
 * Payload for marking interview as completed.
 */
export interface JobApplicationInterviewCompleteApiDto {
  organizer: JobApplicationInterviewCompleteOrganizerFeedbackApiDto;
}

/**
 * JobApplicationInterviewListFilterRequestDto
 *
 * Query params from API for listing interview rounds.
 */
export interface JobApplicationInterviewListFilterRequestDto
  extends GcpFirestoreRecordListingFilterRequestDTO {
  status?: JobApplicationInterviewStatusEnum;
  applicationId?: string;
}

/**
 * JobApplicationInterviewListFilterOptions
 *
 * Parsed filter options for listing interview rounds.
 */
export interface JobApplicationInterviewListFilterOptions
  extends GcpFirestoreRecordListingFilterOptions {
  status?: JobApplicationInterviewStatusEnum;
  applicationId?: string;
}
