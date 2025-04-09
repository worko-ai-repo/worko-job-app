// Import installed packages
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Import the base dao class
import BaseDao from "./Base.dao";

// Import the data transfer objects (DTOs) for WhatsApp templates
import {
  DbWhatsappTemplateDto,
  WhatsappTemplateModel,
} from "../db/models/WhatsappTemplate.model";

// Import the service for generating unique IDs
import UlidService from "../services/Ulid.service";

// Import the DTOs for WhatsApp template operations
import {
  WhatsappTemplateCreateResponseDtoApi,
  WhatsappTemplateUpdateDto,
} from "../dtos/WhatsappTemplate.dto";

/**
 * WhatsappTemplateDao
 *
 * Class responsible for managing WhatsApp message template-related operations and interacting with DynamoDB.
 * Implements the `BaseDao` interface to provide methods for creating, retrieving, and updating WhatsApp message templates.
 */
class WhatsappTemplateDao implements BaseDao {
  // The name of the model used for database operations
  modelName: string = "WhatsappTemplate";
  partitianKey: string = "NOTIF#TEMP";
  sortKeys = {
    SK_INIT: "WSP#{templateName}", // Sort key for the template, where `templateName` is a placeholder for the actual template name
  };

  GSI1PK: string = "NOTIF#TEMP#WSP";
  GSI1SK: string = "ID#{id}";

  /**
   * Creates a new WhatsApp message template in the local database.
   *
   * This method generates a unique ID for the template, prepares the necessary details for the database entry,
   * and saves the template details to DynamoDB.
   *
   * @param {WhatsappTemplateCreateResponseDtoApi} template - The details of the WhatsApp template to create.
   * @returns {Promise<DbWhatsappTemplateDto>} - A promise that resolves to the database entry of the created template.
   */
  async createWhatsappTemplate(
    template: WhatsappTemplateCreateResponseDtoApi
  ): Promise<DbWhatsappTemplateDto> {
    // Generate a unique ID for the new template
    let id: string = UlidService.getUlidId();

    // Construct the request payload for the database
    const templateDbDetails = {
      ...template,
      PK: this.partitianKey,
      SK: this.sortKeys.SK_INIT.replace(
        "{templateName}",
        template.whatsappTemplateName
      ),
      id: id, // Unique ID for the template
      GSI1PK: this.GSI1PK,
      GSI1SK: this.GSI1SK.replace("{id}", id),
    };

    // Log the request details for creating the template
    global.logger.info("Creating WhatsApp template in local db (request).", {
      filePath: __filename,
      methodName: this.createWhatsappTemplate.name,
      templateParamDetails: template,
      templateDbDetails: templateDbDetails,
    });

    // Return the result of the create operation
    return WhatsappTemplateModel.create(templateDbDetails);
  }

  /**
   * Retrieves a WhatsApp message template from the local database by its name.
   *
   * This method constructs the query parameters to retrieve the template details from DynamoDB.
   *
   * @param {string} templateName - The name of the WhatsApp template to retrieve.
   * @returns {Promise<DbWhatsappTemplateDto>} - A promise that resolves to the database entry of the requested template.
   */
  async getWhatsappTemplateByName(
    templateName: string
  ): Promise<DbWhatsappTemplateDto> {
    // Construct the sort key for the query
    let SK = this.sortKeys.SK_INIT.replace("{templateName}", templateName);

    // Log the request details for retrieving the template
    global.logger.info(
      "Get the WhatsApp template details for the provided template name (request).",
      {
        filePath: __filename,
        methodName: this.getWhatsappTemplateByName.name,
        templateName: templateName,
        PK: this.partitianKey,
        SK: SK,
      }
    );

    // Return the result of the get operation
    return WhatsappTemplateModel.get({ PK: this.partitianKey, SK: SK });
  }

  /**
   * Execute the query and return the results
   *
   * @return {Promise<QueryResponse<DbWhatsappTemplateDto>>} - Results of the query execution
   */
  async getAllWhatsappTemplates(): Promise<
    QueryResponse<DbWhatsappTemplateDto>
  > {
    // Execute the query and return the results
    return WhatsappTemplateModel.query("GSI1PK").eq(this.GSI1PK).exec();
  }

  /**
   * Updates an existing WhatsApp message template in the local database.
   *
   * This method prepares the key and update request body for the update operation and then performs the update.
   *
   * @param {string} templateName - The name of the template to update.
   * @param {WhatsappTemplateUpdateDto} updateRequestBody - The updated data for the template.
   * @returns {Promise<DbWhatsappTemplateDto>} - A promise that resolves to the updated template object.
   */
  async updateWhatsappTemplate(
    templateName: string,
    updateRequestBody: WhatsappTemplateUpdateDto
  ): Promise<DbWhatsappTemplateDto> {
    // Prepare the key for the update operation
    let inputKey = {
      PK: this.partitianKey,
      SK: this.sortKeys.SK_INIT.replace("{templateName}", templateName),
    };

    // Log the request details for updating the template
    global.logger.info("Updating WhatsApp template in local db (request).", {
      filePath: __filename,
      methodName: this.updateWhatsappTemplate.name,
      templateName: templateName,
      updateRequestBody: updateRequestBody,
    });

    // Return the result of the update operation
    return WhatsappTemplateModel.update(inputKey, updateRequestBody);
  }
}

// Create and export the instance of WhatsappTemplateDao
const whatsappTemplateDao = new WhatsappTemplateDao();
export default whatsappTemplateDao;
