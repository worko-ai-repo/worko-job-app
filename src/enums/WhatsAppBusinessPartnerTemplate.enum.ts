/**
 * WhatsAppBusinessPartnerTemplateNameEnum
 *
 * Enumeration for the names of WhatsAppBusinessPartner templates used in the system.
 * This enum provides a centralized list of all WhatsAppBusinessPartner template names used in the application.
 * It helps maintain consistency in template naming and usage across the system.
 * Each template serves a specific purpose in the user communication flow, from onboarding to notifications.
 *
 * We use the following prefixes to indicate the recipient of the template message:
 * - `CAND`: Used for templates sent to candidates.
 * - `EMP`: Used for templates directed towards employees.
 * - `USER`: Used for both candidates, employees, corporates, worko admins.
 */
export enum WhatsAppBusinessPartnerTemplateNameEnum {
  /**
   * signup_candidate
   *
   * Represents the template used for welcoming new candidates.
   *
   * This template, named `signup_candidate`, is utilized when a user registers
   * as a candidate on the Worko website. It sends a welcome message to the
   * candidate via WhatsAppBusinessPartner platform.
   */
  CAND_SIGNUP_CANDIDATE = "signup_candidate",

  /**
   * signup_emp
   *
   * Represents the template used for welcoming new employees.
   *
   * This template, named `signup_emp`, is utilized when a user registers
   * as a employee on the Worko website. It sends a welcome message to the
   * employee via WhatsAppBusinessPartner platform.
   */
  EMP_SIGNUP_EMP = "signup_emp",

  /**
   * referral_request_accepted_candidate
   *
   * This template, named `referral_request_accepted_candidate`, is utilized for notifying candidates that their
   * referral request has been `accepted` by an employee on the Worko website.
   * It sends a notification to the candidate via WhatsAppBusinessPartner platform.
   */
  CAND_REFERRAL_REQUEST_ACCEPTED_CANDIDATE = "referral_request_accepted_candidate",

  /**
   * referral_request_completed_candidate
   *
   * This template, named `referral_request_completed_candidate`, is utilized for notifying candidates that their
   * referral request has been `completed` by an employee on the Worko website.
   * It sends a notification to the candidate via WhatsAppBusinessPartner platform.
   */
  CAND_REFERRAL_REQUEST_COMPLETED_CANDIDATE = "referral_request_completed_candidate",

  /**
   * new_referral_request_employee
   *
   * This template, named `new_referral_request_employee`, is used to notify employees when a candidate raises a
   * referral request to a particular company on the Worko website.
   * It sends a WhatsApp notification via the WhatsAppBusinessPartner platform to employees currently working at that company.
   */
  EMP_NEW_REFERRAL_REQUEST_EMPLOYEE = "new_referral_request_employee",

  /**
   * pending_request_count_employee
   *
   * This template, named `pending_request_count_employee`, is used to notify employee about the number of referral requests
   * in their employee awaiting list on the Worko website.
   * It sends a WhatsApp notification via the WhatsAppBusinessPartner platform to employee.
   */
  EMP_PENDING_REQUEST_COUNT_EMPLOYEE = "pending_request_count_employee",

  /**
   * accepted_request_count_employee
   *
   * This template, named `accepted_request_count_employee`, is used to notify employees about the number of referral requests
   * in their employee accepted list but not set to `completed` on the Worko website.
   * It sends a WhatsApp notification via the WhatsAppBusinessPartner platform to employees.
   */
  EMP_ACCEPTED_REQUEST_COUNT_EMPLOYEE = "accepted_request_count_employee",

  /**
   * referral_request_pending_employee
   *
   * This template, named `referral_request_pending_employee`, is used to notify the employee
   * about a referral request the employee have accepted, informing employee that the status has been set to `completed`
   * on the Worko website.
   * It sends a WhatsApp notification to the employee via the WhatsAppBusinessPartner platform.
   */
  EMP_REFERRAL_REQUEST_PENDING_EMPLOYEE = "referral_request_pending_employee",

