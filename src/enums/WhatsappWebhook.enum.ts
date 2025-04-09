/**
 * @enum {string}
 * @description Enumeration for the status of a WhatsApp message in the Cloud API.
 * @remarks This enum is used to track the lifecycle of a message from sending to reading.
 * It's crucial for monitoring message delivery and engagement in the WhatsApp Business API.
 */
export enum WhatsappWebhookMessageStatusTypeCloudApiEnum {
  /** Message has been sent from the WhatsApp server. */
  SENT = "sent",
  /** Message has been delivered to the recipient's device. */
  DELIVERED = "delivered",
  /** Message has been read by the recipient. */
  READ = "read",
  /** Message failed to send due to various possible reasons (e.g., network issues, invalid recipient). */
  FAILED = "failed",
}

/**
 * @enum {string}
 * @description Enumeration for the origin type of a conversation in the WhatsApp Cloud API.
 * @remarks This enum helps categorize conversations based on who initiated them,
 * which is important for analytics, compliance, and determining applicable rates.
 */
export enum WhatsappWebhookConversationOriginTypeCloudApiEnum {
  /** Conversation initiated by the business, typically through a template message. */
  BUSINESS_INITIATED = "business_initiated",
  /** Conversation initiated by the customer, often in response to a call-to-action or ad. */
  CUSTOMER_INITIATED = "customer_initiated",
  /** Conversation started through a referral link or ad that led to a conversion. */
  REFERRAL_CONVERSION = "referral_conversion",
}

/**
 * @enum {string}
 * @description Enumeration for different pricing categories in the WhatsApp Cloud API.
 * @remarks This enum is used to determine the pricing tier for messages, which can vary
 * based on the nature and purpose of the message. It's essential for billing and cost management.
 */
export enum WhatsappWebhookPricingCategoryTypeCloudApiEnum {
  /** Pricing for authentication-related messages (e.g., one-time passwords, account verification). */
  AUTHENTICATION = "authentication",
  /** Pricing for marketing-related messages (e.g., promotions, newsletters). May have higher rates. */
  MARKETING = "marketing",
  /** Pricing for utility messages (e.g., account updates, transaction notifications). */
  UTILITY = "utility",
  /** Pricing for service-related messages (e.g., customer support, appointment reminders). */
  SERVICE = "service",
  /** Pricing for messages related to referral conversions. May have special rates to encourage referrals. */
  REFERRAL_CONVERSION = "referral_conversion",
}

/**
 * @enum {string}
 * @description Enumeration for different webhook status types in WhatsApp.
 * @remarks This enum is used internally to track the progress of webhook event processing.
 * It helps in monitoring the reliability and performance of the webhook system.
 */
export enum WhatsappWebhookStatusTypeEnum {
  /** Webhook event has been received by the system but not yet processed. */
  RECEIVED = "RECEIVED",
  /** Webhook event has been successfully processed by the system. */
  PROCESSED = "PROCESSED",
  /** Webhook event has been successfully delivered to the intended endpoint. */
  DELIVERED = "DELIVERED",
  /** An error occurred during webhook processing or delivery. Requires investigation. */
  ERROR = "ERROR",
}
