export interface EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  instagramUrl: string;
  instagramLogoUrl: string;
  linkedInUrl: string;
  linkedInLogoUrl: string;
  workoLogoUrl: string;
}

export interface EmailTemplatePlaceholderCAND_REFERRAL_REQ_ACCEPTED {
    candName: string;
    companyName: string;
    refereeName: string;
}

export interface EmailTemplatePlaceholderCAND_REFERRAL_REQ_COMPLETED {
    candName: string;
    companyName: string;
}

export interface EmailTemplatePlaceholderCAND_WELCOME_MSG {
    candName: string;
}

export interface EmailTemplatePlaceholderCAND_PROFILE_COMPLETION_REMINDER {
    candName: string;
}

export interface EmailTemplatePlaceholderUSER_WORK_EMAIL_VERIFICATION_OTP {
    userFullName: string;
    otp: string;
}

export interface EmailTemplatePlaceholderCAND_PREMIUM_UPGRADE_NOTIFICATION {
    candName: string;
    candPremiumUpgradeNowMsg: string;
}

export interface EmailTemplatePlaceholderCAND_PROFILE_SWITCH_NOTIFICATION {
    candName: string;
}

export interface EmailTemplatePlaceholderEMP_WELCOME_MSG {
    empName: string;
}

export interface EmailTemplatePlaceholderEMP_PROFILE_COMPLETION_REMINDER {
    empName: string;
}

export interface EmailTemplatePlaceholderEMP_ACCEPTED_REFERRAL_REQ_NOTIFCATION {
    empName: string;
    candName: string;
}

export interface EmailTemplatePlaceholderEMP_REFFERAL_DONE_FOR_CAND {
    empName: string;
}

export interface EmailTemplatePlaceholderCAND_PREMIUM_EXPIRED_NOTIFICATION {
    candName: string;
    candRenewNowMsg: string;
}

export interface EmailTemplatePlaceholderEMP_SWITCH_PROFILE_NOTIFICATION {
    empName: string;
}

export interface EmailTemplatePlaceholderEMP_REVIEW_RATING_BY_CAND {
    empName: string;
    feedback: string;
    rating: number;
}

export interface EmailTemplatePlaceholderEMP_QUERY_FOR_REFERRAL_BY_CAND {
    empName: string;
    query: string;
}

export interface EmailTemplatePlaceholderUSER_CORPORATE_REQUEST_EMAIL_OTP {
    userFullName: string;
    logoUrl: string;
    otp: string;
}
export interface EmailTemplatePlaceholderEMP_RECEIVED_REFERRAL_REQ_NOTIFICATION{
    emp_first_name: string;
    candidate_name: string;
}

/**
 * Represents the placeholders for the email template used when a candidate's referral is automatically cancelled after a specified number of days.
 */
export interface EmailTemplatePlaceholderCAND_REF_AUTO_CANCEL_AFTER_X_DAYS {
    candName: string;
    jobUrl: string;
    companyName: string;
}

/**
 * Represents the placeholders for the email template used when a candidate's referral is automatically rejected after a specified number of days.
 */
export interface EmailTemplatePlaceholderCAND_REF_AUTO_REJECT_AFTER_X_DAYS {
    candName: string;
    jobUrl: string;
    companyName: string;
    rejectedReasons : string;
}

/**
 * Represents the placeholders for the email template used when a worko employee wants to add new user as a company admin.
 */

export interface EmailTemplatePlaceholderCORP_ADMIN_ACCESS_INVITE {
    role: string,
    userName:string,
    companyName:string,
    signupUrl:string,
    loginUrl:string
}

/**
 * Represents the placeholders for the email template used when a worko user signs up as a corporate user.
 */
export interface EmailTemplatePlaceholderCORP_USER_SUCCESSFUL_SIGNUP {
    userName:string,
    companyName:string,
    userRole:string,
    loginUrl:string
}

/**
 * EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_NOTIFICATION
 * 
 * Represents the placeholders for the email template used when a worko corporate user receives a job application notification.
 */
export interface EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_NOTIFICATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  corporateUserFullName: string;
  candidateName: string;
  jobTitle: string;
  matchingScore: number;
  scoreDetails: string;
  companyJobApplicantsUrl: string;
}

export interface EmailTemplatePlaceholderCAND_COOLING_PERIOD_END_NOTIFICATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  companyName: string;
  companyCareersUrl: string;
}

/**
 * EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION
 */
export interface EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  jobPosterName: string;
  candidateName: string;
  jobTitle: string;
  applicationDate: string;
  status: string;
  companyJobApplicantsUrl: string;
  corporateUpdateStatusUrl: string;
}

/**
 * EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION
 */
