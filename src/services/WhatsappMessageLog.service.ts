// Import DTOs
import {
  WhatsappMessageLogCreateApiDto,
  WhatsappMessageLogCreateDto,
  WhatsappMessageLogUpdateDto,
  WhatsappWebhookLogRecievedCreateDto,
} from "../dtos/WhatsappMessageLog.dto";

// Import Models
import { DbWhatsappMessageLogDto } from "../db/models/WhatsappMessageLog.model";

// Import Libraries
import { BaseError } from "../utils/errors.util";
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import dao
import whatsappMessageLogDao from "../daos/WhatsappMessageLog.dao";

// Import enums
import { WhatsappMessageStatusEnum } from "../enums/WhatsappMessageLog.enum";
// import UserDetailService from "./UserDetail.service";

/**
 * WhatsappMessageLogService
 *
 * Service class for handling operations related to WhatsApp message logs.
 * It manages the creation, retrieval, updating, and processing of logs
 * for WhatsApp messages sent and received.
 */
class WhatsappMessageLogService {
  /**
   * Creates a new WhatsApp message log entry in the database.
   *
   * This method stores the details of a sent WhatsApp message in the database,
   * including the message ID, sender and receiver information, and any placeholders used.
   *
   * @param {WhatsappMessageLogCreateDto} whatsappMessage - The details of the WhatsApp message to log.
   * @returns {Promise<DbWhatsappMessageLogDto>} - A promise that resolves to the database entry of the created log.
   */
  async createWhatsappMessageLog(
    whatsappMessage: WhatsappMessageLogCreateApiDto
  ): Promise<DbWhatsappMessageLogDto> {
    global.logger.info(
      "WhatsappMessageLogService: createWhatsappMessageLog: [service]"
    );

    // create the body of the whatsapp message log
    let whatsappMessageLogSendBody: WhatsappMessageLogCreateDto = {
      userId: whatsappMessage.userId,
      templateName: whatsappMessage.templateName, // The name of the WhatsApp message template.
      whatsappMessageId: whatsappMessage.templateName, // Unique ID for the WhatsApp message.
      status: whatsappMessage.status, // Current status of the WhatsApp message.
      fromPhoneNumber: whatsappMessage.fromPhoneNumber, // Phone number from which the message is sent.
      toPhoneNumber: whatsappMessage.toPhoneNumber, // Phone number to which the message is sent.
      templatePlaceholders: whatsappMessage.templatePlaceholders, // Placeholder parameters for the message template.
      contextType: whatsappMessage.contextType, // Optional context type for the message.
      contextId: whatsappMessage.contextId, // Optional context ID for the message.
      createdByUserId: whatsappMessage.createdByUserId, // ID of the user who created the message.
    };

    // Call the DAO to create a new WhatsApp message log in the database
    return whatsappMessageLogDao.createWhatsappMessageLog(
      whatsappMessage.userEmail,
      whatsappMessageLogSendBody
    );
  }

  /**
   * Retrieves a WhatsApp message log by its ID from the database.
   *
   * This method fetches the log details of a specific WhatsApp message using its ID.
   *
   * @param {string} whatsappMessage - The ID of the WhatsApp message log to retrieve.
   * @returns {Promise<QueryResponse<DbWhatsappMessageLogDto>>} - A promise that resolves to the retrieved message log details.
   */
  async getWhatsappMessageLogById(
    whatsappMessage: string
  ): Promise<QueryResponse<DbWhatsappMessageLogDto>> {
    global.logger.info(
      "WhatsappMessageLogService: getWhatsappMessageLogById: [service]"
    );

    // Call the DAO to get the WhatsApp message log by its ID
    return whatsappMessageLogDao.getWhatsappMessageLogById(whatsappMessage);
  }

