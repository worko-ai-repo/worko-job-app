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
export interface EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_NOTIFICATION {
  corporateUserFullName: string;
  candidateName: string;
  jobTitle: string;
  matchingScore: number;
  scoreDetails: string;
}

/**
 * EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION
 */
export interface EmailTemplatePlaceholderCORP_REQUEST_FEEDBACK_NOTIFICATION {
  jobPosterName: string;
  candidateName: string;
  jobTitle: string;
  applicationDate: string;
  status: string;
}

/**
 * EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION
 */
export interface EmailTemplatePlaceholderCORP_RECEIVED_JOB_APPLICATION_STATUS_UPDATE_NOTIFICATION {
  jobPosterName: string;
  jobTitle: string;
  candidateName: string;
  updatedStatus: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_NOTIFICATION {
  candidateName: string;
  jobTitle: string;
  companyName: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_CV_DOWNLOADED_STATUS_UPDATE {
  candName: string;
  companyName: string;
  jobTitle: string;
  workoAppUrl: string;
  guidanceEmail: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_UNDER_EVALUATION_STATUS_UPDATE {
  candName: string;
  companyName: string;
  jobTitle: string;
  workoAppUrl: string;
  guidanceEmail: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_HIRED_STATUS_UPDATE {
  candName: string;
  jobTitle: string;
  companyName: string;
  workoAppUrl: string;
}

/**
 * EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE
 */
export interface EmailTemplatePlaceholderCAND_RECEIVED_JOB_APPLICATION_REJECTED_STATUS_UPDATE {
  candName: string;
  jobTitle: string;
  companyName: string;
  hrFeedback: string;
  workoAppUrl: string;
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
export interface EmailTemplatePlaceholderRECIPIENT_REFER_AND_EARN {
  referrerName: string,
  recipientName: string,
  companyName: string,
  jobTitle: string,
  jobUrl: string
}
  
/**
 * EmailTemplatePlaceholderREFERRER_REFER_AND_EARN
 */
export interface EmailTemplatePlaceholderREFERRER_REFER_AND_EARN {
  referrerName: string;
  recipientName: string;
  jobTitle: string;
  companyName: string;
}

/**
 * EmailTemplatePlaceholderWORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED
 */
export interface EmailTemplatePlaceholderWORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED {
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
export interface EmailTemplatePlaceholderREFERRER_REFER_AND_EARN_PAYMENT_COMPLETED {
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
}