  /**
   * referee_raise_dispute_candidate
   *
   * This template, named `referee_raise_dispute_candidate`, is used to notify the candidate
   * about a dispute raised by an employee on the Worko website.
   * It sends a WhatsApp notification to the candidate via the WhatsAppBusinessPartner platform.
   */
  CAND_REFEREE_RAISE_DISPUTE_CANDIDATE = "referee_raise_dispute_candidate",

  /**
   * candidate_raise_dispute_employee
   *
   * This template, named `candidate_raise_dispute_employee`, is used to notify the employee
   * about a dispute raised by a candidate on the Worko website.
   * It sends a WhatsApp notification to the employee via the WhatsAppBusinessPartner platform.
   */
  EMP_CANDIDATE_RAISE_DISPUTE_EMPLOYEE = "candidate_raise_dispute_employee",

  /**
   * emp_pending_work_email_verification
   *
   * This template, named `emp_pending_work_email_verification`, is used to notify the employee
   * about a pending work email verification of an employee on the Worko website.
   * It sends a WhatsApp notification to the employee via the WhatsAppBusinessPartner platform.
   */
  EMP_PENDING_WORK_EMAIL_VERIFICATION = "emp_pending_work_email_verification",

  /**
   * message_received_employee
   *
   * This template, named `message_received_employee`, is used to notify the employee
   * about a new message received to an employee from a candidate on the Worko website.
   * It sends a WhatsApp notification to the employee via the WhatsAppBusinessPartner platform.
   */
  EMP_MESSAGE_RECEIVED_EMPLOYEE = "message_received_employee",

  /**
   * unread_message_count_employee
   *
   * This template, named `unread_message_count_employee`, is used to notify the employee
   * about the number of unread messages in their employee inbox on the Worko website.
   * It sends a WhatsApp notification to the employee via the WhatsAppBusinessPartner platform.
   */
  EMP_UNREAD_MESSAGE_COUNT_EMPLOYEE = "unread_message_count_employee",

  /**
   * messages_unread_candidate
   *
   * This template, named `messages_unread_candidate`, is used to notify the candidate
   * about the number of unread messages in their inbox on the Worko website.
   * It sends a WhatsApp notification to the candidate via the WhatsAppBusinessPartner platform.
   */
  CAND_MESSAGES_UNREAD_CANDIDATE = "messages_unread_candidate",

  /**
   * message_received_candidate
   *
   * This template, named `message_received_candidate`, is used to notify the candidate
   * about a new message received to a candidate from an employee on the Worko website.
   * It sends a WhatsApp notification to the candidate via the WhatsAppBusinessPartner platform.
   */
  CAND_MESSAGE_RECEIVED_CANDIDATE = "message_received_candidate",

  /**
   * cand_corporate_bulk_jd_resume_high_matching_scoring
   *
   * The template, named `cand_corporate_bulk_jd_resume_high_matching_score`, is used to notify the candidate
   * whenever a corporate user screens a job description for bulk resumes of candidates for high matching scores.
   * It sends a WhatsApp notification to the candidate via the WhatsAppBusinessPartner platform.
   */
  CAND_CORPORATE_BULK_JD_RESUME_HIGH_MATCHING_SCORE = "cand_corporate_bulk_jd_resume_high_matching_scoring",

  /**
   * cand_corporate_bulk_jd_resume_low_matching_score
   *
   * The template, named `cand_corporate_bulk_jd_resume_low_matching_score`, is used to notify the candidate
   * whenever a corporate user screens a job description for bulk resumes of candidates for low matching scores.
   * It sends a WhatsApp notification to the candidate via the WhatsAppBusinessPartner platform.
   */
  CAND_CORPORATE_BULK_JD_RESUME_LOW_MATCHING_SCORE = "cand_corporate_bulk_jd_resume_low_matching_score",
}
