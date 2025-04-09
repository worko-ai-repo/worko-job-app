// Import DAOs
import emailLogDao from "../daos/EmailLog.dao";

// Import DTOs
import { EmailLogCreateDto } from "../dtos/EmailLog.dto";

// Import models
import { DbEmailLogDto } from "../db/models/EmailLog.model";

/**
 * EmailLogService
 *
 * Class responsible for managing Email Logs related operations.
 */
class EmailLogService {
  /**
   * constructor
   */
  constructor() {}

  /**
   * createEmailLog
   *
   * Create email log entry in the database
   *
   * @param {EmailLogCreateDto} emailLog
   * @returns {Promise<DbEmailLogDto>}
   */
  async createEmailLog(emailLog: EmailLogCreateDto): Promise<DbEmailLogDto> {
    return emailLogDao.createEmailLog(emailLog);
  }
}

// Export an instance of the EmailLogService class
const emailLogService = new EmailLogService();
export default emailLogService;
