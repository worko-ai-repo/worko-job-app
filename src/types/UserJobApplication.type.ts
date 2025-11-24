// Import enums
import { CorporateUserTypeEnum } from "../enums/CorporateUser.enum";
import { UserType } from "../enums/User.enum";
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";
import { AdminRoleEnum } from "../enums/Common.enum";

// Import models
import { DbUserDetailDto } from "../db/models/UserDetail.model";
import { DbUserJobApplicationDto } from "../db/models/UserJobApplication.model";
import { DbInterviewDto } from "../db/models/UserInterview.model";

/**
 * JobApplicationUserType
 */
export type JobApplicationUserType =
  | CorporateUserTypeEnum
  | UserType
  | AdminRoleEnum;

/**
 * JobApplicationUserTypeWithAdmin
 */
export type JobApplicationUserTypeWithAdmin =
  | CorporateUserTypeEnum
  | AdminRoleEnum;

/**
 * JobApplicationStatusTrackerType
 */
export type JobApplicationStatusTrackerType = Array<{
  oldStatus: JobApplicationStatus;
  newStatus: JobApplicationStatus;

  /**
   * Sample value of `actionDate`: 2024-12-17T11:36:46.753+00:00
   */
  actionDate?: string;

  /**
   * NOTE: If the job application status is `REJECTED` due to low matching score,
   * then the `userId` and `userType` will be stored as `undefined`.
   */
  userId?: string;
  userType?: JobApplicationUserType;
}>;

/**
 * JobApplicationRejectedByUserIdType
 */
export type JobApplicationRejectedByUserIdType = {
  userId: string;
  userType?: JobApplicationUserTypeWithAdmin;

  /**
   * Sample value of `actionDate`: 2024-12-17T11:36:46.753+00:00
   */
  actionDate?: string;

  reason: string;
  userComment: string;
};

/**
 * JobApplicationFollowUpRequestType
 */
export type JobApplicationFollowUpRequestType = Array<{
  /**
   * Sample value of `actionDate`: 2024-12-17T11:36:46.753+00:00
   */
  actionDate?: string;
}>;

/**
 * JobApplicationWithUserDetailsType
 */
export type JobApplicationWithUserDetailsType = Partial<DbUserJobApplicationDto> & {
  jobUrl: string | undefined;
  jobTitle: string | undefined;
  jdExtracted: string | undefined;
} & {
  applicantDetails:
    | (Partial<DbUserDetailDto> & {
        profileImageAwsS3SignedUrl: string | null;
        cvAwsS3SignedUrl: string | null;
        /**
         * interviewDetails
         * 
         * Interview details associated with the applicant.
         * Only included when includeInterviewDetails flag is set to true.
         */
        interviewDetails?: DbInterviewDto[];
      })
    | undefined;
};

export type JobApplicationStatusType =
  | "APPLIED"
  | "REJECTED"
  | "HIRED"
  | "CV_DOWNLOADED"
  | "UNDER_EVALUATION"
  | "PROCESSING_INTERVIEW"
  | "INTERVIEW_DONE";