export interface EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  jobPosterName: string;
  jobTitle: string;
  candidateName: string;
  updatedStatus: string;
  companyJobApplicantsUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  candJobApplUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candName: string;
  companyName: string;
  jobTitle: string;
  workoAppUrl: string;
  guidanceUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candName: string;
  companyName: string;
  jobTitle: string;
  workoAppUrl: string;
  guidanceUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candName: string;
  jobTitle: string;
  companyName: string;
  workoAppUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candName: string;
  jobTitle: string;
  companyName: string;
  hrFeedback: string;
  workoAppUrl: string;
}

export interface EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  uploadDocumentsUrl: string;
}
 
export interface EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  uploadDocumentsUrl: string;
}

export interface EmailTemplatePlaceholderCAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  uploadDocumentsUrl: string;
}

export interface EmailTemplatePlaceholderCAND_JOB_APPLICATION_JOINED_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  joiningDate: string;
}

export interface EmailTemplatePlaceholderCAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  viewOfferUrl: string;
}

export interface EmailTemplatePlaceholderCAND_JOB_APPLICATION_REVISED_OFFER_SENT extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  viewOfferUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE
 */
export interface EmailTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE {
  candidateName: string;
  companyName: string;
  jobTitle: string;
  matchingScore: number;
}

/**
 * EmailTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE
 */
export interface EmailTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE {
  candidateName: string;
  companyName: string;
  jobTitle: string;
}

/**
 * EmailTemplatePlaceholderRECIPIENT_REFER_AND_EARN
 */
export interface EmailTemplatePlaceholderRECIPIENT_REFER_AND_EARN extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  referrerName: string,
  recipientName: string,
  companyName: string,
  jobTitle: string,
  jobUrl: string
}
  
/**
 * EmailTemplatePlaceholderREFERRER_REFER_AND_EARN
 */
export interface EmailTemplatePlaceholderREFERRER_REFER_AND_EARN extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  referrerName: string;
  recipientName: string;
  jobTitle: string;
  companyName: string;
  dashboardUrl: string;
}

/**
 * EmailTemplatePlaceholderWORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED
 */
export interface EmailTemplatePlaceholderWORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  referrerName: string;
  referrerEmailId: string;
  referrerPhoneNumber: string;
  recipientName: string;
  jobUrl: string;
  jobTitle: string;
  appliedDate: string;
  referAndEarnJobApplicationStatus: string;
  commissionAmount: string;

  // Bank details
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
}

/**
 * EmailTemplatePlaceholderREFERRER_REFER_AND_EARN_PAYMENT_COMPLETED
 */
export interface EmailTemplatePlaceholderREFERRER_REFER_AND_EARN_PAYMENT_COMPLETED extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  referrerName: string;
  amountPaid: string;
  recipientName: string;
  jobTitle: string;
  companyName: string;
  jobAppliedDate: string;
  referrerUniqueTransactionReference: string;
  referrerAccountNumber: string;
  referrerIfscCode: string;
  paymentDate: string;
  dashboardUrl: string;
}

/**
 * EmailTemplatePlaceholder
 */
export interface EmailTemplatePlaceholderEVALUATOR_REQUEST_EVALUATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  evaluatorName: string;
  jobTitle: string;
  evaluatorDashboardUrl: string;

  /**
   * hiringManagerName
   * 
   * 1. `hrName` may be `worko-admin` or `corporate-admin` or `corporate-recruiter`
   */
  hrName: string;

  /**
   * hiringManagerCurrentCompanyName
   * 
   * 1. `hrCurrentCompanyName` may be `worko-admin's current company` or `corporate-admin's current company` or `corporate-recruiter's current company`
   */
  hrCurrentCompanyName: string;
}

export interface EmailTemplatePlaceholderCAND_JOB_CLOSED_UPDATE_STATUS
  extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candName: string;
  jobTitle: string;
  companyName: string;
  workoAppUrl: string;
}

export interface EmailTemplatePlaceholderCAND_JOBS_RECOMMENDATION extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  candidateName: string;
  jobsHtml: string;
  jobsText: string;
}

export interface EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_INVITE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  interviewType: string;
  interviewRoundText: string;
  interviewTitle: string;
  interviewDateTime: string;
  interviewMeetLink: string;
  interviewStatus: string;
  ruleForCandidate: string;
}

export interface EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_INVITE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  interviewType: string;
  interviewRoundText: string;
  interviewTitle: string;
  interviewDateTime: string;
  interviewMeetLink: string;
  interviewStatus: string;
}

export interface EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_CANDIDATE_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  interviewType: string;
  interviewRoundText: string;
  interviewTitle: string;
  interviewStatus: string;
  interviewDateTime: string;
  interviewMeetLink: string;
  ruleForCandidate: string;
}

export interface EmailTemplatePlaceholderJOB_APPLICATION_INTERVIEW_SCHEDULER_ATTENDEE_STATUS_UPDATE extends EmailTemplatePlaceholderSOCIAL_PROFILE_DETAILS {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  interviewType: string;
  interviewRoundText: string;
  interviewTitle: string;
  interviewStatus: string;
  interviewDateTime: string;
  interviewMeetLink: string;
}