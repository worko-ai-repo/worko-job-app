// Import DTOs
import {
  GcpFirestoreRecordListingFilterOptions,
  GcpFirestoreRecordListingFilterRequestDTO,
} from "./Common.gcp-firestore.dto";

// Import enums
import { JobApplicationInterviewAttendeeTypeEnum, JobApplicationInterviewStatusEnum } from "../enums/JobApplicationInterview.enum";

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
   * title
   *
   * Backward compatible field (if any older client still sends it).
   * Not used for email title generation.
   */
  title: string;
  description?: string;
  /**
   * Recruiter note shown to the evalueators in dashboard (provided by organizer).
   */
  recruiterNote?: string;

  /**
   * Rule of the candidate shown to the recruiter in emails (provided by organizer).
   */
  ruleForCandidate?: string;
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
  title: string;
  description?: string;
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

