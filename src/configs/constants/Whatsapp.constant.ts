
/**
 * WHATSAPP_APP_CONSTANTS
 *
 * This object contains constants and configuration details specifically for the WhatsApp integration,
 * including API settings and reminder scheduling for employee work email verification.
 */
const WHATSAPP_APP_CONSTANTS = {
  /** WhatsApp API version to be used */
  API_VERSION: "v20.0",

  /** WhatsApp webhook hub mode */
  WEBHOOK_HUB_MODE: "subscribe",
};

/**
 * WHATSAPP_CLOUD_API_ENDPOINTS
 *
 * This object contains endpoint URLs for various WhatsApp Cloud API operations.
 * The URLs are parameterized and should be populated with actual values before use.
 */
const WHATSAPP_CLOUD_API_ENDPOINTS = {
  /**
   * TEMPLATE_CREATE
   *
   * Endpoint for creating a new message template.
   * This URL is parameterized and needs to be populated with `baseUrl`, `apiVersion`,
   * and `whatsappBusinesssAccountId` before being used.
   */
  TEMPLATE_CREATE:
    "{baseUrl}/{apiVersion}/{whatsappBusinesssAccountId}/message_templates",

  /**
   * TEMPLATE_UPDATE
   *
   * Endpoint for updating an existing message template.
   * This URL is parameterized and needs to be populated with `baseUrl`, `apiVersion`,
   * and `whatsappBusinesssAccountId` before being used.
   */
  TEMPLATE_UPDATE:
    "{baseUrl}/{apiVersion}/{whatsappBusinesssAccountId}/message_templates",

  /**
   * TEMPLATE_GET
   *
   * Endpoint for retrieving a specific message template by its name.
   * This URL is parameterized and needs to be populated with `baseUrl`, `apiVersion`,
   * `whatsappBusinesssAccountId`, and `templateName` before being used.
   */
  TEMPLATE_GET:
    "{baseUrl}/{apiVersion}/{whatsappBusinesssAccountId}/message_templates?name={templateName}",

  /**
   * TEMPLATE_DELETE
   *
   * Endpoint for deleting a specific message template by its name.
   * This URL is parameterized and needs to be populated with `baseUrl`, `apiVersion`,
   * `whatsappBusinesssAccountId`, and `templateName` before being used.
   */
  TEMPLATE_DELETE:
    "{baseUrl}/{apiVersion}/{whatsappBusinesssAccountId}/message_templates/{templateName}",

  /**
   * MSG_SEND_USING_TEMPLATE
   *
   * Endpoint for sending a message using a message template.
   * This URL is parameterized and needs to be populated with `baseUrl`, `apiVersion`,
   * and `fromPhoneNumberId` before being used.
   */
  MSG_SEND_USING_TEMPLATE:
    "{baseUrl}/{apiVersion}/{fromPhoneNumberId}/messages",
};

// Exports the constants and API endpoints as a single object
export { WHATSAPP_APP_CONSTANTS, WHATSAPP_CLOUD_API_ENDPOINTS };
