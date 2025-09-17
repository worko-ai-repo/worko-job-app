// Import Dynamoose libs
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import DTOs
import {
  WhatsappMessageLogCreateDto,
  WhatsappMessageLogUpdateDto,
} from "../dtos/WhatsappMessageLog.dto";
import {
  DbWhatsappMessageLogDto,
  WhatsappMessageLogModel,
} from "../db/models/WhatsappMessageLog.model";

// Import Daos*
import UlidService from "../services/Ulid.service";

// Import services
import BaseDao from "./Base.dao";

/**
 * WhatsappMessageLogDao
 *
 * This data access object (DAO) handles interactions with the WhatsApp message log database table.
 * It implements the BaseDao interface and provides methods to create and retrieve message log entries.
 */
class WhatsappMessageLogDao implements BaseDao {
  modelName = "WhatsappMessage";
  partitianKey = "USR#EML#{primaryEmail}";
  sortKeys = {
    SK_INIT: "WSP#LOGS#ID#{id}",
  };
  GSI1PK = "WSAPP#LOGS";
  GSI1SK = "ID#{messageId}";

  /**
   * Creates a new WhatsApp message log entry in the database.
   *
   * This method generates a unique ID for the log entry, constructs the request payload with the necessary attributes,
   * and saves the log entry to the database.
   *
   * @param {WhatsappMessageLogCreateDto} whatsappMessage - The details of the WhatsApp message to log.
   * @returns {Promise<DbWhatsappMessageLogDto>} - A promise that resolves to the database entry of the created log.
   */
  async createWhatsappMessageLog(
    userEmail: string,
    whatsappMessage: WhatsappMessageLogCreateDto
  ): Promise<DbWhatsappMessageLogDto> {
    // Generat`e a unique ID for the log entry
    let id: string = UlidService.getUlidId();

    // Construct the request payload for the database
    let whatsappMessageCreateRequest = {
      ...whatsappMessage,
      PK: this.partitianKey.replace("{primaryEmail}", userEmail),
      SK: this.sortKeys.SK_INIT.replace("{id}", id),
      id: id,
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.replace(
        "{messageId}",
        whatsappMessage.whatsappMessageId
      ),
    };

    // Log the creation request
    global.logger.info("Creating WhatsApp message log in local db (request).", {
      filePath: __filename,
      methodName: this.createWhatsappMessageLog.name,
      templateName: whatsappMessage.templateName,
      toPhoneNumber: whatsappMessage.toPhoneNumber,
      fromPhoneNumber: whatsappMessage.fromPhoneNumber,
    });

    // Save the log entry to the database
    return WhatsappMessageLogModel.create(whatsappMessageCreateRequest);
  }

  /**
   * Retrieves a WhatsApp message log entry by its message ID.
   * @param {string} messageId - The ID of the message to retrieve.
   * @returns {Promise<DbWhatsappMessageLogDto[]>} - A promise that resolves to the log entries found.
   */
  async getWhatsappMessageLogById(
    messageId: string
  ): Promise<QueryResponse<DbWhatsappMessageLogDto>> {
    global.logger.info(
      "Retrieving WhatsApp message log from local db (request).",
      {
        filePath: __filename,
        methodName: this.getWhatsappMessageLogById.name,
        messageId: messageId,
      }
    );

    // Construct the gsis key
    let GSI1SK = this.GSI1SK.replace("{messageId}", messageId);

    // Query the database
    return WhatsappMessageLogModel.query("GSI1PK")
      .eq(this.GSI1PK)
      .where("GSI1SK")
      .eq(GSI1SK)
      .exec();
  }

  /**
   * Retrieves WhatsApp message log entries.
   * @param {string} [messageId] - The ID of the message to retrieve (optional).
   * @returns {Promise<DbWhatsappMessageLogDto[]>} - A promise that resolves to the log entries found.
   */
  async getWhatsappMessageLogs(
    messageId?: string
  ): Promise<QueryResponse<DbWhatsappMessageLogDto>> {
    global.logger.info(
      "Retrieving WhatsApp message logs from local db (request).",
      {
        filePath: __filename,
        methodName: this.getWhatsappMessageLogs.name,
        messageId: messageId,
      }
    );

    // Construct the sort key if messageId is provided
    let GSI1SK = messageId
      ? this.GSI1SK.replace("{messageId}", messageId)
      : undefined;

    // Query the database
    if (messageId) {
      return WhatsappMessageLogModel.query("GSI1PK")
        .eq(this.GSI1PK)
        .where("GSI1SK")
        .eq(GSI1SK)
        .exec(); // Promise<QueryResponse<DbWhatsappMessageLogDto>>
    } else {
      return WhatsappMessageLogModel.query("GSI1PK").eq(this.GSI1PK).exec(); // Promise<QueryResponse<DbWhatsappMessageLogDto>>
    }
  }

  /**
   * Updates a WhatsApp message log entry in the database.
   * @param {string} userEmail - The email of the user associated with the message log.
   * @param {string} id - The ID of the message log entry to update.
   * @param {WhatsappMessageLogUpdateDto} updateBodyDetails - The details to update.
   * @returns {Promise<DbWhatsappMessageLogDto>} - A promise that resolves to the updated log entry.
   */
  async updateWhatsappMessageLog(
    userEmail: string,
    id: string,
    updateBodyDetails: WhatsappMessageLogUpdateDto
  ): Promise<DbWhatsappMessageLogDto> {
    // Construct the primary key
    let inputKey = {
      PK: this.partitianKey.replace("{primaryEmail}", userEmail),
      SK: this.sortKeys.SK_INIT.replace("{id}", id),
    };

    // Update the log entry in the database
    return WhatsappMessageLogModel.update(inputKey, updateBodyDetails);
  }
}

// Export a singleton instance of the WhatsappMessageLogDao class
const whatsappMessageLogDao = new WhatsappMessageLogDao();
export default whatsappMessageLogDao;