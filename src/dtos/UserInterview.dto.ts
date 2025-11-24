// Import dtos
import { InterviewActorEnum, InterviewChunkUploadStatusType, InterviewStatusEnum } from "../enums/UserInterview.enum";
import { RecordListingFilterOptions, RecordListingFilterRequestDTO } from "./Common.dto";


/**
 * InterviewRequestCreateApiDTO
 *
 * DTO for creating an interview request. Used to track the payload for interviewController.requestInterview function.
 */
export interface InterviewRequestCreateApiDTO {
  candidateEmail: string;
  candidateFullName?: string;
  companyName: string;
  requesterUserName: string;
  companyId: string;
  jobId: string;
  position: string;
  requestedByActor: InterviewActorEnum;
}

/**
 * InterviewInitiateApiDTO
 *
 * DTO for initiating an interview session. Used to track the payload for interviewController.initiateInterview function.
 */
export interface InterviewInitiateApiDTO {
  candidateEmail: string;
}

/**
 * InterviewRequestedByDto
 * 
 * DTO representing the details of the requester for an interview.
 */
export interface InterviewRequestedByDto {
  corporateUserId: string;
  requesterUserName: string;
  companyName: string;
  companyId: string;
  position: string;
  jobId: string;
  requestedByActor: InterviewActorEnum;
  requestedAt: string;
}

/**
 * InterviewHistoryEntryDto
 *
 * DTO representing a single entry in the interview history from DbInterview modal schema.
 */
export interface InterviewHistoryEntryDto {
  questionId: string;
  questionText: string;
  userAnswer: string;
  feedback: string;
  detailedFeedback?: string;
  isCorrect: boolean;
  timeTaken: number;
  chunkId: string;
  chunkUploadStatus: InterviewChunkUploadStatusType;
  chunkFileMimeType: string;
}

/**
 * InterviewScoreBreakdownDto
 *
 * DTO representing a record of detailed score breakdown for an interview.
 */
export interface InterviewScoreBreakdownDto {
  confidence?: number;
  attitude?: number;
  domainExpertise?: number;
  communication_skills?: number;
  [key: string]: any;
}

/**
 * InterviewFeedbackGenerationApiDTO
 *
 * DTO for generating feedback for an interview question. Used to track the payload for interviewController.provideFeedback fnction.
 */
export interface InterviewFeedbackGenerationApiDTO {
  email: string;
  interviewHistory: InterviewHistoryEntryDto;
}

/**
 * InterviewCompletionApiDTO
 *
 * DTO for completing an interview session. Used to track the payload for interviewController.completeInterview function.
 */
export interface InterviewFilterOptions extends RecordListingFilterOptions {
  email?: string;
  status?: InterviewStatusEnum;
  companyId?: string;
}

/**
 * InterviewFilterRequestDTO
 *
 * DTO for filtering interview records in listing requests.
 */
export interface InterviewFilterRequestDTO extends RecordListingFilterRequestDTO {
  email?: string;
  status?: InterviewStatusEnum;
  companyId?: string;
}


