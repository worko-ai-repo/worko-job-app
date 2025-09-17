export enum WhatsappMessageStatusEnum {
  QUEUED = "QUEUED",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

/**
 * @enum {string}
 * @description Enumeration for different types of WhatsApp messages.
 */
export enum WhatsappMessageTypeCloudApiEnum {
  TEXT = "text", // Text message.
  REACTION = "reaction", // Reaction to a message.
  IMAGE = "image", // Image message.
  VIDEO = "video", // Video message.
  AUDIO = "audio", // Audio message.
  DOCUMENT = "document", // Document message.
  STICKER = "sticker", // Sticker message.
  LOCATION = "location", // Location message.
  CONTACTS = "contacts", // Contacts message.
  BUTTON = "button", // Button message (interactive elements).
  INTERACTIVE = "interactive", // Interactive message (e.g., quick replies, list messages).
  ORDER = "order", // Order message.
  SYSTEM = "system", // System message (e.g., notifications, alerts).
  UNKNOWN = "unknown", // Unknown message type (for unexpected or unsupported types).
}
/**
 * @enum {string}
 * @description Enumeration for different types of WhatsApp messages for parameters.
 */
export enum WhatsappMessageParameterTypeCloudApiEnum {
  HEADER = "header",
  BODY = "body",
  FOOTER = "footer",
}
