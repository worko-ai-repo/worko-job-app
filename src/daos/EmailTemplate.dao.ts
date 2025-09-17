// Load the base dao
import BaseDao from "./Base.dao";

// import dtos
import { EmailTemplateCreateDto, EmailTemplateUpdateDto } from "../dtos/EmailTemplate.dto";

// Import enums
import { EmailTemplateStatusEnum } from "../enums/EmailTemplate.enum";

// Load the local models
import {
  DbEmailTemplateDto,
  EmailTemplateModel,
} from "../db/models/EmailTemplate.model";

// Load UlidService for generating ULID IDs
import UlidService from "../services/Ulid.service";

// DAO class for handling "Master Email Templates"
class EmailTemplateDao implements BaseDao {
  // Properties related to database
  modelName = "EmailTemplate"; // Model name for "Master Email Templates"
  partitianKey = "NOTIF#TEMP"; // Partition key for "Master Email Templates"
  sortKeys = {
    SK_INIT: "EMAIL#{templateName}",
  }; // Sort keys for "Master Email Templates"
  GSI1PK = "NOTIF#TEMP#EMAIL";
  GSI1SK = "EMAIL#{templateName}";

  /**
   * getEmailTemplateByTemplateName
   *
   * Get a master email template by the provided template name
   *
   * @param {string} templateName
   * @returns {Promise<DbEmailTemplateDto | undefined>}
   */
  async getEmailTemplateByTemplateName(
    templateName: string
  ): Promise<DbEmailTemplateDto | undefined> {
    // Prepare the PK & SK
    const PK = this.partitianKey;
    const SK = this.sortKeys.SK_INIT.strtr({
      "{templateName}": templateName,
    });

    // Logger message
    global.logger.info(
      "Get the master email template details for the provided template name (request).",
      {
        filePath: __filename,
        methodName: this.getEmailTemplateByTemplateName.name,
        templateName: templateName,
        PK: PK,
        SK: SK,
      }
    );

    // Get the template details and return
    return EmailTemplateModel.get({ PK, SK });
  }

  /**
   * createEmailTemplate
   *
   * Create Email Template in local database
   *
   * @param {EmailTemplateCreateDto} template
   * @returns {Promise<DbEmailTemplateDto>}
   */
  async createEmailTemplate(
    template: EmailTemplateCreateDto
  ): Promise<DbEmailTemplateDto> {
    // Email template id
    let id: string = UlidService.getUlidId();

    // Prepare the email template details to create entry in the database
    const templateDbDetails = {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_INIT.strtr({
        "{templateName}": template.templateName,
      }),
      id: id,
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.strtr({
        "{templateName}": template.templateName,
      }),
      templateName: template.templateName,
      status: EmailTemplateStatusEnum.ENABLED,
      subject: template.subject,
      title: template.title,
      bodyHtml: template.bodyHtml,
      bodyText: template.bodyText,
      placeholders: template.placeholders,
      description: template.description,
      createdByUserId: template.createdByUserId,
    };

    // Logger message
    global.logger.info(
      "Creating master email template in local db (request).",
      {
        filePath: __filename,
        methodName: this.createEmailTemplate.name,
        templateParamDetails: template,
        templateDbDetails: templateDbDetails,
      }
    );

    // Create a new master email template local db entry
    return EmailTemplateModel.create(templateDbDetails);
  }

  /**
   * updateEmailTemplate
   *
   * Update Email Template in local database
   *
   * @param {EmailTemplateUpdateDto} template
   * @returns {Promise<DbEmailTemplateDto>}
   */
  async updateEmailTemplate(
    template: EmailTemplateUpdateDto
  ): Promise<DbEmailTemplateDto> {
    // Prepare the email template details to update in the database
    const templateDbDetails = {
      status: template.status,
      subject: template.subject,
      title: template.title,
      bodyHtml: template.bodyHtml,
      bodyText: template.bodyText,
      placeholders: template.placeholders,
      description: template.description,
      updatedByUserId: template.updatedByUserId,
    };

    // Logger message
    global.logger.info(
      "Updating master email template in local db (request).",
      {
        filePath: __filename,
        methodName: this.updateEmailTemplate.name,
        templateParamDetails: template,
        templateDbDetails: templateDbDetails,
      }
    );

    // Update the master email template local db entry
    let PK: string = this.partitianKey;
    let SK: string = this.sortKeys.SK_INIT.strtr({
      "{templateName}": template.templateName,
    });
    return EmailTemplateModel.update({ PK: PK, SK: SK }, templateDbDetails);
  }

  /**
   * deleteEmailTemplateByName
   *
   * Delete the already created email template from local database.
   *
   * Note: The delete should not be allowed usually.
   * If you really want to delete the template then know that once it is deleted it cannot be used or recovered.
   *
   * @param {string} templateName
   * @returns {Promise<void>}
   */
  async deleteEmailTemplateByName(templateName: string): Promise<void> {
    // Logger message
    global.logger.warn(
      "Deleting master email template from local database (data).",
      {
        filePath: __filename,
        methodName: this.deleteEmailTemplateByName.name,
        templateName: templateName,
      }
    );

    // Prepare details required to delete the email template and actually delete it
    let PK: string = this.partitianKey;
    let SK: string = this.sortKeys.SK_INIT.strtr({
      "{templateName}": templateName,
    });
    return EmailTemplateModel.delete({ PK: PK, SK: SK });
  }
}

// Export an instance of the EmailTemplateDao class
const emailTemplateDao = new EmailTemplateDao();
export default emailTemplateDao;
