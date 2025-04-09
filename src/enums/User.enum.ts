/**
 * BankUpiStatus
 *
 * Description: Enum representing the status of a user BankUpi.
 */
export enum BankUpiStatus {
  // User BankUpi related status
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
}

/**
 * ReferralActions
 *
 * Description: Enum representing the actions of a user referral.
 */
export enum ReferralActions {
  // User Referral related actions
  PASS = "PASS",
  REJECT = "REJECT",
  ACCEPT = "ACCEPT",
  DONE = "DONE",
}

/**
 * ProvidedServiceStatus
 *
 * Description: Enum representing the status of a user ProvidedService.
 */
export enum ProvidedServiceStatus {
  // User ProvidedService related Status
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
}

export enum UserType {
  EMP = "EMP",
  CAND = "CAND",
}

/**
 * UserReviewEmpContext
 *
 * Possible contexts for which user review can be created for Employee Role.
 */
export enum UserReviewEmpContext {
  EMP_USER = "EMP_USER",
  EMP_REFERRAL = "EMP_REFERRAL",
  EMP_PROVIDED_SERVICE = "EMP_PROVIDED_SERVICE",
}

/**
 * UserReviewCandContext
 *
 * Possible contexts for which user review can be created for Candidate Role.
 */
export enum UserReviewCandContext {
  CAND_USER = "CAND_USER",
}

/**
 * UserSupportStatus
 *
 * Possible contexts for which user support's status can be created.
 */
export enum UserSupportStatusEnum {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

export enum UserContextTypeEnum {
  REFERRAL = "REFERRAL",
  SERVICE = "SERVICE",
  CORPORATE_BULK_JD_RESUME = "CORPORATE_BULK_JD_RESUME", // Refer `CorporateBulkJdResume.model.ts`
}

export enum UserOtpStatusEnum {
  ACTIVE = "ACTIVE",
  USED = "USED",
  EXPIRED = "EXPIRED",
}

export enum UserOtpSentViaEnum {
  SMS = "SMS",
  EMAIL = "EMAIL",
}

/**
 * UserCorporateRequest
 *
 * Possible statuses for which user corporate request can be created.
 */
export enum UserCorporateRequestStatusEnum {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
}

/**
 * UserCareerRequest
 *
 * Possible statuses for which user career request can be created.
 */
export enum UserCareerRequestStatusEnum {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  UNDER_CONSIDERATION = "UNDER_CONSIDERATION",
  HIRED = "HIRED",
}
