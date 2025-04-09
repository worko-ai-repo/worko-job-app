// import axios
import axios, { AxiosResponse } from "axios";

// import constants
import { WHATSAPP_APP_CONSTANTS, WHATSAPP_CLOUD_API_ENDPOINTS } from "../configs/constants/Whatsapp.constant";

// import dtos
import {
  WhatsappTemplateCreateResponseDto,
  WhatsappTemplateGetResponseCloudApiDto,
  WhatsappTemplateRequestDtoApi,
  WhatsappTemplateUpdateDtoApi,
} from "../dtos/WhatsappTemplate.dto";

// import enums
import { WhatsappMessagingApiTypeCloudApiEnum } from "../enums/WhatsappTemplate.enum";

/**
 * WhatsappCloudApiLibrary
 *
 * This class serves as a wrapper for the WhatsApp Business API, providing methods to interact with the API endpoints
 * for managing message templates and sending template messages.
 */
class WhatsappCloudApiLibrary {
  private readonly baseUrl: string;
  private readonly apiVersion: string;
  private readonly accessToken: string;
  private readonly fromPhoneNumberId: string;
  private readonly whatsappBusinesssAccountId: string;

  /**
   * Initializes a new instance of the WhatsappCloudApiLibrary.
   * Sets up the necessary configuration from environment variables.
   */
  constructor() {
    this.baseUrl = process.env.APP_WHATSAPP_CLOUD_API_BASE_URL as string;
    this.apiVersion = WHATSAPP_APP_CONSTANTS.API_VERSION;
    this.accessToken = process.env
      .APP_WHATSAPP_CLOUD_API_ACCESS_TOKEN as string;
    this.fromPhoneNumberId = process.env
      .APP_WHATSAPP_CLOUD_API_FROM_PHONE_NUMBER_ID as string;
    this.whatsappBusinesssAccountId = process.env
      .APP_WHATSAPP_CLOUD_API_BUSINESS_ACCOUNT_ID as string;
  }

