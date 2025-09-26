// @todo kindly move the "CloudApi" suffixed enums to a separately file to isolate the enums for the coud API separately.

/**
 * @enum {string}
 * @description Enumeration for the status of a WhatsApp template.
 * @remarks This enum represents the various states a WhatsApp template can be in within your system.
 * It's used to track the lifecycle of a template from creation to potential disablement.
 */
export enum WhatsappTemplateStatusEnum {
  /** Template is active and can be used for sending messages. */
  ENABLED = "ENABLED",
  /** Template is inactive and cannot be used for sending messages. */
  DISABLED = "DISABLED",
  /** Template is awaiting approval and cannot be used yet. */
  PENDING = "PENDING",
}

/**
 * @enum {string}
 * @description Enumeration for different types of WhatsApp messaging.
 * @remarks This enum is used to distinguish between standard WhatsApp messages and those sent using pre-approved templates.
 * It's crucial for determining the appropriate API endpoints and parameters when sending messages.
 */
export enum WhatsappMessagingApiTypeCloudApiEnum {
  /** Represents a standard WhatsApp message. */
  WHATSAPP = "whatsapp",
  /** Represents a message sent using a pre-approved template. */
  TEMPLATE = "template",
}

/**
 * @enum {string}
 * @description Enumeration for different categories of WhatsApp templates.
 * @remarks These categories are used by WhatsApp to classify templates and determine their approval process and usage limits.
 * Understanding these categories is essential for creating compliant and effective message templates.
 */
export enum WhatsappTemplateCreateCategoryCloudApiEnum {
  /** Templates used for utility purposes, like notifications or transactional messages. */
  UTILITY = "UTILITY",
  /** Templates used for promotional and marketing messages. These may have stricter approval processes. */
  MARKETING = "MARKETING",
  /** Templates used for authentication purposes, such as one-time passwords (OTPs). */
  AUTHENTICATION = "AUTHENTICATION",
}

/**
 * @enum {string}
 * @description Enumeration for the API status of a WhatsApp template.
 * @remarks This enum represents the various states a template can be in from the perspective of the WhatsApp Cloud API.
 * It's used to track the approval process and lifecycle of a template, including potential issues or restrictions.
 */
export enum WhatsappTemplateCreateStatusCloudApiEnum {
  /** Template has been approved and is ready for use. */
  APPROVED = "APPROVED",
  /** Template is awaiting approval from WhatsApp. */
  PENDING = "PENDING",
  /** Template has been rejected and cannot be used. */
  REJECTED = "REJECTED",
  /** Template is in the appeal process after being rejected. */
  IN_APPEAL = "IN_APPEAL",
  /** Template is scheduled for deletion but not yet removed. */
  PENDING_DELETION = "PENDING_DELETION",
  /** Template has been permanently deleted. */
  DELETED = "DELETED",
  /** Template is currently inactive and cannot be used. */
  DISABLED = "DISABLED",
  /** Template usage has been temporarily paused. */
  PAUSED = "PAUSED",
  /** Template usage limit has been exceeded and cannot be used until reset. */
  LIMIT_EXCEEDED = "LIMIT_EXCEEDED",
}

/**
 * @enum {string}
 * @description Enumeration for the reasons a WhatsApp template may be rejected.
 * @remarks This enum provides insight into why a template might not be approved.
 * Understanding these reasons can help in creating compliant templates and troubleshooting rejections.
 */
export enum WhatsappTemplateRejectedReasonCloudApiEnum {
  /** Template contains content that violates WhatsApp's policies on abusive or harmful material. */
  ABUSIVE_CONTENT = "ABUSIVE_CONTENT",
  /** Template does not adhere to the required format or structure. */
  INVALID_FORMAT = "INVALID_FORMAT",
  /** No specific reason provided for the rejection. */
  NONE = "NONE",
  /** Template contains promotional content not allowed in its category. */
  PROMOTIONAL = "PROMOTIONAL",
  /** The content of the template does not match the declared tags or purpose. */
  TAG_CONTENT_MISMATCH = "TAG_CONTENT_MISMATCH",
  /** Template is suspected to be part of a scam or fraudulent activity. */
  SCAM = "SCAM",
}

