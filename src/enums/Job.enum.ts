
/**
 * JobStatusEnum
 * 
 * Enum representing the status of a job.
 */
export enum JobStatusEnum {
  // JOB IS NOT CREATED YET AND SAVED IN DRAFT
  DRAFT = "DRAFT",

  // JOB IS ARCHIVED WHERE ADMIN WANT TO HIDE THE JOB
  ARCHIVED = "ARCHIVED",

  // JOB IS CREATED AND ACTIVE
  PUBLISHED = "PUBLISHED",

  // JOB IS CLOSED
  CLOSED = "CLOSED",
}

/** 
 * JobWorkModeEnum
 * 
 * Enum representing the work mode for a job.
 */
export enum JobWorkModeEnum {
  // Work from Home
  WFH = "WFH",

  // Work from Office
  WFO = "WFO",

  // HYBRID
  HYBRID = "HYBRID",
}

/**
 * JobDashboardEnum
 */
export enum JobDashboardEnum {
  CORPORATE = "CORPORATE",
  ADMIN = "ADMIN",

  /**
   * USER
   *
   * NOTE:-
   *  1. The `USER` may be `Candidate` or `Employee` or `Not Logged In User` or `Not Registered User`.
   *  2. As of now frontend is using below value whenever the `Candidate` or `Employee` or `Not Logged In User` or `Not Registered User` 
   *     want to see the `internal jobs(which are posted by worko-admin or corporate-admin/recruiter)`.
   */
  USER = "USER",
}