/**
 * JobApplicationStatus
 *
 * Enum for job application status
 */
export enum JobApplicationStatus {
  APPLIED = "APPLIED",
  REJECTED = "REJECTED",
  ON_HOLD = "ON_HOLD",
  ACCEPTED = "ACCEPTED",
  CV_DOWNLOADED = "CV_DOWNLOADED",
  UNDER_EVALUATION = "UNDER_EVALUATION",
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
  HIRING_IN_PROCESS = "HIRING_IN_PROCESS",
  DOCUMENT_REQUESTED = "DOCUMENT_REQUESTED", // send email to cand
  DOCUMENT_SUBMITTED = "DOCUMENT_SUBMITTED", // send email to job poster
  DOCUMENT_ADDITIONAL_REQUESTED = "DOCUMENT_ADDITIONAL_REQUESTED",
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED = "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
  DOCUMENT_REVISION_REQUESTED = "DOCUMENT_REVISION_REQUESTED", // whenever submitted document is re-requested by corporate or worko-admin
  DOCUMENT_REVISION_REQUEST_SUBMITTED = "DOCUMENT_REVISION_REQUEST_SUBMITTED", // whenever re-requested document is submitted by candidate to corporate or worko-admin
  DOCUMENT_VERIFIED = "DOCUMENT_VERIFIED",
  OFFER_SENT = "OFFER_SENT", // send email to cand
  OFFER_ISSUE_RAISED = "OFFER_ISSUE_RAISED", // candidate raised issue on offer letter
  REVISED_OFFER_SENT = "REVISED_OFFER_SENT",
  HIRED = "HIRED",
  JOINED = "JOINED", // send email to both cand and job poster
}

export enum UserJobApplicationHiringInProcessRelatedStatusEnum {
  HIRING_IN_PROCESS = "HIRING_IN_PROCESS",
  DOCUMENT_REQUESTED = "DOCUMENT_REQUESTED", // send email to cand
  DOCUMENT_SUBMITTED = "DOCUMENT_SUBMITTED", // send email to job poster
  DOCUMENT_ADDITIONAL_REQUESTED = "DOCUMENT_ADDITIONAL_REQUESTED",
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED = "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
  DOCUMENT_REVISION_REQUESTED = "DOCUMENT_REVISION_REQUESTED", // whenever submitted document is re-requested by corporate or worko-admin
  DOCUMENT_REVISION_REQUEST_SUBMITTED = "DOCUMENT_REVISION_REQUEST_SUBMITTED", // whenever re-requested document is submitted by candidate to corporate or worko-admin
  DOCUMENT_VERIFIED = "DOCUMENT_VERIFIED",
  OFFER_SENT = "OFFER_SENT", // send email to cand
  OFFER_ISSUE_RAISED = "OFFER_ISSUE_RAISED", // candidate raised issue on offer letter
  REVISED_OFFER_SENT = "REVISED_OFFER_SENT",
  HIRED = "HIRED",  
}

/**
 * UserJobApplicationDocumentStatusEnum
 */
export enum UserJobApplicationDocumentStatusEnum {
  DOCUMENT_REQUESTED = "DOCUMENT_REQUESTED", 
  DOCUMENT_SUBMITTED = "DOCUMENT_SUBMITTED", 
  DOCUMENT_ADDITIONAL_REQUESTED = "DOCUMENT_ADDITIONAL_REQUESTED",
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED = "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
  DOCUMENT_REVISION_REQUESTED = "DOCUMENT_REVISION_REQUESTED", 
  DOCUMENT_REVISION_REQUEST_SUBMITTED = "DOCUMENT_REVISION_REQUEST_SUBMITTED", 
}

/**
 * UserJobApplicationValidApplicantUpdateStatusEnum
 * 
 * @description This enum is used for validating user job application update for applicant
 * @reference `status` attribute in `userJobApplicationApplicantUpdateValidation` of `UserJobApplication.schema.ts`
 */
export enum UserJobApplicationValidApplicantUpdateStatusEnum {
  DOCUMENT_SUBMITTED = "DOCUMENT_SUBMITTED", // send email to job poster
  DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED = "DOCUMENT_ADDITIONAL_REQUEST_SUBMITTED",
  DOCUMENT_REVISION_REQUEST_SUBMITTED = "DOCUMENT_REVISION_REQUEST_SUBMITTED", // whenever re-requested document is submitted by candidate to corporate or worko-admin
  OFFER_ISSUE_RAISED = "OFFER_ISSUE_RAISED",
  HIRED = "HIRED",
  JOINED = "JOINED", // send email to both cand and job poster
}

/**
 * UserJobApplicationValidHrUpdateStatusEnum
 * 
 * @description This enum is used for validating user job application update for hr(corporate-recruiter/admin or worko-admin)
 */
export enum UserJobApplicationValidHrUpdateStatusEnum {
  APPLIED = "APPLIED",
  REJECTED = "REJECTED",
  ON_HOLD = "ON_HOLD",
  ACCEPTED = "ACCEPTED",
  CV_DOWNLOADED = "CV_DOWNLOADED",
  UNDER_EVALUATION = "UNDER_EVALUATION",
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
  HIRING_IN_PROCESS = "HIRING_IN_PROCESS",
  DOCUMENT_REQUESTED = "DOCUMENT_REQUESTED", 
  DOCUMENT_ADDITIONAL_REQUESTED = "DOCUMENT_ADDITIONAL_REQUESTED",
  DOCUMENT_REVISION_REQUESTED = "DOCUMENT_REVISION_REQUESTED", // whenever submitted document is re-requested by corporate or worko-admin
  DOCUMENT_VERIFIED = "DOCUMENT_VERIFIED",
  OFFER_SENT = "OFFER_SENT",
  REVISED_OFFER_SENT = "REVISED_OFFER_SENT",
  JOINED = "JOINED",
}

/**
 * JobApplicationValidBulkUpdateStatusEnum
 * 
 * Whenever the `corporate-recruiter/admin` or `worko-admin` perform
 * bulk job application update, the status must be one of this enum.
 */
export enum JobApplicationValidBulkUpdateStatusEnum {
  ACCEPTED = "ACCEPTED",
  ON_HOLD = "ON_HOLD",
  UNDER_EVALUATION = "UNDER_EVALUATION",
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
  HIRING_IN_PROCESS = "HIRING_IN_PROCESS",
}

/**
 * UserJobApplicationRejectUpdateStatusEnum
 * 
 * @description Whenever the `corporate-recruiter/admin` or `worko-admin` soft delete a `job` then the 
 * candidates who applied for this job applications will be sets to `Rejected` only for below enum.
 */
export enum UserJobApplicationRejectUpdateStatusEnum {
  APPLIED = "APPLIED",
  ON_HOLD = "ON_HOLD",
  ACCEPTED = "ACCEPTED",
  CV_DOWNLOADED = "CV_DOWNLOADED",
  UNDER_EVALUATION = "UNDER_EVALUATION",
  PROCESSING_INTERVIEW = "PROCESSING_INTERVIEW",
  INTERVIEW_DONE = "INTERVIEW_DONE",
}