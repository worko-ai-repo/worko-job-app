// Load Dynamoose Library
import { QueryResponse } from "dynamoose/dist/ItemRetriever";

// Load local DAOs for interacting with the database
import whatsappTemplateDao from "../daos/WhatsappTemplate.dao";

// Load local DTOs for data transfer and API responses
import {
  WhatsappTemplateCreateDto,
  WhatsappTemplateCreateResponseDtoApi,
  WhatsappTemplateGetResponseCloudApiDto,
  WhatsappTemplateUpdateDto,
} from "../dtos/WhatsappTemplate.dto";

// Load local libraries for interacting with the WhatsApp Business API
import { whatsappCloudApiLibraryObj } from "../libraries/WhatsappCloudApi.library";

// Load local utilities for error handling and HTTP status codes
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

// Load local enums for template status
import { WhatsappTemplateStatusEnum } from "../enums/WhatsappTemplate.enum";

// Load local DB model DTOs for database interactions
import { DbWhatsappTemplateDto } from "../db/models/WhatsappTemplate.model";

/**
 * Service class for handling WhatsApp template operations including creation,
 * retrieval, and updating of templates.
 */
class WhatsappTemplateService {
  /**
   * Creates a new WhatsApp template using the WhatsApp Business API and stores
   * the template details in the local database.
   *
   * @param {WhatsappTemplateCreateDto} whatsappTemplate - Data transfer object for creating a WhatsApp template.
   * @returns {Promise<DbWhatsappTemplateDto>} Returns the created WhatsApp template details from the database.
   * @throws {BaseError} Throws error if the template is not found in the WhatsApp Cloud API.
   */
  async createWhatsappTemplate(
    whatsappTemplateBody: WhatsappTemplateCreateDto
  ): Promise<DbWhatsappTemplateDto> {
    global.logger.info("Creating Whatsapp Temaplate [Service]");

    // Before creating whatsapp template, check if the template already exists in the database , if exists then throw error with sutiable message
    const existingWhatsappTemplate = await this.getWhatsappTemplateByName(
      whatsappTemplateBody.whatsappTemplateName
    );
    if (existingWhatsappTemplate) {
      throw new BaseError(
        "WhatsApp template already exists in the database.",
        HttpStatusCode.CONFLICT_409
      );
    }

    /*===============================================/
      ==== CALL THE WHATSAPP CLOUD GET TEMPLATE API ===
      ==== TO CHECK THE EXISTENCE OF THE TEMPLATE =====
    /===============================================*/
    // whatsaCloudApiLibrary
    const whatsappCloudApiTemplateDetails: WhatsappTemplateGetResponseCloudApiDto =
      await whatsappCloudApiLibraryObj.getMessageTemplateByName(
        whatsappTemplateBody.whatsappTemplateName
      );

    // Check if the response contains a valid template ID
    if (!whatsappCloudApiTemplateDetails?.data[0].id) {
      throw new BaseError(
        "Could not find any WhatsApp template in Cloud API. Please ensure to pass the correct template name.",
        HttpStatusCode.NOT_FOUND_404
      );
    }

    // Log the API response for creating the template
    global.logger.info(
      "Creating WhatsApp template in WhatsApp Business API (response).",
      {
        filePath: __filename,
        methodName: this.createWhatsappTemplate.name,
        whatsappCloudApiTemplateDetails,
      }
    );

    // Prepare the DB request payload for creating a WhatsApp template
    const createWhatsappTempDbData: WhatsappTemplateCreateResponseDtoApi = {
      whatsappTemplateName: whatsappCloudApiTemplateDetails.data[0].name,
      whatsappLanguage: whatsappCloudApiTemplateDetails.data[0].language,
      whatsappCategory: whatsappCloudApiTemplateDetails.data[0].category,
      templatePlaceholders: whatsappTemplateBody.templatePlaceholders,
      whatsappComponents: whatsappCloudApiTemplateDetails.data[0].components,
      status: whatsappTemplateBody.status, // This will be added internally while processing the API as default `ENABLED`.
      createdByUserId: whatsappTemplateBody.createdByUserId,
      whatsappTemplateId: whatsappCloudApiTemplateDetails.data[0].id,
      whatsappTemplateStatus: whatsappCloudApiTemplateDetails.data[0].status,
    };

    // Save the template details to the local database
    const createWhatsappTemplate =
      await whatsappTemplateDao.createWhatsappTemplate(
        createWhatsappTempDbData
      );

    // Log the result of saving the template to the database
    global.logger.info("Creating WhatsApp template in local DB (response).", {
      filePath: __filename,
      methodName: this.createWhatsappTemplate.name,
      createWhatsappTemplate,
    });

    // Return the saved WhatsApp template details
    return createWhatsappTemplate;
  }

  /**
   * Retrieves a WhatsApp template by name from the local database and updates
   * the status if there are changes in the API response.
   *
   * @param {string} name - The name of the WhatsApp template to retrieve.
   * @returns {Promise<DbWhatsappTemplateDto>} Returns the retrieved WhatsApp template details from the database.
   * @throws {BaseError} Throws error if the template is not found in the local database.
   */
  async getWhatsappTemplateByName(
    name: string
  ): Promise<DbWhatsappTemplateDto> {
    global.logger.info("Fetching WhatsApp template [Service]", {
      filePath: __filename,
      methodName: this.getWhatsappTemplateByName.name,
      templateName: name,
    });

    // Return the WhatsApp template details from the local database
    return whatsappTemplateDao.getWhatsappTemplateByName(name);
  }

  /**
   * Updates the details of an existing WhatsApp template in the local database.
   *
   * @param {string} templateName - The name of the WhatsApp template to update.
   * @param {WhatsappTemplateUpdateDto} updateTemplateDetails - Data transfer object containing update details.
   * @returns {Promise<DbWhatsappTemplateDto>} Returns the updated WhatsApp template details from the database.
   */
  async updateWhatsappTemplate(
    templateName: string,
    updateTemplateDetails: WhatsappTemplateUpdateDto
  ): Promise<DbWhatsappTemplateDto> {
    // Call the DAO method to update the WhatsApp template in the local database
    return whatsappTemplateDao.updateWhatsappTemplate(
      templateName,
      updateTemplateDetails
    );
  }

  /**
   * Retrieves all WhatsApp templates from the local database.
   *
   * @return {Promise<QueryResponse<DbWhatsappTemplateDto>>} A promise that resolves to a QueryResponse containing the details of all WhatsApp templates.
   */
  async getAllWhatsappTemplates(): Promise<
    QueryResponse<DbWhatsappTemplateDto>
  > {
    // Call the DAO method to get all WhatsApp templates from the local database
    return whatsappTemplateDao.getAllWhatsappTemplates();
  }
}

// Export an instance of the WhatsappTemplateService class
const whatsappTemplateServiceObj = new WhatsappTemplateService();
export { whatsappTemplateServiceObj, WhatsappTemplateService };
