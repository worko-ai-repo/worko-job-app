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
   * Whenever `corporate` or `worko-admin` request documents from `candidate` then send email to `candidate` to upload the documents requested by `corporate` or `worko-admin`
   */
  CAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE = "CAND_JOB_APPLICATION_DOCUMENT_REQUESTED_STATUS_UPDATE",

  CAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE = "CAND_JOB_APPLICATION_DOCUMENT_ADDITIONAL_REQUESTED_STATUS_UPDATE",

  CAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE = "CAND_JOB_APPLICATION_DOCUMENT_REVISION_REQUESTED_STATUS_UPDATE",

  /**
   * Whenever `corporate` or `worko-admin` clicks on `hire now` button and send offer letter to `candidate` then send email to candidate
   */
  CAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE = "CAND_JOB_APPLICATION_OFFER_SENT_STATUS_UPDATE",

  /**
   * Whenever `corporate` or `worko-admin` send revised offer letter to `candidate` then send email to candidate
   */
  CAND_JOB_APPLICATION_REVISED_OFFER_SENT = "CAND_JOB_APPLICATION_REVISED_OFFER_SENT",

  /**
   * Whenever `corporate` or `worko-admin` clicks on `joined` button then send email to candidate
   */
  CAND_JOB_APPLICATION_JOINED_STATUS_UPDATE = "CAND_JOB_APPLICATION_JOINED_STATUS_UPDATE",

  /**
   * RECIPIENT_REFER_AND_EARN
   *
   * The template name used to send notification to `recipient` whenever a `referrer` sends a `refer and earn` to a `recipient`.
   */
  RECIPIENT_REFER_AND_EARN = "RECIPIENT_REFER_AND_EARN",

  /**
   * REFERRER_REFER_AND_EARN
   *
   * The template name used to send notification to `referrer` whenever a `referrer` sends a `refer and earn` to a `recipient`.
   */
  REFERRER_REFER_AND_EARN = "REFERRER_REFER_AND_EARN",

  /**
   * WORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED
   *
   * The template name used to send notification to `worko admin` whenever a `referrer` requests for withdraw money.
   */
  WORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED = "WORKO_ADMIN_REFER_AND_EARN_WITHDRAWAL_REQUESTED",

  /**
   * REFERRER_REFER_AND_EARN_PAYMENT_COMPLETED
   *
   * The template name used to send notification to `referrer` whenever `worko admin` pays money to `referrer`.
   */
  REFERRER_REFER_AND_EARN_PAYMENT_COMPLETED = "REFERRER_REFER_AND_EARN_PAYMENT_COMPLETED",

  /**
   * EVALUATOR_REQUEST_EVALUATION
   *
   * The template name used to send notification to `evaluator` whenever a `corporate-admin/recruiter` or `worko-admin` sends a job application
   * details to a `evaluator` for reviewing that candidate's application.
   */
  EVALUATOR_REQUEST_EVALUATION = "EVALUATOR_REQUEST_EVALUATION",

  /**
   * The email template is used to send notification to candidates who applied for a job which is closed by worko-admin or corporate recruiter.
   */
  CAND_JOB_CLOSED_UPDATE_STATUS = "CAND_JOB_CLOSED_UPDATE_STATUS",

  CAND_JOBS_RECOMMENDATION = "CAND_JOBS_RECOMMENDATION",
  
  CAND_COOLING_PERIOD_END_NOTIFICATION = "CAND_COOLING_PERIOD_END_NOTIFICATION"
}
