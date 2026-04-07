import { BaseFirestoreModel } from "./Base.model";
import {
  JobApplicationInterviewAttendeeTypeEnum,
  JobApplicationInterviewProviderEnum,
  JobApplicationInterviewStatusEnum,
} from "../../enums/JobApplicationInterview.enum";

export interface JobApplicationInterviewAttendeeDto {
  type: JobApplicationInterviewAttendeeTypeEnum;
  email: string;
  name?: string;
  userId?: string; // present only for internal evaluator attendee
}

export interface JobApplicationInterviewOrganizerCompletionDto {
  rating: number; // 1-5
  feedback: string;
  submittedAt: string;
}

export interface JobApplicationInterviewCompletionFeedbackDto {
  rating: number; // 1-5
  feedback: string;
  submittedAt: string;
  submittedById?: string;
}

export interface DbJobApplicationInterviewDto extends BaseFirestoreModel {
  applicationId: string;
  jobId: string;
  companyId?: string;

  applicantEmail: string;
  applicantId?: string;
  applicantName?: string;

  organizerId: string;
  organizerEmail: string;

  interviewType: string;
  jobTitle: string;
  companyName: string;
  
  roundNumber: number;
  status: JobApplicationInterviewStatusEnum;

  scheduledAt: string;
  endAt: string;
  timezone: string;

  meetingProvider: JobApplicationInterviewProviderEnum;
  meetingLink: string;
  providerEventId: string;

  attendees: JobApplicationInterviewAttendeeDto[];

  completion: {
    organizer?: JobApplicationInterviewOrganizerCompletionDto;
    evaluators?: {
      [evaluatorId: string]: JobApplicationInterviewCompletionFeedbackDto;
    };
  };

  /**
   * Recruiter note shown to organizer/recruiter in emails.
   */
  recruiterNote?: string;

  /**
   * Rule of the candidate shown to organizer/recruiter in emails.
   */
  ruleForCandidate?: string;

  cancellationReason?: string;
  cancellationFeedback?: string;

  updatedByUserId?: string;
  updatedByCorporateUserId?: string;
}

