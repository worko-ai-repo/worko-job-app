/**
 * JobApplicationStatus
 *
 * Enum for job application status
 */
export enum JobApplicationStatus {
  APPLIED = "APPLIED",
  REJECTED = "REJECTED",
  CV_DOWNLOADED = "CV_DOWNLOADED",
  UNDER_EVALUATION = "UNDER_EVALUATION",
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
  HIRED = "HIRED",
}

/**
 * JobApplicationValidBulkUpdateStatusEnum
 * 
 * Whenever the `corporate-recruiter/admin` or `worko-admin` perform
 * bulk job application update, the status must be one of this enum.
 */
export enum JobApplicationValidBulkUpdateStatusEnum {
  UNDER_EVALUATION = "UNDER_EVALUATION",
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
  HIRED = "HIRED",
}