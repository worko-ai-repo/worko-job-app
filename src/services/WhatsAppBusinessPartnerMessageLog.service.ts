// import the daos
import { whatsAppBusinessPartnerMessageLogDaoObj } from "../daos/WhatsAppBusinessPartnerMessageLog.dao";

// import the DTOs
import { WhatsAppBusinessPartnerMessageLogCreateDto } from "../dtos/WhatsAppBusinessPartnerMessageLog.dto";

// import the models
import { DbWhatsAppBusinessPartnerMessageLogDto } from "../db/models/WhatsAppBusinessPartnerMessageLog.model";

/**
 * WhatsAppBusinessPartnerMessageLogService
 *
 * Service class for handling operations related to WhatsAppBusinessPartner message logs.
 * It manages the creation, retrieval, updating, and processing of logs
 * for WhatsAppBusinessPartner messages sent and received.
 */
class WhatsAppBusinessPartnerMessageLogService {
  /**
   * createWhatsAppBusinessPartnerMessageLog
   *
   * This method stores the details of a sent WhatsAppBusinessPartner message in the database.
   *
   * @param {WhatsAppBusinessPartnerMessageLogCreateDto} whatsAppBusinessPartnerMessagelogEntry - The details of the WhatsAppBusinessPartner message to log.
   * @param {string} userEmail - The email of the user associated with the message log.
   * @returns {Promise<DbWhatsAppBusinessPartnerMessageLogDto>} - A promise that resolves to the database entry of the created log.
   */
  async createWhatsAppBusinessPartnerMessageLog(
    whatsAppBusinessPartnerMessagelogEntry: WhatsAppBusinessPartnerMessageLogCreateDto,
    userEmail: string
  ): Promise<DbWhatsAppBusinessPartnerMessageLogDto> {
    global.logger.info(
      "Creating WhatsAppBusinessPartner message log [service]",
      {
        filePath: __filename,
        methodName: this.createWhatsAppBusinessPartnerMessageLog.name,
        userEmail: userEmail,
      }
    );

    // Create the log entry in the database
    return whatsAppBusinessPartnerMessageLogDaoObj.createWhatsAppBusinessPartnerMessageLog(
      whatsAppBusinessPartnerMessagelogEntry,
      userEmail
    );
  }
}

// Create an instance of the WhatsAppBusinessPartnerMessageLogService class
const whatsAppBusinessPartnerMessageLogServiceObj =
  new WhatsAppBusinessPartnerMessageLogService();

// Export an instance of the WhatsAppBusinessPartnerMessageLogService class and the WhatsAppBusinessPartnerMessageLogService class
export {
  whatsAppBusinessPartnerMessageLogServiceObj,
  WhatsAppBusinessPartnerMessageLogService,
};