  /**
   * Prepares the headers for API requests.
   *
   * @param {string} contentType - The content type for the request (default: 'application/json')
   * @returns {Record<string, string>} An object containing the headers
   */
  private prepareHeaders(
    contentType: string = "application/json"
  ): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": contentType,
    };
  }

  /**
   * Creates a new message template in WhatsApp Business API.
   *
   * @param {WhatsappTemplateRequestDtoApi} template - Data transfer object containing the details of the template to be created
   * @returns {Promise<WhatsappTemplateCreateResponseDto>} A promise that resolves to the response from the WhatsApp API
   * @throws {Error} If there's an error creating the template
   */
  async createMessageTemplate(
    template: WhatsappTemplateRequestDtoApi
  ): Promise<WhatsappTemplateCreateResponseDto> {
    global.logger.info("Creating WhatsApp message template", {
      filePath: __filename,
      methodName: this.createMessageTemplate.name,
      template: template,
    });

    // Prepare endpoint for creating WhatsApp message template
    const endpoint = WHATSAPP_CLOUD_API_ENDPOINTS.TEMPLATE_CREATE.strtr({
      "{baseUrl}": this.baseUrl,
      "{apiVersion}": this.apiVersion,
      "{whatsappBusinesssAccountId}": this.whatsappBusinesssAccountId,
    });

    // Send a POST request to create a new message template
    const response = await axios.post(endpoint, template, {
      headers: this.prepareHeaders(),
    });

    // Extract and return the response data
    return response.data;
  }

  /**
   * Updates an existing message template in WhatsApp Business API.
   *
   * @param {string} templateName - The name of the template to be updated
   * @param {WhatsappTemplateUpdateDtoApi} template - Data transfer object containing the updated details of the template
   * @returns {Promise<any>} A promise that resolves to the response from the WhatsApp API
   * @throws {Error} If there's an error updating the template
   */
  async updateMessageTemplate(
    templateName: string,
    template: WhatsappTemplateUpdateDtoApi
  ) {
    global.logger.info("Updating WhatsApp message template", {
      filePath: __filename,
      methodName: this.updateMessageTemplate.name,
      templateName,
      template,
    });

    // Prepare endpoint for updating WhatsApp message template
    const endpoint = WHATSAPP_CLOUD_API_ENDPOINTS.TEMPLATE_UPDATE.strtr({
      "{baseUrl}": this.baseUrl,
      "{apiVersion}": this.apiVersion,
      "{whatsappBusinesssAccountId}": this.whatsappBusinesssAccountId,
    });

    // Send a PUT request to update the existing message template
    const response: AxiosResponse<any, any> = await axios.put(
      endpoint,
      {
        ...template,
        name: templateName,
      },
      {
        headers: this.prepareHeaders(),
      }
    );

    const apiResponse = response.data; // any

    // Return the API response
    return apiResponse;
  }

  /**
   * getMessageTemplateByName
   *
   * Retrieves details of an existing message template from WhatsApp Business API.
   *
   * @param {string} templateName - The name of the template to be retrieved
   * @returns {Promise<WhatsappTemplateGetResponseCloudApiDto>} A promise that resolves to the response from the WhatsApp API
   * @throws {Error} If there's an error retrieving the template
   */
  async getMessageTemplateByName(
    templateName: string
  ): Promise<WhatsappTemplateGetResponseCloudApiDto> {
    global.logger.info("Getting WhatsApp message template", {
      filePath: __filename,
      methodName: this.getMessageTemplateByName.name,
      templateName,
    });

    // Prepare endpoint for retrieving WhatsApp message template
    const endpoint = WHATSAPP_CLOUD_API_ENDPOINTS.TEMPLATE_GET.strtr({
      "{baseUrl}": this.baseUrl,
      "{apiVersion}": this.apiVersion,
      "{whatsappBusinesssAccountId}": this.whatsappBusinesssAccountId,
      "{templateName}": templateName,
    });

    // Send a GET request to retrieve the details of the message template
    const response = await axios.get(endpoint, {
      headers: this.prepareHeaders(),
    });

    // Return the API response
    return response.data;
  }

  /**
   * Deletes an existing message template from WhatsApp Business API.
   *
   * @param {string} templateName - The name of the template to be deleted
   * @returns {Promise<any>} A promise that resolves to the response from the WhatsApp API
   * @throws {Error} If there's an error deleting the template
   */
  async deleteMessageTemplate(templateName: string): Promise<any> {
    global.logger.info("Deleting WhatsApp message template", {
      filePath: __filename,
      methodName: this.deleteMessageTemplate.name,
      templateName,
    });

    // Prepare endpoint for deleting WhatsApp message template
    const endpoint = WHATSAPP_CLOUD_API_ENDPOINTS.TEMPLATE_DELETE.strtr({
      "{baseUrl}": this.baseUrl,
      "{apiVersion}": this.apiVersion,
      "{whatsappBusinesssAccountId}": this.whatsappBusinesssAccountId,
      "{templateName}": templateName,
    });

    // Send a DELETE request to remove the message template
    const response = await axios.delete(endpoint, {
      headers: this.prepareHeaders(),
    });

    // Return the API response
    return response.data;
  }

  /**
   * Sends a WhatsApp message using a template.
   *
   * @param {string} toPhoneNumber - The recipient's phone number
   * @param {string} templateName - The name of the template to be used for the message
   * @param {string} languageCode - The language code for the template message
   * @param {any[]} components - The components of the template message
   * @returns {Promise<any>} A promise that resolves to the response from the WhatsApp API, including the message ID
   * @throws {Error} If there's an error sending the template message
   */
  async sendTemplateMessage(
    toPhoneNumber: string,
    templateName: string,
    languageCode: string,
    components: any[]
  ): Promise<any> {
    global.logger.info("Sending WhatsApp template message", {
      filePath: __filename,
      methodName: this.sendTemplateMessage.name,
      toPhoneNumber,
      templateName,
      languageCode,
      components,
    });

    // Prepare endpoint for sending WhatsApp template message
    const endpoint = WHATSAPP_CLOUD_API_ENDPOINTS.MSG_SEND_USING_TEMPLATE.strtr(
      {
        "{baseUrl}": this.baseUrl,
        "{apiVersion}": this.apiVersion,
        "{fromPhoneNumberId}": this.fromPhoneNumberId,
      }
    );

    // Send a POST request to send a template message to a recipient
    const response = await axios.post(
      endpoint,
      {
        messaging_product: WhatsappMessagingApiTypeCloudApiEnum.WHATSAPP,
        to: toPhoneNumber,
        type: WhatsappMessagingApiTypeCloudApiEnum.TEMPLATE,
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components: components,
        },
      },
      { headers: this.prepareHeaders() }
    );

    // Extract and return the message ID from the response, along with the full response data
    return {
      ...response.data,
      messageId: response.data.messages[0].id,
    };
  }
}

// Export an instance of the WhatsappCloudApiLibrary class for use in other parts of the application
let whatsappCloudApiLibraryObj = new WhatsappCloudApiLibrary();
export { whatsappCloudApiLibraryObj, WhatsappCloudApiLibrary }
