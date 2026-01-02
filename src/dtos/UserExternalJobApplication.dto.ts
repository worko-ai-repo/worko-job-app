
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
  /**
   * @reference
   *  1. "jobUrl" field of `GcpFirestoreJob.model.ts`
   * @example "https://www.linkedin.com/jobs/view/test-engineer-at-bajaj-finserv-4292597143?_l=en"
   */
  externalJobUrl?: string;

  /**
   * @reference "externalJobId" field of `GcpFirestoreJob.model.ts`
   * @example "1357943872"
   */
  externalJobId?: string;
  applicantUserId: string;
  status: UserExternalJobApplicationStatusEnum;
  statusTracker: UserExternalJobApplicationStatusTrackerType;
  companyName?: string;
  jobPortal?: string;
  matchingScore?: number;
}
