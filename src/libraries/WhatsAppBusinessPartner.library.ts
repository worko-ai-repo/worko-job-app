// import the DTOs
import { WhatsAppBusinessPartnerSendMessageCloudApiDto } from "../dtos/WhatsAppBusinessPartner.dto";
import { WhatsAppBusinessPartnerPlaceholderParamDto } from "../dtos/WhatsAppBusinessPartnerTemplatePlaceholder.dto";
import { WhatsAppBusinessPartnerMessageLogCreateDto } from "../dtos/WhatsAppBusinessPartnerMessageLog.dto";

// import the enums
import { WhatsAppBusinessPartnerTemplateNameEnum } from "../enums/WhatsAppBusinessPartnerTemplate.enum";
import { WhatsappTemplateStatusEnum } from "../enums/WhatsappTemplate.enum";
import { UserContextTypeEnum } from "../enums/User.enum";

// import the libraries
import { whatsAppBusinessPartnerCloudApiLibraryObj } from "./WhatsAppBusinessPartnerCloudApi.library";

// import the models
import { DbWhatsappTemplateDto } from "../db/models/WhatsappTemplate.model";
import { DbWhatsAppBusinessPartnerMessageLogDto } from "../db/models/WhatsAppBusinessPartnerMessageLog.model";

// import the services
import { whatsappTemplateServiceObj } from "../services/WhatsappTemplate.service";
import { whatsAppBusinessPartnerMessageLogServiceObj } from "../services/WhatsAppBusinessPartnerMessageLog.service";

/**
 * WhatsAppBusinessPartnerLibrary
 */