  /**
   * Updates an existing WhatsApp message log in the database.
   *
   * This method updates the details of an existing WhatsApp message log,
   * such as the status and any additional webhook responses received.
   *
   * @param {string} userEmail - The email of the user associated with the message log.
   * @param {string} id - The ID of the WhatsApp message log to update.
   * @param {WhatsappMessageLogUpdateDto} whatsappMessage - The updated message log details.
   * @returns {Promise<DbWhatsappMessageLogDto>} - A promise that resolves to the updated message log.
   */
  async updateWhatsappMessageLog(
    userEmail: string,
    id: string,
    whatsappMessage: WhatsappMessageLogUpdateDto
  ): Promise<DbWhatsappMessageLogDto> {
    global.logger.info(
      "WhatsappMessageLogService: updateWhatsappMessageLog: [service]"
    );
    // Call the DAO to update the WhatsApp message log with the provided details
    return whatsappMessageLogDao.updateWhatsappMessageLog(
      userEmail,
      id,
      whatsappMessage
    );
  }

//   /**
//    * Processes a received WhatsApp message log from the webhook.
//    *
//    * This method updates the message log based on the data received from a webhook,
//    * including updating the status and logging the received message content.
//    *
//    * @param {WhatsappWebhookLogRecievedCreateDto} whatsappWebhookReceivedLog - The received webhook log details.
//    * @returns {Promise<void>} - A promise that resolves when the processing is complete.
//    */
//   async processWhatsappReceivedMessageLog(
//     whatsappWebhookReceivedLog: WhatsappWebhookLogRecievedCreateDto
//   ): Promise<DbWhatsappMessageLogDto> {
//     // Log the received webhook for debugging purposes
//     global.logger.info("Received webhook log: ", whatsappWebhookReceivedLog);

//     // Retrieve the message ID from the received webhook log
//     let whatsappMessageId = whatsappWebhookReceivedLog.messageId;

//     // Get the existing message log details using the message ID
//     let whatsappMessageLogDetails = await this.getWhatsappMessageLogById(
//       whatsappMessageId
//     );

//     // Extract the first (and expectedly only) log entry from the results
//     let whatsappMessageLogDetail = whatsappMessageLogDetails[0];

//     // Check if any message log details were found
//     if (!whatsappMessageLogDetails.count) {
//       // Throw an error if the message log is not found in the database
//       throw new BaseError(
//         `WhatsApp message log with id "${whatsappMessageId}" not found.`
//       );
//     }

//     // Get the existing webhook responses from the log, or initialize an empty array if none exist
//     const existingResponses =
//       whatsappMessageLogDetail.whatsappWebhookLogRecievedResponse || [];

//     // Create a new array by concatenating the existing responses with the new response
//     const updatedResponses = [...existingResponses, whatsappWebhookReceivedLog];

//     // Prepare the updated data for the message log
//     const updatedData: WhatsappMessageLogUpdateDto = {
//       whatsappWebhookLogRecievedResponse: updatedResponses,
//       status: WhatsappMessageStatusEnum.READ, // Update the status to READ
//     };

//     // Log the updated data for debugging purposes
//     global.logger.debug("Updated data: " + updatedData);

//     // Extract user details to retrive user email from user id
//     let userDeatil = await UserDetailService.getUserById(
//       whatsappMessageLogDetail.userId
//     );
//     if (!userDeatil.count) {
//       throw new BaseError(
//         `User with id "${whatsappMessageLogDetail.userId}" not found.`
//       );
//     }
//     let userEmail = userDeatil[0].emailList.primary;

//     // Update the WhatsApp message log details in the database
//     let updatedWhatsappMessageLog = await this.updateWhatsappMessageLog(
//       userEmail,
//       whatsappMessageLogDetail.id,
//       updatedData
//     );

//     // Return the updated message log
//     return updatedWhatsappMessageLog;

//     // Uncomment the following lines if context type handling is needed
//     // if (whatsappMessageLogDetails[0].contextType === "REFERRAL") {
//     //   await UserReferralService.updateReferralStatusOnEvent(
//     //     whatsappMessageLogDetails[0].userEmail, // Email associated with the referral
//     //     whatsappMessageLogDetails[0].contextId, // Context ID for the referral
//     //     whatsappWebhookReceivedLog.messageContent // Message content from the received log
//     //   );
//     // }
//   }
}

// Export a singleton instance of the WhatsappMessageLogService class
const whatsappMessageLogServiceObj = new WhatsappMessageLogService();
export { whatsappMessageLogServiceObj, WhatsappMessageLogService };
