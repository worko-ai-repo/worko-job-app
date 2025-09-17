// Import daos
import BaseDao from "./Base.dao";

// Import dtos
import { WhatsAppBusinessPartnerMessageLogCreateDto } from "../dtos/WhatsAppBusinessPartnerMessageLog.dto";

// Import models
import {
  WhatsAppBusinessPartnerMessageLogModel,
  DbWhatsAppBusinessPartnerMessageLogDto,
} from "../db/models/WhatsAppBusinessPartnerMessageLog.model";

// Import services
import UlidService from "../services/Ulid.service";

/**
 * WhatsAppBusinessPartnerMessageLogDao
 *
 * This data access object (DAO) handles interactions with the WhatsAppBusinessPartner message log database table.
 * It implements the BaseDao interface and provides methods to create and retrieve message log entries.
 */
class WhatsAppBusinessPartnerMessageLogDao implements BaseDao {
  modelName = "WhatsAppBusinessPartnerMessageLog";
  partitianKey = "USR#EML#{primaryEmail}"; // Email Id of the Receiver
  sortKeys = {
    SK_INIT: "WBP#LOG#ID#{id}", // `WBP` means `WhatsAppBusinessPartner` for Naming conventions we are using this shortcut
  };
  GSI1PK = "WBP#LOG#"; // `WBP` means `WhatsAppBusinessPartner` for Naming conventions we are using this shortcut
  GSI1SK = "ID#{id}";

  /**
   * createWhatsAppBusinessPartnerMessageLog
   *
   * This method generates a unique ID for the log entry, constructs the request payload with the necessary attributes,
   * and saves the log entry to the database.
   *
   * @param {WhatsAppBusinessPartnerMessageLogCreateDto} whatsAppBusinessPartnerMessagelogEntry - The details of the WhatsAppBusinessPartner message to log.
   * @param {string} userEmail - The email of the user associated with the message log.
   * @returns {Promise<DbWhatsAppBusinessPartnerMessageLogDto>} - A promise that resolves to the database entry of the created log.
   */
  async createWhatsAppBusinessPartnerMessageLog(
    whatsAppBusinessPartnerMessagelogEntry: WhatsAppBusinessPartnerMessageLogCreateDto,
    userEmail: string
  ): Promise<DbWhatsAppBusinessPartnerMessageLogDto> {
    // Generate a unique ID for the log entry
    let ulidId: string = UlidService.getUlidId();

    // logger
    global.logger.info(`Creating WhatsAppBusinessPartner message log entry.`, {
      filePath: __filename,
      methodName: this.createWhatsAppBusinessPartnerMessageLog.name,
      ulidId: ulidId,
    });

    // Construct the request payload to create the entry in the database
    let whatsAppBusinessPartnerMessageLogCreateRequest = {
      ...whatsAppBusinessPartnerMessagelogEntry,
      PK: this.partitianKey.strtr({
        "{primaryEmail}": userEmail,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": ulidId,
      }),
      id: ulidId,
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": ulidId,
      }),
      recieverEmail: userEmail,
    };

    // Save the log entry to the database
    return WhatsAppBusinessPartnerMessageLogModel.create(
      whatsAppBusinessPartnerMessageLogCreateRequest
    );
  }
}

// create an instance of the WhatsAppBusinessPartnerMessageLogDao class
const whatsAppBusinessPartnerMessageLogDaoObj =
  new WhatsAppBusinessPartnerMessageLogDao();

// Export an instance of the WhatsAppBusinessPartnerMessageLogDao class and the WhatsAppBusinessPartnerMessageLogDao class
export {
  whatsAppBusinessPartnerMessageLogDaoObj,
  WhatsAppBusinessPartnerMessageLogDao,
};
