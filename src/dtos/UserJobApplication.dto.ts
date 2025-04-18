
// import dtos
import { RecordListingFilterOptions, RecordListingFilterRequestDTO } from "./Common.dto";

// import enums
import { JobApplicationStatus } from "../enums/UserJobApplication.enum";

// import types
import { JobApplicationFollowUpRequestType, JobApplicationRejectedByUserIdType, JobApplicationStatusTrackerType, JobApplicationUserType, JobApplicationUserTypeWithAdmin } from "../types/UserJobApplication.type";

/**
 * UserJobApplicationCreateApiDTO
 * 
 * Data required from the API to create a user's job application.
 * Focuses on the essentials needed to initiate the request.
 */
export interface UserJobApplicationCreateApiDTO {
  jobId: string;
  companyName: string;
  jobPortal?: string;
  matchingScore?: number;

  /**
   * @reference `id` attribute of `ReferAndEarn.model.ts`
   */
  referAndEarnId?: string;
}

export interface UserJobApplicationCreateDto extends UserJobApplicationCreateApiDTO {
  companyId: string;
  status: JobApplicationStatus;
  statusTracker: JobApplicationStatusTrackerType;
  
  cvExtract?: string;
  jdMatchErrorCode?: number;
  jdMatchErrorDesc?: string;
  rejectionFeedbackBySystem?: string;
  scoreDetails?: string;
  scoreFetchedDate?: string;
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
}

/**
 * UserJobApplicationUpdateApiDTO
 * 
 * Data required from the API to update a user's job application.
 * NOTE: This Comes from the request body of the API i.e from the frontend
 */
export interface UserJobApplicationUpdateApiDTO {
  userId: string; // The ID of the corporate user i.e `CorporateUser` model
  status: JobApplicationStatus;
  emailId: string; // The email ID of the corporate user i.e `CorporateUser` model
  reason?: string;
  userComment?: string;
  userType: JobApplicationUserTypeWithAdmin;
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