class WhatsAppBusinessPartnerLibrary {
  /**
   * sendWhatsAppBusinessPartnerWhatsappMessage
   *
   * This method orchestrates the process of sending a WhatsApp message to a recipient using a predefined template.
   * It handles the preparation of message components, retrieval of template details, sending the message via the
   * WhatsAppBusinessPartner cloud API, and logging the message activity.
   *
   * @param {WhatsAppBusinessPartnerTemplateNameEnum} templateName - The enum value representing the name of the template to use.
   * @param {string} toPhoneNumber - The recipient's phone number in international format.
   * @param {WhatsAppBusinessPartnerPlaceholderParamDto} templatePlaceholders - An object containing placeholder values for the message template.
   * @param {string} userEmail - The email of the reciever.
   * @param {string | undefined} [contextId] - Optional context ID for the message, can be used to link the message to a specific entity or transaction.
   * @param {UserContextTypeEnum | undefined} [contextType] - Optional context type for the message, useful for categorization.
   * @returns {Promise<{
   *   systemLogId: string | null;
   *   whatsAppBusinessPartnerSendMessageResponseId: string | null | undefined;
   * }>} - A Promise that resolves to the system log ID of the sent message or null if the message was not sent.
   */
  async sendWhatsAppBusinessPartnerWhatsappMessage(
    templateName: WhatsAppBusinessPartnerTemplateNameEnum,
    toPhoneNumber: string, // `919666308109`, without `+` sign
    templatePlaceholders: WhatsAppBusinessPartnerPlaceholderParamDto,
    userEmail: string, // Receiver email
    contextId?: string,
    contextType?: UserContextTypeEnum
  ): Promise<{
    systemLogId: string | null;
    whatsAppBusinessPartnerSendMessageResponseId: string | null | undefined;
  }> {
    global.logger.info(
      "Send WhatsAppBusinessPartner whatsapp message [library]",
      {
        filePath: __filename,
        methodName: this.sendWhatsAppBusinessPartnerWhatsappMessage.name,
        templateName: templateName,
        toPhoneNumber: toPhoneNumber,
        templatePlaceholders: templatePlaceholders,
        contextId: contextId,
        contextType: contextType,
      }
    );

    // Retrieve the WhatsAppBusinessPartner WhatsApp template details and If not found, log the message and return appropriate response
    let whatsAppBusinessPartnerTemplateDetails: DbWhatsappTemplateDto =
      await whatsappTemplateServiceObj.getWhatsappTemplateByName(templateName);
    if (!whatsAppBusinessPartnerTemplateDetails) {
      global.logger.info(
        `WhatsApp Template With Name "${templateName}" Not Found.`,
        {
          filePath: __filename,
          methodName: this.sendWhatsAppBusinessPartnerWhatsappMessage.name,
          templateName: templateName,
        }
      );
      return {
        systemLogId: null,
        whatsAppBusinessPartnerSendMessageResponseId: null,
      };
    }

    // Check if the status is not ENABLED and if it was not enabled, log the message and return appropriate response
    if (
      whatsAppBusinessPartnerTemplateDetails.status !==
      WhatsappTemplateStatusEnum.ENABLED
    ) {
      // Logger message
      global.logger.info(
        `Unable to send the "${templateName}" template because WhatApp Business Partner template is disabled or soft deleted in database."`,
        {
          filePath: __filename,
          methodName: this.sendWhatsAppBusinessPartnerWhatsappMessage.name,
        }
      );

      return {
        systemLogId: null,
        whatsAppBusinessPartnerSendMessageResponseId: null,
      };
    }

    // Prepare the WhatsAppBusinessPartner WhatsApp template message data to be sent
    const sendTemplateMessage: WhatsAppBusinessPartnerSendMessageCloudApiDto = {
      templateName: whatsAppBusinessPartnerTemplateDetails.whatsappTemplateName, // Name of the WhatsApp template
      templateLang: whatsAppBusinessPartnerTemplateDetails.whatsappLanguage, // Language for the template (e.g., 'en')
      toPhoneNumber: toPhoneNumber.toString(), // Customer's mobile number (e.g., '919666308109')
      placeholders: Object.values(templatePlaceholders), // Array of variables to be inserted into the template
    };
    global.logger.debug("send Template Message Argument:", {
      sendTemplateMessage,
      filePath: __filename,
      methodName: this.sendWhatsAppBusinessPartnerWhatsappMessage.name,
    });

    /*
    Sample Success Response: 
    {
      "contacts": [
        {
          "input": "919666308100",
          "wa_id": "919666308100"
        }
      ],
      "messages": [
        {
          "id": "wamid.HBgMOTE5NjY2MzA4MTAwFQIAERgSNzcyRTlEN0E2MkU1QjIxMzdFAA==",
          "message_status": "accepted"
        }
      ],
      "messaging_product": "whatsapp"
    }
    */
    const whatsAppBusinessPartnerTemplateSendMessage =
      await whatsAppBusinessPartnerCloudApiLibraryObj.sendTemplateMessage(
        sendTemplateMessage
      );
    global.logger.debug(
      "WhatsApp Business Partner Template Details After Sending Message:",
      {
        whatsAppBusinessPartnerTemplateSendMessage,
        filePath: __filename,
        methodName: this.sendWhatsAppBusinessPartnerWhatsappMessage.name,
      }
    );

    // Initialize response variables as undefined and set them if message_status and id are present
    let whatsAppBusinessPartnerSendMessageResponseStatus: string | undefined;
    let whatsAppBusinessPartnerSendMessageResponseId: string | undefined;
    if (
      whatsAppBusinessPartnerTemplateSendMessage?.messages?.[0]
        ?.message_status &&
      whatsAppBusinessPartnerTemplateSendMessage?.messages?.[0]?.id
    ) {
      whatsAppBusinessPartnerSendMessageResponseStatus =
        whatsAppBusinessPartnerTemplateSendMessage.messages[0].message_status;
      whatsAppBusinessPartnerSendMessageResponseId =
        whatsAppBusinessPartnerTemplateSendMessage.messages[0].id;
    }

    // Prepare the WhatsAppBusinessPartner WhatsApp template message log entry to be stored in the database
    const whatsAppBusinessPartnerMessagelogEntry: WhatsAppBusinessPartnerMessageLogCreateDto =
      {
        templateName: templateName,
        templatePlaceholders: templatePlaceholders,
        toPhoneNumber: parseInt(toPhoneNumber),
        fromPhoneNumber: parseInt(
          process.env
            .APP_WHATSAPP_BUSINESS_PARTNER_CLOUD_API_FROM_PHONE_NUMBER as string
        ),
        contextId: contextId,
        contextType: contextType,
        whatsAppBusinessPartnerSendMessageResponse:
          whatsAppBusinessPartnerTemplateSendMessage,
        whatsAppBusinessPartnerSendMessageResponseStatus:
          whatsAppBusinessPartnerSendMessageResponseStatus,
        whatsAppBusinessPartnerSendMessageResponseId:
          whatsAppBusinessPartnerSendMessageResponseId,
      };

    // Store the WhatsAppBusinessPartner WhatsApp template message log entry in the database
    const whatsAppBusinessPartnerMessageLog: DbWhatsAppBusinessPartnerMessageLogDto =
      await whatsAppBusinessPartnerMessageLogServiceObj.createWhatsAppBusinessPartnerMessageLog(
        whatsAppBusinessPartnerMessagelogEntry,
        userEmail
      );

    // Return the system log ID and WhatsAppBusinessPartner WhatsApp template message response ID
    return {
      systemLogId: whatsAppBusinessPartnerMessageLog.id,
      whatsAppBusinessPartnerSendMessageResponseId:
        whatsAppBusinessPartnerMessageLog.whatsAppBusinessPartnerSendMessageResponseId,
    };
  }
}

// create an instance of the WhatsAppBusinessPartnerLibrary class
const whatsAppBusinessPartnerLibraryObj = new WhatsAppBusinessPartnerLibrary();

// Export an instance of the WhatsAppBusinessPartnerLibrary class and the WhatsAppBusinessPartnerLibrary class
export { whatsAppBusinessPartnerLibraryObj, WhatsAppBusinessPartnerLibrary };
