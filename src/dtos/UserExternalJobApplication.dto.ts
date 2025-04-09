
// Import enums
import { UserExternalJobApplicationStatusEnum } from "../enums/UserExternalJobApplication.enum";

// Import types
import { UserExternalJobApplicationStatusTrackerType } from "../types/UserExternalJobApplication.type";

/**
 * UserExternalJobApplicationCreateApiDTO
 */
export interface UserExternalJobApplicationCreateApiDTO {
  jobId: string;
  jobUrl: string; // Note: This should be the worko job url, not the external job url
  jobPortal?: string;
  matchingScore?: number
}

/**
 * UserExternalJobApplicationCreateDto
 */
export interface UserExternalJobApplicationCreateDto {
  jobId: string;
  applicantUserId: string;
  status: UserExternalJobApplicationStatusEnum;
  statusTracker: UserExternalJobApplicationStatusTrackerType;
  companyName?: string;
  jobPortal?: string;
  cvExtract?: string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  matchingScore?: number;
  rejectionFeedbackBySystem?: string;
  scoreDetails?: string;
  scoreFetchedDate?: string;
}
