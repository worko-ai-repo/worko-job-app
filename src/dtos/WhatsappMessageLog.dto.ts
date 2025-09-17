// Import Enums
import { UserContextTypeEnum } from "../enums/User.enum";
import { WhatsappMessageStatusEnum } from "../enums/WhatsappMessageLog.enum";
import { WhatsappMessageTypeCloudApiEnum } from "../enums/WhatsappMessageLog.enum";
import { WhatsappWebhookStatusTypeEnum } from "../enums/WhatsappWebhook.enum";

// Import DTOs
import { WhatsappPlaceholderParamDto } from "./WhatsappTemplatePlaceholder.dto";
import { WhatsappWebhookMessageCloudApiDto } from "./WhatsappWebhook.dto"

/**
 * Interface for sending a WhatsApp message.
 */
export interface WhatsappMessageLogCreateApiDto {
  userEmail: string; // The email of the user initiating the message.
  userId: string; // The user id of the user initiating the message.
  templateName: string; // The name of the WhatsApp message template.
  whatsappMessageId: string; // Unique ID for the WhatsApp message.
  status?: WhatsappMessageStatusEnum; // Current status of the WhatsApp message.
  fromPhoneNumber: string; // Phone number from which the message is sent.
  toPhoneNumber: string; // Phone number to which the message is sent.
  templatePlaceholders: WhatsappPlaceholderParamDto; // Placeholder parameters for the message template.
  contextType?: UserContextTypeEnum; // Optional context type for the message.
  contextId?: string; // Optional context ID for the message.
  whatsappWebhookLogRecievedResponse?: WhatsappWebhookLogRecievedCreateDto[]; // Log of received webhook responses.
  createdByUserId?: string; // ID of the user who created the message.
  updatedByUserId?: string; // ID of the user who updated the message.
}

/**
 * Interface for creating a WhatsApp message log entry.
 */
export interface WhatsappMessageLogCreateDto {
  userId: string;
  templateName: string; // The name of the WhatsApp message template.
  whatsappMessageId: string; // Unique ID for the WhatsApp message.
  status?: WhatsappMessageStatusEnum; // Current status of the WhatsApp message.
  fromPhoneNumber: string; // Phone number from which the message is sent.
  toPhoneNumber: string; // Phone number to which the message is sent.
  templatePlaceholders: WhatsappPlaceholderParamDto; // Placeholder parameters for the message template.
  contextType?: UserContextTypeEnum; // Optional context type for the message.
  contextId?: string; // Optional context ID for the message.
  whatsappWebhookLogRecievedResponse?: WhatsappWebhookLogRecievedCreateDto[]; // Log of received webhook responses.
  createdByUserId?: string; // ID of the user who created the message.
  updatedByUserId?: string; // ID of the user who updated the message.
}

/**
 * WhatsappWebhookLogRecievedCreateDto
 *
 * Interface for a received WhatsApp webhook log entry.
 *
 * NOTE : KINDLY REVIEW ATTR IF SOME ATTRIBUTES ARE NOT REQUIRED,
 * CONSIDER REMOVING THEM.
 */
export interface WhatsappWebhookLogRecievedCreateDto {
  messageId: string; // ID of the received message.
  messageType: WhatsappMessageTypeCloudApiEnum; // Type of the received message
  messageContent: string | number; // Content of the received message.
  messageOriginalContent: WhatsappWebhookMessageCloudApiDto;
  isReply: boolean; // Indicates if the message is a reply.
  conversationId: string; // ID of the conversation.
  status?: WhatsappWebhookStatusTypeEnum; // Status of the webhook response.
  mediaUrl?: string; // URL of media associated with the message.
  latitude?: number; // Latitude for location-based messages.
  longitude?: number; // Longitude for location-based messages.
  contactInfo?: {
    name: string; // Name of the contact.
    phoneNumber: string; // Phone number of the contact.
  };
}

/**
 * Interface for updating a WhatsApp message log entry.
 */
export interface WhatsappMessageLogUpdateDto {
  whatsappWebhookLogRecievedResponse?: WhatsappWebhookLogRecievedCreateDto[]; // Log of received webhook responses.
  status?: WhatsappMessageStatusEnum; // Current status of the WhatsApp message.
}
