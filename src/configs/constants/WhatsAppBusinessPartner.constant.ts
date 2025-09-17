/**
 * WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS
 *
 * This object contains constants and configuration details specifically WHATSAPP_BUSINESS_PARTNER WhatsApp api integration.
 */
const WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS = {
  /**
   * ENABLED
   *
   * This constant defines whether the WhatsAppBusinessPartner whatsapp send message to users is enabled or not at system level.
   */
  ENABLED: true,

  /**
   * MESSAGING_PRODUCT
   */
  MESSAGING_PRODUCT: {
    WHATSAPP: "whatsapp", // Currently We only using `whatsapp` Messaging Product
  },

  /**
   * RECIPIENT_TYPE
   *
   * This constant defines the recipient type for the WhatsAppBusinessPartner whatsapp integration.
   */
  RECIPIENT_TYPE: {
    INDIVIDUAL: "individual", // Currently We only using `individual` Recipient Type
  },

  /**
   * MESSAGE_TYPE
   */
  MESSAGE_TYPE: {
    TEMPLATE: "template",
  },

  /**
   * TEMPLATE_LANGUAGE_CODE
   *
   * This constant defines the language code for the WhatsAppBusinessPartner whatsapp integration.
   */
  TEMPLATE_LANGUAGE_CODE: {
    ENGLISH: "en", // Currently We only using `en` Template Language Code
    ENGLISH_US: "en_US",
  },

  /**
   * COMPONENTS_TYPE
   */
  COMPONENTS_TYPE: {
    BODY: "body", // Currently We only using `body` Component Type
    HEADER: "header",
  },

  /**
   * PARAMETERS_TYPE
   */
  PARAMETERS_TYPE: {
    TEXT: "text", // Currently We only using `text` Parameter Type
    DOCUMENT: "document",
  },
};

/**
 * WHATSAPP_BUSINESS_PARTNER_CLOUD_API_ENDPOINTS
 *
 * This object contains endpoint URLs for various WhatsAppBusinessPartner Cloud API operations.
 * The URLs are parameterized and should be populated with actual values before use.
 */
const WHATSAPP_BUSINESS_PARTNER_CLOUD_API_ENDPOINTS = {
  // In Near future we will add endpoints
  SEND_TEMPLATE_MESSAGE_URL: `{baseUrl}/{fromPhoneNumberId}/messages`,
};

// export constants
export {
  WHATSAPP_BUSINESS_PARTNER_APP_CONSTANTS,
  WHATSAPP_BUSINESS_PARTNER_CLOUD_API_ENDPOINTS,
};
