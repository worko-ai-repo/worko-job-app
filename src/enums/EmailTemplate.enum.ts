/**
 * EmailTemplateStatus
 *
 * Description: Enum representing the possible statuses of a Email Template.
 */
export enum EmailTemplateStatusEnum {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export enum EmailTemplateEnum {
  CAND_REFERRAL_REQ_ACCEPTED = "CAND_REFERRAL_REQ_ACCEPTED",
  CAND_REFERRAL_REQ_COMPLETED = "CAND_REFERRAL_REQ_COMPLETED",
  CAND_WELCOME_MSG = "CAND_WELCOME_MSG",
  CAND_PROFILE_COMPLETION_REMINDER = "CAND_PROFILE_COMPLETION_REMINDER",

  CAND_PREMIUM_UPGRADE_NOTIFICATION = "CAND_PREMIUM_UPGRADE_NOTIFICATION",
  CAND_PROFILE_SWITCH_NOTIFICATION = "CAND_PROFILE_SWITCH_NOTIFICATION",

  CAND_PREMIUM_EXPIRED_NOTIFICATION = "CAND_PREMIUM_EXPIRED_NOTIFICATION",

  EMP_WELCOME_MSG = "EMP_WELCOME_MSG",
  EMP_PROFILE_COMPLETION_REMINDER = "EMP_PROFILE_COMPLETION_REMINDER",
  EMP_RECEIVED_REFERRAL_REQ_NOTIFICATION = "EMP_RECEIVED_REFERRAL_REQ_NOTIFICATION",
  EMP_ACCEPTED_REFERRAL_REQ_NOTIFCATION = "EMP_ACCEPTED_REFERRAL_REQ_NOTIFCATION",
  EMP_REFFERAL_DONE_FOR_CAND = "EMP_REFFERAL_DONE_FOR_CAND",

  EMP_SWITCH_PROFILE_NOTIFICATION = "EMP_SWITCH_PROFILE_NOTIFICATION",
  EMP_REVIEW_RATING_BY_CAND = "EMP_REVIEW_RATING_BY_CAND",
  EMP_QUERY_FOR_REFERRAL_BY_CAND = "EMP_QUERY_FOR_REFERRAL_BY_CAND",

  USER_WORK_EMAIL_VERIFICATION_OTP = "USER_WORK_EMAIL_VERIFICATION_OTP",
  USER_CORPORATE_REQUEST_EMAIL_OTP = "USER_CORPORATE_REQUEST_EMAIL_OTP",
  /**
   * The template name used when a candidate's referral is automatically cancelled
   * after a specified number of days.
   */
  CAND_REF_AUTO_CANCEL_AFTER_X_DAYS = "CAND_REF_AUTO_CANCEL_AFTER_X_DAYS",

  /**
   * The template name used when a candidate's referral is automatically rejected
   * after a specified number of days.
   */
  CAND_REF_AUTO_REJECT_AFTER_X_DAYS = "CAND_REF_AUTO_REJECT_AFTER_X_DAYS",

  /**
   * The template name used when a worko employee wants to add new user as a company admin.
   */
  CORP_ADMIN_ACCESS_INVITE = "CORP_ADMIN_ACCESS_INVITE",

  /**
   * The template name used when a worko user signs up as a corporate user.
   */
  CORP_USER_SUCCESSFUL_SIGNUP = "CORP_USER_SUCCESSFUL_SIGNUP",

  /**
   * The template name used when a worko corporate user receives a job application notification.
   */
  CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION = "CORP_RECEIVED_JOB_APPLICATION_NOTIFICATION",

  /**
   * The template name used whenever a candidate requests feedback from a job poster for his job application.
   */
  CORP_REQUEST_FEEDBACK_NOTIFICATION = "CORP_REQUEST_FEEDBACK_NOTIFICATION",

  /**
   * The template name used whenever a worko corporate user(Job Poster) receives a job application status update notification.
   */
  CORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION = "CORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION",

  /**
   * The template name used whenever a candidate applies for a job application.
   */
  CAND_RECEIVED_JOB_APPLICATION_NOTIFICATION = "CAND_RECEIVED_JOB_APPLICATION_NOTIFICATION",

  /**
   * The template name used whenever a candidate receives a job application CV download status update notification.
   */
  CAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE = "CAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE",

  /**
   * The template name used whenever a candidate receives a job application under evaluation status update notification.
   */
  CAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE = "CAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE",

  /**
   * The template name used whenever a candidate receives a job application hired status update notification.
   */
  CAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE = "CAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE",

  /**
   * The template name used whenever a candidate receives a job application rejected status update notification.
   */
  CAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE = "CAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE",

  /**
   * The template name used whenever a corporate user screens a job description for bulk resumes of candidates for high matching scores.
   */
  CAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE = "CAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE",

  /**
   * The template name used whenever a corporate user screens a job description for bulk resumes of candidates for low matching scores.
   */
  CAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE = "CAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE",
}
