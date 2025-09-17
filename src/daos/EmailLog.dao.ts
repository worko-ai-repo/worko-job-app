// Load the base dao
import BaseDao from "./Base.dao";

// Import DTOs
import { EmailLogCreateDto } from "../dtos/EmailLog.dto";

// Import model
import { DbEmailLogDto, EmailLogModel } from "../db/models/EmailLog.model";

// Load UlidService for generating ULID IDs
import UlidService from "../services/Ulid.service";

// DAO class for handling "Email Log"
class EmailLogDao implements BaseDao {
  // Properties related to database
  modelName = "EmailLog"; // Model name for "Email Logs"
  partitianKey = "EML#LOGS#USR#{toUserEmail}"; // Partition key for "Email Logs"
  sortKeys = {
    SK_INIT: "ID#{id}",
  };
  GSI1PK = "EML#LOGS";
  GSI1SK = "ID#{id}";

  /**
   * createEmailLog
   *
   * Create email log entry in the database
   *
   * @param {EmailLogCreateDto} emailLog
   * @returns {Promise<DbEmailLogDto>}
   */
  async createEmailLog(emailLog: EmailLogCreateDto): Promise<DbEmailLogDto> {
    // Unique ID
    let id: string = UlidService.getUlidId();

    // Prepare the email log details to create entry in the database
    let emailLogCreateRequest = {
      // Copy the the provided email log details
      ...emailLog,

      // Prepare other details (override if already present)
      PK: this.partitianKey.strtr({
        "{toUserEmail}": emailLog.toEmail,
      }),
      SK: this.sortKeys.SK_INIT.strtr({
        "{id}": id,
      }),
      id: id,
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{id}": id,
      }),
    };

    // Logger message
    global.logger.info("Creating email log in local db (request).", {
      filePath: __filename,
      methodName: this.createEmailLog.name,
      templateName: emailLog.templateName,
      toEmail: emailLog.toEmail,
      fromEmail: emailLog.fromEmail,
    });

    // Create email log in local db entry
    return EmailLogModel.create(emailLogCreateRequest);
  }
}

// Export an instance of the EmailLogDao class
const emailLogDao = new EmailLogDao();
export default emailLogDao;
