
// import dtos
import { RecordListingFilterOptions, RecordListingFilterRequestDTO } from "./Common.dto";

// import enums
import { JobApplicationStatus, UserJobApplicationDocumentStatusEnum } from "../enums/UserJobApplication.enum";
import { UserType } from "../enums/User.enum";

// import types
import { JobApplicationFollowUpRequestType, JobApplicationRejectedByUserIdType, JobApplicationStatusTrackerType, JobApplicationUserType, JobApplicationUserTypeWithAdmin } from "../types/UserJobApplication.type";

/**
 * UserJobApplicationCreateApiDTO
 * 
 * Data required from the API to create a user's job application.
 * Focuses on the essentials needed to initiate the request.
 */
export interface UserJobApplicationCreateApiDTO {
  /**
   * jobId
   * 
   * @reference `id` attribute of `CompanyJob.model.ts`
   */
  jobId: string;

  /**
   * companyName
   */
  companyName: string;

  /**
   * jobPortal
   */
  jobPortal?: string;

  /**
   * matchingScore
   */
  matchingScore?: number;

  /**
   * referAndEarnId
   * 
   * @reference `id` attribute of `ReferAndEarn.model.ts`
   */
  referAndEarnId?: string;
}

export interface UserJobApplicationCreateDto extends UserJobApplicationCreateApiDTO {
  companyId: string;
  status: JobApplicationStatus;
  statusTracker: JobApplicationStatusTrackerType;
}

/**
 * UserJobApplicationListingFilterOptions
 *
 * It is similar to "UserJobApplicationListingFilterRequestDTO" but `UserJobApplicationListingFilterOptions` would be used in the backend to perform business logic.
 */
export interface UserJobApplicationListingFilterOptions extends RecordListingFilterOptions {
  status?: JobApplicationStatus,
  jobId?: string, // Job ID of the posted job 
  companyId?: string,
  userEmail?: string,
  userType?: JobApplicationUserType,
  referAndEarnId?: string;
  /**
   * includeInterviewDetails
   * 
   * Flag to include interview details along with user details in job application response.
   * Default: false - Existing entities are not affected
   */
  includeInterviewDetails?: boolean;

  /**
   * updatedAtFromDate
   *
   * When provided, filters applications whose `updatedAt` is greater than
   * or equal to this timestamp (in milliseconds).
   */
  updatedAtFromDate?: number;

  /**
   * updatedAtToDate
   *
   * When provided, filters applications whose `updatedAt` is less than
   * or equal to this timestamp (in milliseconds).
   */
  updatedAtToDate?: number;
}

/**
 * UserJobApplicationListingFilterRequestDTO
 * 
 * It is similar to "UserJobApplicationListingFilterOptions" but `UserJobApplicationListingFilterRequestDTO` will come from the request payload(From frontend)
 */
export interface UserJobApplicationListingFilterRequestDTO extends RecordListingFilterRequestDTO {
  status?: JobApplicationStatus,
  jobId?: string, // Job ID of the posted job 
  companyId?: string,
  userEmail?: string,
  userType?: JobApplicationUserType,
  referAndEarnId?: string;
  /**
   * includeInterviewDetails
   * 
   * Flag to include interview details along with user details in job application response.
   * Default: false - Existing entities are not affected
   */
  includeInterviewDetails?: boolean;

  /**
   * updatedAtFromDate
   *
   * When provided, filters applications whose `updatedAt` is greater than
   * or equal to this timestamp (in milliseconds).
   */
  updatedAtFromDate?: number;

  /**
   * updatedAtToDate
   *
   * When provided, filters applications whose `updatedAt` is less than
   * or equal to this timestamp (in milliseconds).
   */
  updatedAtToDate?: number;
}

/**
 * UserJobApplicationUpdateApiDTO
 * 
 * Data required from the API to update a user's job application.
 * NOTE: This Comes from the request body of the API i.e from the frontend
 */
export interface UserJobApplicationUpdateApiDTO {
  // Details of the corporateUser or worko-admin
  userId: string; // The ID of the corporateUser or worko-admin
  emailId: string; // The email ID of the corporateUser or worko-admin
  userType: JobApplicationUserTypeWithAdmin;

  // New status of the job application
  status: JobApplicationStatus;

  // Requested documents from applicant
  requestedDocumentNames?: string[]; // ["Internship certificate", "Btech certificate"]

  offerLetterCloudFileName?: string;
  offerLetterRemarks?: string;
  offerLetterJoiningDate?: string;

  /**
   * joiningDate
   *
   * @example "2024-10-11T08:01:52.193Z"
   */
  joiningDate?: string;

  // Reason and comment for rejection
  reason?: string;
  userComment?: string;

  /**
   * applicantName
   *
   * @reference `name` attribute of `UserDetail.model.ts`
   *
   * @description We use this name for email notifications
   */
  applicantName: string;
}

/**
 * UserJobApplicationInternalUpdateDto
 * 
 * Data required from the API to update a user's job application.
 * NOTE: This is an internal update interface which would be used in the backend.
 */
