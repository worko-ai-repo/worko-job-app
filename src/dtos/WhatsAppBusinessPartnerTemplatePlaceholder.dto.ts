/**
 * WhatsAppBusinessPartnerPlaceholderParamDto
 *
 * Placeholder parameters for WhatsAppBusinessPartner message templates to be used internally within the application.
 *
 * This interface allows for flexible key-value pairs of placeholder types and their corresponding values.
 */
export interface WhatsAppBusinessPartnerPlaceholderParamDto {
  [key: string]: any;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderEMP_CANDIDATE_RAISE_DISPUTE_EMPLOYEE
 *
 * Placeholder for the employee referral query by candidate template.
 * Used when a candidate asks a question or seeks clarification about their referral to an employee.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderEMP_CANDIDATE_RAISE_DISPUTE_EMPLOYEE {
  /**
   * employeeName
   *
   * The first body placeholder, likely containing the employee's name.
   */
  employeeName: string;

  /**
   * candidateName
   *
   * The second body placeholder, possibly containing the candidate's name.
   */
  candidateName: string;

  /**
   * referralStatus
   *
   * The third body placeholder, containing the referral status.
   *
   * @see ReferralStatus
   */
  referralStatus: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderCAND_SIGNUP_CANDIDATE
 *
 * Placeholder for the candidate welcome message template.
 * Used when sending an initial welcome message to a new candidate.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderCAND_SIGNUP_CANDIDATE {
  /**
   * candidateName
   *
   * The body placeholder in the template containing the candidate's name.
   */
  candidateName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderEMP_SIGNUP_EMP
 *
 * Placeholder for the employee welcome message template.
 * Used when sending an initial welcome message to a new employee.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderEMP_SIGNUP_EMP {
  /**
   * employeeName
   *
   * The body placeholder in the template containing the employee's name.
   */
  employeeName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderCAND_REFERRAL_REQUEST_ACCEPTED_CANDIDATE
 *
 * Placeholder for the candidate referral request accepted notification template.
 * Used to inform a candidate that their referral request has been accepted.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderCAND_REFERRAL_REQUEST_ACCEPTED_CANDIDATE {
  /**
   * candidateName
   *
   * The first body placeholder, containing the candidate's name.
   */
  candidateName: string;

  /**
   * companyName
   *
   * The second body placeholder, containing the company name
   */
  companyName: string;

  /**
   * jobUrl
   *
   * The third body placeholder, containing the job URL.
   */
  jobUrl: string;

  /**
   * employeeName
   *
   * The fourth body placeholder, containing the referee's name.
   */
  employeeName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderCAND_REFERRAL_REQUEST_COMPLETED_CANDIDATE
 *
 * Placeholder for the candidate referral request completed notification template.
 * Used to inform a candidate that their referral check has been completed.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderCAND_REFERRAL_REQUEST_COMPLETED_CANDIDATE {
  /**
   * candidateName
   *
   * The first body placeholder, containing the candidate's name.
   */
  candidateName: string;

  /**
   * companyName
   *
   * The second body placeholder, containing the company name
   */
  companyName: string;

  /**
   * jobUrl
   *
   * The third body placeholder, containing the job URL.
   */
  jobUrl: string;

  /**
   * employeeName
   *
   * The fourth body placeholder, containing the referee's name.
   */
  employeeName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderEMP_NEW_REFERRAL_REQUEST_EMPLOYEE
 *
 * Placeholder for the employee received referral request notification template.
 * Used to notify an employee that they have received a new referral request.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderEMP_NEW_REFERRAL_REQUEST_EMPLOYEE {
  /**
   * employeeName
   *
   * The first body placeholder, containing the employee's name.
   */
  employeeName: string;

  /**
   * candidateName
   *
   * The second body placeholder, containing the candidate's name.
   */
  candidateName: string;

  /**
   * matchingScore
   *
   * The third body placeholder, containing a matching score.
   */
  matchingScore: string;

  /**
   * jobUrl
   *
   * The fourth body placeholder, containing the job URL.
   */
  jobUrl: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderEMP_REFERRAL_REQUEST_PENDING_EMPLOYEE
 *
 * Placeholder for the employee pending accepted referral request notification template.
 * Used to remind employee about referral request that the employee has accepted but haven't completed.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderEMP_REFERRAL_REQUEST_PENDING_EMPLOYEE {
  /**
   * employeeName
   *
   * The first body placeholder, likely containing the employee's name.
   */
  employeeName: string;

  /**
   * candidateName
   *
   * The second body placeholder, possibly containing the candidate's name.
   */
  candidateName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderCAND_REFEREE_RAISE_DISPUTE_CANDIDATE
 *
 * Placeholder for the candidate referral query by employee template.
 * Used when an employee asks a question or seeks clarification about a candidate's referral.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderCAND_REFEREE_RAISE_DISPUTE_CANDIDATE {
  /**
   * candidateName
   *
   * The first body placeholder, likely containing the candidate's name.
   */
  candidateName: string;

  /**
   * employeeName
   *
   * The second body placeholder, possibly containing the employee's (referee's) name.
   */
  employeeName: string;

  /**
   * referralStatus
   *
   * The third body placeholder, containing the referral status.
   *
   * @see ReferralStatus
   */
  referralStatus: string;

  /**
   * companyName
   *
   * The third body placeholder, potentially containing the query or question.
   */
  companyName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderEMP_PENDING_WORK_EMAIL_VERIFICATION
 *
 * Placeholder for the employee work email verification pending notification template.
 * Used to remind employees to verify their work email.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderEMP_PENDING_WORK_EMAIL_VERIFICATION {
  /**
   * employeeName
   *
   * The body placeholder, typically containing the employee's name.
   */
  employeeName: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE
 *
 * Placeholder for the candidate corporate bulk JD resume high matching score template.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  matchingScore: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE
 *
 * Placeholder for the candidate corporate bulk JD resume low matching score template.
 *
 * ## NOTE: The placeholders should be in the same vertical order as they appear in the template
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderCAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE {
  candidateName: string;
  companyName: string;
  jobTitle: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderRECIPIENT_REFER_AND_EARN
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderRECIPIENT_REFER_AND_EARN {
  recipientName: string;
  referrerName: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
}

/**
 * WhatsAppBusinessPartnerTemplatePlaceholderREFERRER_REFER_AND_EARN
 */
export interface WhatsAppBusinessPartnerTemplatePlaceholderREFERRER_REFER_AND_EARN {
  referrerName: string;
  recipientName: string;
  jobTitle: string;
  companyName: string;
}
