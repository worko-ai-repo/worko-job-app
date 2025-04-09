// Import Local Packages
import { whatsappCloudApiLibraryObj } from "./WhatsappCloudApi.library";

// Import Models
import { DbWhatsappMessageLogDto } from "../db/models/WhatsappMessageLog.model";

// Import DTOs
import {
  WhatsappMessageLogCreateApiDto,
  WhatsappMessageLogCreateDto,
} from "../dtos/WhatsappMessageLog.dto";
import { WhatsappPlaceholderParamDto } from "../dtos/WhatsappTemplatePlaceholder.dto";

// Import Enums
import {
  WhatsappMessageParameterTypeCloudApiEnum,
  WhatsappMessageStatusEnum,
} from "../enums/WhatsappMessageLog.enum";
import { WhatsappTemplateNameEnum } from "../enums/WhatsappTemplate.enum";
import { UserContextTypeEnum } from "../enums/User.enum";

// Import Services
import { whatsappTemplateServiceObj } from "../services/WhatsappTemplate.service";
import { whatsappMessageLogServiceObj } from "../services/WhatsappMessageLog.service";

// Import Utilities
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * WhatsappLibrary
 *
 * This class provides methods to interact with the WhatsApp Business API for sending messages and logging message activities.
 * It encapsulates functionalities related to sending WhatsApp messages using templates and managing logs of those messages.
 * The library serves as a wrapper around the WhatsApp Cloud API, simplifying the process of sending template-based messages
 * and maintaining a record of all sent messages for tracking and analysis purposes.
 */
class WhatsappLibrary {
  /**
   * Sends a WhatsApp message using a specified template.
   *
   * This method orchestrates the process of sending a WhatsApp message to a recipient using a predefined template.
   * It handles the preparation of message components, retrieval of template details, sending the message via the
   * WhatsApp Cloud API, and logging the message activity.
   *
   * @param {string} userEmail - The email of the user initiating the message send operation.
   * @param {WhatsappTemplateNameEnum} templateName - The enum value representing the name of the template to use.
   * @param {string} toPhoneNumber - The recipient's phone number in international format.
   * @param {any} templatePlaceholders - An object containing placeholder values for the message template.
   * @param {UserContextTypeEnum} [contextType] - Optional context type for the message, useful for categorization.
   * @param {string} [contextId] - Optional context ID for the message, can be used to link the message to a specific entity or transaction.
   * @param {string} [fromPhoneNumber] - Optional sender's phone number. If not provided, uses the default number from environment variables.
   * @returns {Promise<DbWhatsappMessageLogDto>} - A Promise that resolves to the database log entry of the sent message.
   * @throws {BaseError} - Throws an error if the template is not found or if the user email is invalid.
   */
  async sendWhatsappMessage(
    userEmail: string,
    templateName: WhatsappTemplateNameEnum,
    toPhoneNumber: string,
    templatePlaceholders: any,
    contextType?: UserContextTypeEnum,
    contextId?: string,
    fromPhoneNumber?: string
  // ): Promise<DbWhatsappMessageLogDto> {
  ): Promise<boolean> {
    /**
     * NOTE:- We are disabled whatsapp message sending to users functionality using "META API INTEGRATION" because we need
     * to use "GROWAASAN API INTEGRATION" for whatsapp message sending to users.
     */
    return true;
    /*
    // Log the initiation of the message sending process
    global.logger.info(
      "Sending WhatsApp message from WhatsappLibrary... ",
      {
        templateName,
        toPhoneNumber,
        templatePlaceholders,
        contextType,
        contextId
      }
    );

    // Prepare the components for the WhatsApp message
    const components = await this.prepareWhatsappMessageComponents(templatePlaceholders);
    global.logger.info("Components for WhatsApp message:", components);

    // Retrieve the WhatsApp template details and If not found, log the message
    let whatsappTemplateDetails = await whatsappTemplateServiceObj.getWhatsappTemplateByName(templateName);
    if (!whatsappTemplateDetails) {
      global.logger.info(`WhatsApp template with name "${templateName}" not found.`);
    }

    // Send message using whatsappCloudApiLibraryObj's sendTemplateMessage method
    const whatsappTemplateSendMessage = await whatsappCloudApiLibraryObj.sendTemplateMessage(
      toPhoneNumber,
      templateName,
      whatsappTemplateDetails.whatsappLanguage,
      components
    );

    // Use the provided fromPhoneNumber or fall back to the default from environment variables
    fromPhoneNumber = fromPhoneNumber ?? (process.env.APP_WHATSAPP_CLOUD_API_FROM_PHONE_NUMBER as string);

    // Retrieve user details using the provided email
    let userDetails = await UserDetailService.get(userEmail);
    if (!userDetails.count) {
      throw new BaseError(`User with email "${userEmail}" not found.`, HttpStatusCode.NOT_FOUND_404);
    }

    // Create a log entry for the sent message
    const whatsappMessagelogEntry: WhatsappMessageLogCreateApiDto = {
      userEmail,
      userId: userDetails[0].id,
      templateName,
      toPhoneNumber,
      fromPhoneNumber,
      templatePlaceholders,
      contextType,
      contextId,
      whatsappMessageId: whatsappTemplateSendMessage.messageId,
      createdByUserId: userDetails[0].id, // @todo review this to ensure the id is of the user because of whom the message is being sent.
      status: WhatsappMessageStatusEnum.SENT,
    };

    // Create and return the WhatsApp message log entry
    return whatsappMessageLogServiceObj.createWhatsappMessageLog(whatsappMessagelogEntry);
    */
  }

  /**
   * Prepares the components for the WhatsApp message template based on the provided placeholders.
   *
   * This private method organizes the placeholder data into the format required by the WhatsApp API
   * for sending template-based messages. It separates header and body parameters and structures them
   * according to the WhatsApp API specifications.
   *
   * @param {WhatsappPlaceholderParamDto} placeholders - An object containing placeholder parameters for the message template.
   * @returns {Promise<any[]>} - A Promise that resolves to an array of components formatted for the WhatsApp API.
   * @private
   */
  private async prepareWhatsappMessageComponents(placeholders: WhatsappPlaceholderParamDto): Promise<any[]> {
    // Initialize arrays for components, header parameters, and body parameters
    const components: any[] = [];
    let headerParams: any[] = [];
    let bodyParams: any[] = [];

    // Iterate over the placeholders and organize them into header and body parameters
    Object.entries(placeholders).forEach(([key, placeholder]) => {
      const param = {
        type: placeholder.type,
        text: placeholder.value,
      };

      // Determine whether the placeholder is for header or body based on its key
      if (key.startsWith(WhatsappMessageParameterTypeCloudApiEnum.HEADER)) {
        headerParams.push(param);
      } else {
        bodyParams.push(param);
      }
    });

    // Add header component if there are any header parameters
    if (headerParams.length > 0) {
      components.push({
        type: WhatsappMessageParameterTypeCloudApiEnum.HEADER,
        parameters: headerParams,
      });
    }

    // Add body component if there are any body parameters
    if (bodyParams.length > 0) {
      components.push({
        type: WhatsappMessageParameterTypeCloudApiEnum.BODY,
        parameters: bodyParams,
      });
    }

    // Return the components formatted for the WhatsApp API
    return components;
  }
}

// create and Export an instance of the WhatsappLibrary class for use in other parts of the application
let whatsappLibraryObj = new WhatsappLibrary();
export {
  whatsappLibraryObj,
  WhatsappLibrary
};