export interface UserJobApplicationInternalUpdateDto {
  status: JobApplicationStatus;
  rejectedByUserId?: JobApplicationRejectedByUserIdType;
  statusTracker: JobApplicationStatusTrackerType;
  requestedDocumentDetails?: UserJobApplicationDbRequestedDocumentDetailDto[];
  documentCurrentStatusMap?: Record<string, UserJobApplicationDocumentStatusEnum>;
  responseDocumentDetails?: UserJobApplicationDbResponseDocumentDetailDto[];
  offerLetterDetails?: UserJobApplicationDbOfferLetterDetailDto[];
  joiningDateDetails?: UserJobApplicationDbJoinedDateDetailDto[];
  /**
   * @reference `id` attribute of `AgencyUserSubmission.model.ts`
   */
  agencyUserSubmissionId?: string;
  candidateParsedCvId?: string;
}

/**
 * UserJobApplicationRequestFeedbackApiDTO
 * 
 * Data required from the API to request feedback on a user's job application.
 */
export interface UserJobApplicationRequestFeedbackApiDTO {
  /**
   * applicationDate
   *
   * Sample value of `applicationDate`: 2024-12-17T11:36:46.753+00:00
   */
  applicationDate: string;
}

/**
 * UserJobApplicationDisplayToCorporateApiDTO
 * 
 * Data required from the API to display a user's job application to a corporate user.
 */
export interface UserJobApplicationDisplayToCorporateApiDTO {
  displayToCorporate: boolean;
}

/**
 * UserJobApplicationBulkUploadDto
 */
export interface UserJobApplicationBulkUploadDto {
  createdAt: number;
  updatedAt: number;
  PK: string;
  SK: string;
  // Ids
  id: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;

  // references
  companyId: string;
  jobId: string;

  status: JobApplicationStatus;
  statusTracker: JobApplicationStatusTrackerType;
  companyName: string;
  // jobUrl: string;
  // jobTitle: string;
  // jdExtracted: string;
  jobPortal?: string;

  /**
   * When corporate user rejects the job application then
   * this attribute will be set along with other attributes
   */
  rejectedByUserId?: JobApplicationRejectedByUserIdType;

  /**
   * When candidate request follow up then this attribute will be set
   */
  followUpRequest?: JobApplicationFollowUpRequestType;

  /**
   * Attributes Being set after comparing `Job description` and `CV`
   * from `Python script` by Automation Architect Team
   */
  cvExtract?: string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  matchingScore?: number;
  rejectionFeedbackBySystem?: string;
  scoreDetails?: string;
  scoreFetchedDate?: string;
}

/**
 * UserJobApplicationHiredFromOtherPortalApiDTO
 */
export interface UserJobApplicationHiredFromOtherPortalApiDTO {
  hiredFromOtherPortal: UserJobApplicationHiredFromOtherPortal;
}

/**
 * UserJobApplicationHiredFromOtherPortalDTO
 */
export interface UserJobApplicationHiredFromOtherPortalDTO extends UserJobApplicationHiredFromOtherPortalApiDTO {
  updatedByUserId?: string;
  updatedByCorporateUserId?: string;
}

/**
 * UserJobApplicationHiredFromOtherPortal
 * 
 * @reference "UserJobApplicationModel . hiredFromOtherPortal"
 */
export interface UserJobApplicationHiredFromOtherPortal {
  /**
   * portal
   *
   * Name of the external portal from which the candidate was hired.
   *
   * @example "LinkedIn"
   */
  portal: string;

  /**
   * date
   *
   * The date and time when the candidate was hired or recruitement process started from the external portal.
   *
   * @example "2024-12-17T11:36:46.753"
   */
  date: string;
}

/**
 * UserJobApplicationCommonUpdateDto
 */
export interface UserJobApplicationCommonUpdateDto {
  rejectionBlacklistedAwsScheduleId: string;
  rejectionAwsScheduleId: string;
  status: JobApplicationStatus;
  statusTracker: JobApplicationStatusTrackerType;
  isEvaluatorResponded: boolean;
  responseDocumentDetails: UserJobApplicationDbResponseDocumentDetailDto[];
  documentCurrentMapping: Record<string, string>;
  documentCurrentStatusMap: Record<string, UserJobApplicationDocumentStatusEnum>;
  offerLetterIssueRaisedDetails: UserJobApplicationDbOfferLetterIssueRaisedDetailDto[];
  joiningDateDetails: UserJobApplicationDbJoinedDateDetailDto[];
  rejectedForJobClose: UserJobApplicationDbRejectedForJobClose;
  isFindMatchingScoreInProgress: boolean;
  latestInterviewRoundId?: string;
  interviewRoundCount?: number;
  activeInterviewRoundId?: string;
}

/**
 * UserJobApplicationBulkUpdateApiDTO
 */