/**
 * @enum {string}
 * @description Enumeration for the supported languages in WhatsApp templates.
 * @remarks This enum lists the language codes that can be used when creating WhatsApp templates.
 * It's crucial for internationalizing your messaging and ensuring proper localization.
 */
export enum WhatsappTemplateCreateLanguageCloudApiEnum {
  /** English language. */
  EN = "en",
  /** British English. */
  EN_GB = "en_GB",
  /** American English. */
  EN_US = "en_US",
  /** Hindi language. */
  HI = "hi",
  /** Marathi language. */
  MR = "mr",
}

/**
 * @enum {string}
 * @description Enumeration for the component types in a WhatsApp template.
 * @remarks This enum defines the different sections that can be included in a WhatsApp message template.
 * Understanding these components is essential for creating well-structured and effective templates.
 */
export enum WhatsappTemplateCreateComponentTypeCloudApiEnum {
  /** Header component of the template, typically containing a title or main message. */
  HEADER = "HEADER",
  /** Body component of the template, containing the main content of the message. */
  BODY = "BODY",
  /** Footer component of the template, often used for disclaimers or additional information. */
  FOOTER = "FOOTER",
  /** Buttons component of the template, allowing for interactive elements in the message. */
  BUTTONS = "BUTTONS",
}

/**
 * @enum {string}
 * @description Enumeration for the formats of components in a WhatsApp template.
 * @remarks This enum specifies the different content types that can be used in various parts of a WhatsApp template.
 * It's important for creating rich, engaging messages that go beyond simple text.
 */
export enum WhatsappTemplateCreateComponentFormatCloudApiEnum {
  /** Text format for components that contain only text. */
  TEXT = "TEXT",
  /** Image format for components that include an image. */
  IMAGE = "IMAGE",
  /** Document format for components that include a document file. */
  DOCUMENT = "DOCUMENT",
  /** Video format for components that include a video file. */
  VIDEO = "VIDEO",
}

/**
 * @enum {string}
 * @description Enumeration for the types of buttons in a WhatsApp template.
 * @remarks This enum defines the different types of interactive buttons that can be included in a WhatsApp template.
 * These buttons enhance user engagement and provide quick action options within the message.
 */
export enum WhatsappTemplateCreateButtonTypeCloudApiEnum {
  /** Button that triggers a phone call when pressed. */
  PHONE_NUMBER = "PHONE_NUMBER",
  /** Button that opens a URL when pressed. */
  URL = "URL",
  /** Button that sends a predefined quick reply when pressed. */
  QUICK_REPLY = "QUICK_REPLY",
  /** Button that copies a code to the user's clipboard when pressed. */
  COPY_CODE = "COPY_CODE",
}

/**
 * @enum {string}
 * @description Enumeration for the names of WhatsApp templates used in the system.
 * This enum provides a centralized list of all WhatsApp template names used in the application.
 * It helps maintain consistency in template naming and usage across the system.
 * Each template serves a specific purpose in the user communication flow, from onboarding to notifications.
 */
export enum WhatsappTemplateNameEnum {
  /**
   * Template for candidate referral query by employer.
   * Used when an employer inquires about referring a specific candidate.
   */
  CAND_QUERY_FOR_REFERRAL_BY_EMP = "cand_referral_query_by_emp",

  /**
   * Template for new chat message notification from employer to candidate.
   * Alerts the candidate about a new message from an employer.
   */
  CAND_NEW_CHAT_MSG_FROM_EMP_NOTIFICATION = "cand_new_chat_msg_from_emp_notification",
  
  /**
   * Template for notification when a candidate's premium subscription expires.
   * Alerts the candidate about the expiration of their premium features.
   */
  CAND_PREMIUM_EXPIRED_NOTIFICATION = "cand_premium_expired_notification",

  /**
   * Template for automatic cancellation of candidate referral after X days.
   * Notifies relevant parties when a referral request is automatically cancelled due to inactivity.
   */
  CAND_REF_AUTO_CANCEL_AFTER_X_DAYS = "cand_ref_auto_cancel_after_x_days",

  /**
   * Template for automatic rejection of candidate referral after X days.
   * Notifies relevant parties when a referral request is automatically rejected due to lack of response.
   */
  CAND_REF_AUTO_REJECT_AFTER_X_DAYS = "cand_ref_auto_reject_after_x_days",

  //=====================================================================================//
  //=====================================================================================//

  /**
   * Template for notification when an employer's referral request is accepted.
   * Informs the employer that a candidate has accepted their referral request.
   */
  EMP_PENDING_ACCEPTED_REFERRAL_REQ_NOTIFICATION = "emp_pending_accepted_referral_req_notification",

  /**
   * Template for notification on pending referral request counts.
   * Provides a summary of awaiting referral requests to the employer.
   */
  EMP_PENDING_AWAITING_REFERRAL_REQ_COUNTS_NOTIFICATION = "emp_pending_awaiting_referral_req_counts_notification",

  /**
   * Template for notification on accepted referral request counts.
   * Summarizes the number of referral requests that have been accepted.
   */
  EMP_PENDING_ACCEPTED_REFERRAL_REQ_COUNTS_NOTIFICATION = "emp_pending_accepted_referral_req_counts_notification",

  /**
   * Template for new chat message notification from candidate to employer.
   * Alerts the employer about a new message from a candidate.
   */
  EMP_NEW_CHAT_MSG_FROM_CAND_NOTIFICATION = "emp_new_chat_msg_from_cand_notification",

  /**
   * Template for notification on pending chat messages by candidate.
   * Informs the employer about the number of unread messages from candidates.
   */
  EMP_PENDING_CHAT_MSG_COUNT_BY_CAND_NOTIFICATION = "emp_pending_chat_msg_count_by_cand_notification",

  /**
   * Welcome message template for employers.
   * Sent when a new employer joins the platform.
   */
  EMP_WELCOME_MSG = "emp_welcome_msg",

  /**
   * Template for notification when an employer receives a referral request.
   * Alerts the employer about a new referral request from a candidate.
   */
  EMP_NEW_REFERRAL_REQ_NOTIFICATION = "emp_received_referral_req_notification",

  /**
   * Template for notification when an employer accepts a referral request.
   * Confirms to the employer that they have accepted a candidate's referral request.
   */
  EMP_ACCEPTED_REFERRAL_REQ_NOTIFICATION = "emp_accepted_referral_req_notification",

  /**
   * Template for notification when an employer completes a referral for a candidate.
   * Informs the employer that they have successfully completed a referral process.
   */
  EMP_REFERRAL_DONE_FOR_CAND = "emp_referral_done_for_cand",

  /**
   * Template for email verification pending notification to employer.
   * Used when an employer needs to verify their work email address.
   */
  EMP_WORK_EMAIL_VERIFY_PENDING_NOTIFICATION = "emp_work_email_verify_pending_notification",

  /**
   * Template for notification when an employer switches profiles.
   * Confirms to the employer that they have successfully switched to a different profile.
   */
  EMP_SWITCH_PROFILE_NOTIFICATION = "emp_switch_profile_notification",

  /**
   * Template for review rating by candidate for employer.
   * Prompts the candidate to provide a rating and review for an employer.
   */
  EMP_REVIEW_RATING_BY_CAND = "emp_review_rating_by_cand",

  /**
   * Template for employer referral query by candidate.
   * Used when a candidate inquires about being referred by a specific employer.
   */
  EMP_QUERY_FOR_REFERRAL_BY_CAND = "emp_referral_query_by_cand",

  /**
   * Template for corporate user email OTP request.
   * Sends a one-time password to corporate users for email verification.
   */
  USER_CORPORATE_REQUEST_EMAIL_OTP = "user_corporate_request_email_otp",
}