export interface UserJobApplicationBulkUpdateApiDTO {
  bulkJobApplicationUpdate: {
    emailId: string;
    jobApplicationId: string;

    // New status to be updated
    status: JobApplicationStatus;

    oldStatus: JobApplicationStatus;

    /**
     * oldStatusTracker
     * 
     * @description
     * 1. Whenever the job application is updated by the `corporate-recruiter/admin` or `worko-admin` then
     * we should update "statusTracker" attribute as well,
     * so we should preserve the previous status tracker and append the new status tracker to it.
     * 
     * 2. The reason we are asking the previous status tracker in the request payload is because
     * to save the "get job application by ids" in backend.
     */
    oldStatusTracker: JobApplicationStatusTrackerType;

    userType: JobApplicationUserTypeWithAdmin;

    /**
     * applicantName
     *
     * @reference `name` attribute of `UserDetail.model.ts`
     *
     * @description We use this name for email notifications
     */
    applicantName: string;
  }[];
}

/**
 * UserJobApplicationDbRequestedDocumentDetailDto
 * 
 * @reference `requestedDocumentDetails` attribute from `UserJobApplication.model.ts`
 */
export interface UserJobApplicationDbRequestedDocumentDetailDto {
  userId: string; // `id` of the user who requested the document
  userType: JobApplicationUserTypeWithAdmin; // `userType` of the user who requested the document
  actionDate: string; // date when the document was requested
  requestedDocumentNames: string[]; // ["Internship certificate", "Btech certificate"]
  documentStatus: UserJobApplicationDocumentStatusEnum; // Type of document request
};

export interface UserJobApplicationDocumentMappingDto {
  /**
   * documentName
   * 
   * @description File name requested by worko-admin or corporate-admin
   */
  documentName: string;

  /**
   * cloudFileName
   * 
   * @description `s3` file name
   */
  cloudFileName: string;
}

/**
 * UserJobApplicationDbResponseDocumentDetailDto
 * 
 * @reference `responseDocumentDetails` attribute from `UserJobApplication.model.ts`
 */
export interface UserJobApplicationDbResponseDocumentDetailDto {
  userId: string;
  userType: UserType;
  actionDate: string;
  documentStatus: UserJobApplicationDocumentStatusEnum; // Type of document response
  documentMapping: UserJobApplicationDocumentMappingDto[]; // Maps document name to cloud file name
};

/**
 * UserJobApplicationApplicantUpdateApiDTO
 */
export interface UserJobApplicationApplicantUpdateApiDTO {
  userId: string; // The ID of the applicant
  emailId: string; // The email ID of the applicant
  userType: UserType;
  status: JobApplicationStatus;

  // Whenever `applicant` successfully uploads the documents requested by worko-admin or corporate-admin to s3 then this attribute will be set
  documentMapping?: UserJobApplicationDocumentMappingDto[];

  /**
   * offerLetterIssueRemarks and offerLetterCloudFileName are used when the `applicant` raises an issue with the offer letter
   */
  offerLetterIssueRemarks?: string;
  offerLetterCloudFileName?: string;

  /**
   * joiningDate
   *
   * @example "2024-10-11T08:01:52.193Z"
   */
  joiningDate?: string;
  /**
   * `hr` may be `worko-admin` or `corporate-admin/recruiter`
   */
  joiningHrName?: string;
  joiningApplicantMessage?: string;

  /**
   * applicantName
   *
   * @reference `name` attribute of `UserDetail.model.ts`
   *
   * @description We use this name for email notifications
   */
  applicantName: string;
}

/**
 * UserJobApplicationDbOfferLetterDetailDto
 */
export interface UserJobApplicationDbOfferLetterDetailDto {
  userId: string;
  userType: JobApplicationUserTypeWithAdmin;
  actionDate: string;
  joiningDate?: string;
  cloudFileName?: string;
  remarks?: string;
}

/**
 * UserJobApplicationDbOfferLetterIssueRaisedDetailDto
 */
export interface UserJobApplicationDbOfferLetterIssueRaisedDetailDto {
  userId: string;
  userType: UserType;
  actionDate: string;
  cloudFileName: string; // s3 file name for which the issue was raised
  remarks: string;
}

/**
 * UserJobApplicationDbJoinedDateDetailDto
 * 
 * 1. If corporate-admin/recruiter or worko-admin clicks `joined` button before candidate clicks then only `joiningDate` will be present
 * 2. If candidate clicks `I have joined` button before corporate-admin/recruiter or worko-admin clicks then `joiningDate`, `hr` details will also be present
 */
export interface UserJobApplicationDbJoinedDateDetailDto {
  /**
   * joiningDate
   *
   * @example "2024-10-11T08:01:52.193Z"
   */
  joiningDate: string;

  /**
   * `hr` may be `worko-admin` or `corporate-admin/recruiter`
   */
  hrName?: string;

  message?: string;

  actionByUserId: string;
  actionByUserType: JobApplicationUserType;
  actionDate: string;
}

export interface UserJobApplicationDbRejectedForJobClose {
  userId?: string;
  userType?: JobApplicationUserTypeWithAdmin;

  /**
   * Sample value of `actionDate`: 2024-12-17T11:36:46.753+00:00
   */
  actionDate?: string;

  reason?: string;
  userComment?: string;
};

export interface UserJobApplicationFindMatchingScoreApiDto {
  userJobApplicationId: string;
  candidateParsedCvId: string;
}